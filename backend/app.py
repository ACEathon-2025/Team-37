from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import requests
import json
import ast
import os
from io import BytesIO
try:
    import docx  # python-docx
except Exception:
    docx = None

app = Flask(__name__)
CORS(app)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "google/gemini-1.5-flash-8b")

# --- Helper: Extract text from PDF, DOCX, or TXT ---
def extract_text(file):
    filename = (file.filename or "").lower()
    text = ""
    if filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    elif filename.endswith(".docx") and docx is not None:
        # Read bytes into python-docx
        data = file.read()
        document = docx.Document(BytesIO(data))
        paragraphs = [p.text for p in document.paragraphs if p.text]
        text = "\n".join(paragraphs)
    else:
        # Fallback: treat as UTF-8 text
        text = file.read().decode("utf-8", errors="ignore")
    return text[:16000]  # Limit to avoid token overflow

SYSTEM_INSTRUCTIONS = (
    "You are a helpful educational content generator. "
    "Return strictly valid JSON arrays without any commentary."
)

def build_quiz_prompt(text, num_questions):
    return (
        f"Generate {num_questions} MCQs from the following content.\n"
        "Return a JSON array of objects with: \n"
        "question (string), options (array of 4 short strings), correct_answer (one of the options).\n"
        "Avoid explanations or markdown.\n\n"
        f"Content:\n{text}"
    )

def parse_questions(text_output):
    try:
        return json.loads(text_output)
    except Exception:
        try:
            return ast.literal_eval(text_output)
        except Exception:
            return []

def generate_quiz_via_openrouter(text, num_questions=10):
    if not OPENROUTER_API_KEY:
        return None
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    prompt = build_quiz_prompt(text, num_questions)
    payload = {
        "model": GEMINI_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_INSTRUCTIONS},
            {"role": "user", "content": prompt},
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 2000,
        "temperature": 0.4,
    }
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=60)
        data = r.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        if not content:
            return []
        # In case the model wrapped it as an object, try to locate array
        parsed = json.loads(content)
        if isinstance(parsed, dict) and "questions" in parsed:
            return parsed.get("questions", [])
        if isinstance(parsed, list):
            return parsed
        return []
    except Exception as e:
        print("OpenRouter generation error:", e)
        return []

def generate_feedback_via_openrouter(accuracy, avg_stress):
    if not OPENROUTER_API_KEY:
        return None
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    user_prompt = (
        f"A student scored {accuracy}% with average stress level {avg_stress}. "
        "Give concise, actionable revision guidance in 3-5 bullet points."
    )
    payload = {
        "model": GEMINI_MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful tutor."},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 400,
        "temperature": 0.5,
    }
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=60)
        data = r.json()
        return data.get("choices", [{}])[0].get("message", {}).get("content", "") or None
    except Exception as e:
        print("OpenRouter feedback error:", e)
        return None

def _fallback_generate_mcqs(text: str, num_questions: int, subject: str | None, topics: str | None):
    # Very simple fallback generator to avoid empty responses if AI unavailable
    # Builds generic questions using keywords from topics/text
    base_subject = subject or "General"
    topic_words = []
    if topics:
        topic_words = [t.strip() for t in topics.split(',') if t.strip()]
    if not topic_words and text:
        # Pick some words from the text
        tokens = [w for w in text.split() if w.isalpha() and 3 <= len(w) <= 12]
        topic_words = list(dict.fromkeys(tokens))[:8]
    def mk_q(i: int):
        stem = topic_words[i % len(topic_words)] if topic_words else f"concept {i+1}"
        question = f"Which statement about {stem} is correct?"
        correct = f"Basic fact about {stem}"
        options = [
            correct,
            f"Unrelated detail about {base_subject}",
            f"Common misconception about {stem}",
            f"Irrelevant statement",
        ]
        return {
            "question": question,
            "options": options,
            "correct_answer": correct,
        }
    return [mk_q(i) for i in range(max(1, num_questions))]

def generate_quiz(text, num_questions=10, subject: str | None = None, topics: str | None = None):
    # Use OpenRouter/Gemini if configured, else fallback to simple generator
    if OPENROUTER_API_KEY:
        questions = generate_quiz_via_openrouter(text, num_questions)
        if questions:
            return questions
    
    # Fallback to simple question generator
    return _fallback_generate_mcqs(text, num_questions, subject, topics)

# --- Route: Upload file + generate quiz ---
@app.route("/upload", methods=["POST", "GET", "OPTIONS"])
def upload_file():
    if request.method != "POST":
        return jsonify({
            "endpoint": "/upload",
            "usage": "POST multipart/form-data with fields: file (pdf/txt/docx), num_questions (int)",
            "status": "ready"
        })
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    num_q = int(request.form.get("num_questions", 10))
    subject = request.form.get("subject")
    topics = request.form.get("topics")
    text = extract_text(file)
    if not text.strip():
        # Even if extraction fails, produce generic questions so UI doesn't break
        questions = _fallback_generate_mcqs(text, num_q, subject, topics)
    else:
        questions = generate_quiz(text, num_q, subject, topics)
    return jsonify({"questions": questions})

