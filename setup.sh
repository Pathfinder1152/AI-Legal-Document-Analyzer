#!/bin/bash

# AI Legal Document Analyzer Setup Script

echo "===== AI Legal Document Analyzer Setup ====="
echo "This script will help you set up both the backend and frontend."
echo

# Check prerequisites
echo "Checking prerequisites..."
python_version=$(python --version 2>&1 | awk '{print $2}')
node_version=$(node --version 2>&1)
npm_version=$(npm --version 2>&1)

echo "- Python version: $python_version"
echo "- Node.js version: $node_version"
echo "- npm version: $npm_version"
echo

# Setup backend
echo "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  echo "Creating Python virtual environment..."
  python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  source venv/Scripts/activate
else
  source venv/bin/activate
fi

# Install backend dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo "Creating .env file from example..."
  cp .env.example .env
  echo "Please edit .env file and add your OpenAI API key"
fi

# Apply database migrations
echo "Applying database migrations..."
cd backend_core
python manage.py migrate
cd ..

cd ..

# Setup frontend
echo "Setting up frontend..."
cd ai-legal-document-analysis-frontend

# Install frontend dependencies
echo "Installing npm dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
  echo "Creating .env.local file from example..."
  cp .env.local.example .env.local
fi

cd ..

echo
echo "===== Setup Complete ====="
echo
echo "To run the backend server:"
echo "  cd backend"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  echo "  venv\\Scripts\\activate"
else
  echo "  source venv/bin/activate"
fi
echo "  cd backend_core"
echo "  python manage.py runserver"
echo
echo "To run the frontend server:"
echo "  cd ai-legal-document-analysis-frontend"
echo "  npm run dev"
echo
echo "Access the application at: http://localhost:3000" 