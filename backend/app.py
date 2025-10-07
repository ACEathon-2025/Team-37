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

POLLINATION_API_KEY = os.getenv("POLLINATION_API_KEY", "")
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
    # Prefer OpenRouter/Gemini if configured, else fallback to legacy Pollination API
    if OPENROUTER_API_KEY:
        questions = generate_quiz_via_openrouter(text, num_questions)
        if questions:
            return questions
    if not POLLINATION_API_KEY:
        return []
    prompt = build_quiz_prompt(text, num_questions)
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {POLLINATION_API_KEY}",
    }
    payload = {"model": "gemini-pro", "prompt": prompt, "max_tokens": 1800}
    try:
        response = requests.post(
            "https://api.pollination.ai/v1/generate",
            headers=headers,
            json=payload,
            timeout=60,
        )
        result = response.json().get("output", "")
        parsed = parse_questions(result)
        if not parsed:
            return _fallback_generate_mcqs(text, num_questions, subject, topics)
        return parsed
    except Exception as e:
        print("Error calling Pollination API:", e)
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
    if feedback is None and POLLINATION_API_KEY:
        # Fallback to Pollination
        feedback_prompt = (
            f"A student scored {accuracy}% with average stress level {avg_stress}. "
            "Suggest what topics to revise and how to improve."
        )
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {POLLINATION_API_KEY}",
        }
        payload = {
            "model": "gemini-pro",
            "prompt": feedback_prompt,
            "max_tokens": 500,
        }
        try:
            response = requests.post(
                "https://api.pollination.ai/v1/generate",
                headers=headers,
                json=payload,
                timeout=60,
            )
            feedback = response.json().get("output", None)
        except Exception as e:
            print("Error generating feedback:", e)
            feedback = None
    if feedback is None:
        feedback = "Could not generate feedback at this time."

    return jsonify({
        "score": accuracy,
        "avg_stress": avg_stress,
        "feedback": feedback
    })

if __name__ == "__main__":
    app.run(debug=True)
