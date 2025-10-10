# AI Tutor Backend Integration

## Setup

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Set environment variables:
```bash
# Required for AI tutor functionality
export OPENROUTER_API_KEY="your_openrouter_api_key_here"
export GEMINI_MODEL="google/gemini-1.5-flash-8b"
```

Or create a `.env` file in the backend directory:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
GEMINI_MODEL=google/gemini-1.5-flash-8b
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:5000
```

3. Run the Flask server:
```bash
python app.py
```

## API Endpoints

### `/tutor/chat` (POST)
AI tutor chat endpoint with stress-aware responses.

**Request:**
```json
{
  "message": "Explain derivatives in simple terms",
  "stress_level": "medium",
  "conversation_history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help you learn today?"}
  ]
}
```

**Response:**
```json
{
  "response": "Great question! Let me explain derivatives step by step...",
  "stress_level": "medium",
  "timestamp": 1234567890
}
```

### `/emotion-log` (POST)
Log emotion/stress data for analytics.

**Request:**
```json
{
  "stress_score": 45.2,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "status": "logged",
  "stress_score": 45.2,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Features

- **Stress-Aware AI Responses**: Adapts explanation complexity based on detected stress levels
- **Conversation Context**: Maintains chat history for better responses
- **Error Handling**: Graceful fallbacks when AI services are unavailable
- **Emotion Analytics**: Logs stress data for future analysis

## Stress Level Adaptation

- **Low Stress**: Detailed explanations, encourages deeper exploration
- **Medium Stress**: Clear and concise, offers encouragement
- **High Stress**: Simple explanations, builds confidence, suggests breaks
