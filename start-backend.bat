@echo off
echo Setting up environment variables...
set OPENROUTER_API_KEY=your_actual_api_key_here
set GEMINI_MODEL=google/gemini-1.5-flash-8b
set POLLINATION_API_KEY=your_pollination_api_key_here

echo Starting Flask backend...
cd backend
python app.py
pause
