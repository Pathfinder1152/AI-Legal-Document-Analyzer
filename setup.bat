@echo off
echo ===== AI Legal Document Analyzer Setup =====
echo This script will help you set up both the backend and frontend.
echo.

REM Check prerequisites
echo Checking prerequisites...
python --version
node --version
npm --version
echo.

REM Setup backend
echo Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist venv (
  echo Creating Python virtual environment...
  python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install backend dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
  echo Creating .env file from example...
  copy .env.example .env
  echo Please edit .env file and add your OpenAI API key
)

REM Apply database migrations
echo Applying database migrations...
cd backend_core
python manage.py migrate
cd ..

cd ..

REM Setup frontend
echo Setting up frontend...
cd ai-legal-document-analysis-frontend

REM Install frontend dependencies
echo Installing npm dependencies...
npm install

REM Create .env.local file if it doesn't exist
if not exist .env.local (
  echo Creating .env.local file from example...
  copy .env.local.example .env.local
)

cd ..

echo.
echo ===== Setup Complete =====
echo.
echo To run the backend server:
echo   cd backend
echo   venv\Scripts\activate
echo   cd backend_core
echo   python manage.py runserver
echo.
echo To run the frontend server:
echo   cd ai-legal-document-analysis-frontend
echo   npm run dev
echo.
echo Access the application at: http://localhost:3000
echo.
pause 