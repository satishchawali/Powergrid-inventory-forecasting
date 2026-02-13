@echo off

echo ======================================
echo   Material Demand Forecasting Setup
echo ======================================

REM Create virtual environment if not exists
IF NOT EXIST venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing requirements...
pip install --upgrade pip
pip install -r requirements.txt

echo Running ML pipeline...
python run_pipeline.py

echo ======================================
echo   Pipeline Execution Completed
echo ======================================

pause
