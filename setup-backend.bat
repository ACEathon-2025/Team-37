@echo off
echo Setting up EmoLearn Backend...
echo.

echo 1. Activating virtual environment...
cd backend
call venv\Scripts\activate

echo 2. Installing dependencies...
pip install -r requirements.txt

echo 3. Starting Flask server...
echo.
echo Backend will be available at: http://127.0.0.1:5000
echo Press Ctrl+C to stop the server
echo.
python app.py
