from flask import Flask, request, jsonify
from flask_cors import CORS
import os, json, re, requests
from dotenv import load_dotenv
import PyPDF2
from pdf2image import convert_from_path
import pytesseract

# ---- Setup ----
app = Flask(__name__)
CORS(app)
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Optional: Windows Tesseract path
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ---- Extract text ----
def extract_text(file_path):
    text = ""
    if file_path.endswith(".pdf"):
        try:
            reader = PyPDF2.PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() or ""
        except:
            text = ""
    return text.strip()

def extract_text_with_ocr(file_path):
    text = ""
    try:
        images = convert_from_path(file_path)
        for img in images:
            text += pytesseract.image_to_string(img)
    except:
        pass
    return text

def smart_extract_text(file_path):
    text = extract_text(file_path)
    if len(text.strip()) < 50:
        text = extract_text_with_ocr(file_path)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"Page\s*\d+", "", text)
    return text[:5000]  # limit for AI

# ---- Upload & generate quiz ----
@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        file = request.files["file"]
        num_questions = int(request.form.get("num_questions", 5))
        subject = request.form.get("subject", "General Knowledge")

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        text = smart_extract_text(file_path)
        if not text:
            return jsonify({"error": "Could not extract text"}), 400

        prompt = f"""
        You are an AI Quiz Generator.
        Create exactly {num_questions} multiple-choice questions for the subject "{subject}".
        Use the text below to generate meaningful questions.
        Avoid generating a question per word or sentence.
        Text:
        {text}

        Format your response as JSON array:
        [
          {{
            "question": "...",
            "options": ["A", "B", "C", "D"],
            "correct_answer": "..."
          }}
        ]
        """

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "mistralai/mistral-7b-instruct",
                "messages": [{"role": "user", "content": prompt}],
            },
        )
        data = response.json()
        content = data["choices"][0]["message"]["content"]

        # Safely extract JSON
        start_idx = content.find("[")
        end_idx = content.rfind("]") + 1
        quiz_questions = json.loads(content[start_idx:end_idx])

        return jsonify({"questions": quiz_questions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Submit quiz ----
@app.route("/submit", methods=["POST"])
def submit_quiz():
    try:
        data = request.json
        answers = data.get("answers", [])
        correct = sum(1 for a in answers if a.get("isCorrect"))
        total = len(answers)
        score = round((correct / total) * 100, 2) if total else 0
        return jsonify({"score": score})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return "Quiz Backend Running!"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
