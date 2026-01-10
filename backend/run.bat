@echo off
echo Activating virtual environment...
call venv\Scripts\activate

echo Installing requirements...
pip install -r requirements.txt

echo Starting FastAPI server...
uvicorn app.main:app --reload

pause