# --- Route: Submit quiz answers + stress data ---
@app.route("/submit", methods=["POST", "GET", "OPTIONS"])
def submit_quiz():
    if request.method != "POST":
        return jsonify({
            "endpoint": "/submit",
            "usage": "POST application/json with fields: answers:[{isCorrect: bool}], stress:[number]",
            "status": "ready"
        })
    data = request.get_json()
    answers = data.get("answers", [])
    stress = data.get("stress", [])

    total = len(answers)
    if total == 0:
        return jsonify({"error": "No answers submitted"}), 400

    correct = sum(1 for a in answers if a.get("isCorrect"))
    accuracy = round((correct / total) * 100, 2)
    avg_stress = round(sum(stress) / len(stress), 2) if stress else 0

    feedback = None
    if OPENROUTER_API_KEY:
        feedback = generate_feedback_via_openrouter(accuracy, avg_stress)
    
    if feedback is None:
        # Simple fallback feedback
        if accuracy >= 90:
            feedback = "Excellent work! You've mastered this material. Consider exploring more advanced topics."
        elif accuracy >= 70:
            feedback = "Good job! You're on the right track. Review the incorrect answers and practice similar problems."
        elif accuracy >= 50:
            feedback = "Keep practicing! Focus on understanding the fundamental concepts before moving to advanced topics."
        else:
            feedback = "Don't worry, learning takes time! Review the material thoroughly and try again. Consider breaking down complex topics into smaller parts."

    return jsonify({
        "score": accuracy,
        "avg_stress": avg_stress,
        "feedback": feedback
    })

# --- Route: AI Tutor Chat ---
@app.route("/tutor/chat", methods=["POST", "GET", "OPTIONS"])
def tutor_chat():
    if request.method != "POST":
        return jsonify({
            "endpoint": "/tutor/chat",
            "usage": "POST application/json with fields: message (string), stress_level (string), conversation_history (array)",
            "status": "ready"
        })
    
    data = request.get_json()
    message = data.get("message", "").strip()
    stress_level = data.get("stress_level", "low")  # low, medium, high
    conversation_history = data.get("conversation_history", [])
    
    if not message:
        return jsonify({"error": "No message provided"}), 400
    
    # Build context-aware system prompt based on stress level
    stress_context = {
        "low": "The student is calm and focused. Provide detailed explanations and encourage deeper exploration.",
        "medium": "The student shows some stress. Keep explanations clear and concise, offer encouragement.",
        "high": "The student is stressed. Provide simple, reassuring explanations. Focus on building confidence and suggest breaks if needed."
    }
    
    system_prompt = f"""You are an empathetic AI tutor that adapts to student stress levels. 
Current stress level: {stress_level}
{stress_context.get(stress_level, stress_context["low"])}

Guidelines:
- Be encouraging and supportive
- Adapt explanation complexity to stress level
- If stress is high, suggest taking breaks
- Use examples and analogies to clarify concepts
- Ask follow-up questions to check understanding
- Keep responses conversational and helpful"""
    
    # Build conversation context
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add recent conversation history (last 6 messages to avoid token limits)
    recent_history = conversation_history[-6:] if conversation_history else []
    for msg in recent_history:
        if isinstance(msg, dict) and "role" in msg and "content" in msg:
            messages.append({"role": msg["role"], "content": msg["content"]})
    
    # Add current message
    messages.append({"role": "user", "content": message})
    
    # Generate response using OpenRouter
    if not OPENROUTER_API_KEY:
        return jsonify({
            "response": "I'm sorry, the AI tutor service is currently unavailable. Please try again later.",
            "error": "No API key configured"
        }), 503
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "model": GEMINI_MODEL,
        "messages": messages,
        "max_tokens": 800,
        "temperature": 0.7,
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        data = response.json()
        
        if response.status_code != 200:
            return jsonify({
                "response": "I'm having trouble connecting right now. Please try again in a moment.",
                "error": f"API error: {response.status_code}"
            }), 503
        
        ai_response = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        
        if not ai_response:
            return jsonify({
                "response": "I didn't quite understand that. Could you rephrase your question?",
                "error": "Empty response from AI"
            }), 503
        
        return jsonify({
            "response": ai_response,
            "stress_level": stress_level,
            "timestamp": data.get("created", None)
        })
        
    except requests.exceptions.Timeout:
        return jsonify({
            "response": "I'm taking a bit longer to respond. Please wait a moment and try again.",
            "error": "Request timeout"
        }), 503
    except Exception as e:
        print("Tutor chat error:", e)
        return jsonify({
            "response": "I'm experiencing some technical difficulties. Please try again later.",
            "error": str(e)
        }), 500

# --- Route: Emotion logging for analytics ---
@app.route("/emotion-log", methods=["POST", "GET", "OPTIONS"])
def emotion_log():
    if request.method != "POST":
        return jsonify({
            "endpoint": "/emotion-log",
            "usage": "POST application/json with fields: stress_score (number), timestamp (optional)",
            "status": "ready"
        })
    
    data = request.get_json()
    stress_score = data.get("stress_score", 0)
    timestamp = data.get("timestamp")
    
    # In a real app, you'd store this in a database
    # For now, just acknowledge receipt
    print(f"Emotion logged: stress_score={stress_score}, timestamp={timestamp}")
    
    return jsonify({
        "status": "logged",
        "stress_score": stress_score,
        "timestamp": timestamp
    })

if __name__ == "__main__":
    app.run(debug=True)
