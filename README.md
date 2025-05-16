# AI Legal Document Analyzer

An advanced web application that helps users upload legal documents, analyze them with AI, and interact with them through natural language chat.

## Features

- Upload and analyze legal documents (PDF, DOC, DOCX, TXT)
- Automatically extract and highlight key elements:
  - Legal terms
  - Dates
  - Parties involved
  - Obligations
  - Conditions
- AI-powered clause classification using RoBERTa model (LEDGAR dataset)
  - Identifies 20 different clause types in legal documents
  - Shows clause types in tooltips and annotation details
  - Displays confidence scores for classification results
- Chat with AI about document content
- Select specific clauses to ask targeted questions
- Interactive document viewer with annotations

## Project Structure

The project consists of two main components:

- **Backend** (Django/Python): Handles document processing, analysis, and chat functionality
- **Frontend** (Next.js/React): Provides the user interface and document viewer

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- PostgreSQL

### Backend Setup

1. Create a PostgreSQL database named `legal_doc_analyzer`

2. Navigate to the backend directory:
   ```
   cd backend
   ```

3. Create a virtual environment:
   ```
   python -m venv venv
   ```

4. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

6. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to the `.env` file

7. Set up the clause classification model:
   - Extract the RoBERTa model files to `backend/backend_core/models/clause_classifier/`
   - On Windows, use the provided script: `extract_model.bat path\to\model_zip_file.zip`
   - Alternatively, manually extract the model files to the directory
   - Test the model with: `python test_classifier.py`

8. Apply migrations:
   ```
   cd backend_core
   python manage.py migrate
   ```

9. Run the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ai-legal-document-analysis-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Ensure the API URL points to your Django backend

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Upload a legal document using the sidebar
2. Wait for AI analysis to complete
3. View the document with annotations
4. Select annotations to ask specific questions
5. Chat with the AI about the document content

## Technologies Used

- **Frontend**:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS

- **Backend**:
  - Django
  - Django REST Framework
  - PostgreSQL
  - OpenAI API

## License

[MIT License](LICENSE)
