#!/bin/bash
echo "Setting up environment variables..."
export OPENROUTER_API_KEY="your_actual_api_key_here"
export GEMINI_MODEL="google/gemini-1.5-flash-8b"
export POLLINATION_API_KEY="your_pollination_api_key_here"

echo "Starting Flask backend..."
cd backend
python app.py
