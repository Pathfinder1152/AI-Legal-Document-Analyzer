# AI Legal Document Analyzer

A cutting-edge legal technology platform that revolutionizes how legal professionals interact with complex documents. This advanced system combines state-of-the-art natural language processing, machine learning, and vector search technology to transform raw legal texts into structured, accessible knowledge. By harnessing the power of large language models and specialized legal AI, it breaks down barriers to legal comprehension, enabling intuitive exploration and analysis of contracts, agreements, and regulatory documents.

<div align="center">
  <img src="docs/Architecture Diagram.png" alt="AI Legal Document Analyzer Architecture" width="850"/>
</div>
</br>

![Python](https://img.shields.io/badge/python-3.9+-brightgreen)
![Django](https://img.shields.io/badge/django-5.1.6-green)
![Next.js](https://img.shields.io/badge/next.js-15.3.1-black)
![TypeScript](https://img.shields.io/badge/typescript-5.3.3-blue)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow)
![PostgreSQL](https://img.shields.io/badge/postgresql-17-blue)
![OpenAI](https://img.shields.io/badge/openai-gpt--3.5-lightgrey)
![Pinecone](https://img.shields.io/badge/pinecone-vector--db-orange)
![React](https://img.shields.io/badge/react-19.1-61DAFB)
![Tailwind CSS](https://img.shields.io/badge/tailwind-3.3.6-38B2AC)
![PyTorch](https://img.shields.io/badge/pytorch-2.0-EE4C2C)
![Docker](https://img.shields.io/badge/docker-compose-2496ED)

## Features

- **Upload and analyze legal documents** (PDF, DOC, DOCX, TXT, RTF)
- **Semantic Search** within documents for context-aware information retrieval
- **Text Summarization and Simplification** for complex legal content
- **Automatically extract and highlight key elements**:
  - 📘 **Legal terms** - Identifies citations, acts, regulations, and legal jargon
  - 📅 **Dates** - Highlights temporal information, deadlines, and filing dates
  - 👨‍💼 **Parties involved** - Extracts names of people, organizations, and entities
  - ✓ **Obligations** - Identifies duty clauses and requirements
  - ⚖️ **Conditions** - Flags conditional statements and prerequisites
- **AI-powered clause classification** using fine-tuned RoBERTa model (LEDGAR dataset)
  - Automatically identifies 20+ different clause types in legal documents
  - Shows clause types in tooltips and annotation details
  - Displays confidence scores for classification results
- **Interactive document chat** powered by OpenAI's language models
- **Contextual questioning** with the ability to select specific clauses
- **Interactive document viewer** with intelligent annotations
- **Secure user accounts** with authentication and authorization
- **Document history tracking** and chat history persistence


## Project Structure

The project consists of two main components:

- **Backend** (Django/Python): Handles document processing, analysis, and chat functionality
  - **Document Processing Pipeline**: Extracts text, identifies entities, and classifies clauses
  - **Vector Search System**: Creates and queries document embeddings for semantic search
  - **REST API**: Exposes endpoints for document upload, analysis, chat, and search
  - **Authentication**: Secure user management with session and JWT authentication
  - **Database Models**: PostgreSQL schema for storing documents, annotations, and chat history

- **Frontend** (Next.js/React): Provides the user interface and document viewer
  - **Document Viewer**: Interactive component with highlighting and annotation support
  - **Chat Interface**: UI for querying documents with contextual awareness
  - **Authentication Flow**: Registration, login, and session management
  - **Dashboard**: Document management and status tracking
  
## Core Technical Components

### Document Processing

The document processing pipeline handles various file formats and performs the following steps:

1. **Text Extraction**: Specialized extractors for each file format
   - PDF: PyPDF2 and pdfplumber for text and layout extraction
   - DOCX: python-docx for structured content extraction
   - RTF: striprtf for formatting-aware text extraction
   - TXT: Direct text reading with encoding detection

2. **NLP Analysis**: Natural language processing to identify key elements
   - Named Entity Recognition for parties and organizations
   - RegEx pattern matching for legal citations and references
   - Date and temporal information extraction
   - Obligation and condition identification

3. **Clause Classification**: Legal clause type identification
   - RoBERTa model fine-tuned on LEDGAR dataset
   - Identifies governing law, termination, confidentiality, and other clause types
   - Provides confidence scores for each classification

### Vector Search Implementation

The semantic search system provides meaning-based document retrieval:

1. **Embedding Generation**: Document text is converted to vector representations
   - OpenAI's text-embedding-ada-002 model (1536 dimensions)
   - Chunking strategy for optimal context preservation
   - Efficient JSON storage format

2. **Search Functionality**: Enables semantic similarity queries
   - Cosine similarity for vector comparison
   - Context window assembly from chunks
   - Relevance scoring and result ranking

### AI-Powered Chat System

The conversational interface enables natural language interaction with legal documents:

1. **OpenAI Integration**:
   - GPT-3.5/GPT-4 model integration via OpenAI API
   - Context-aware prompting with document content
   - Temperature and token optimization for legal responses
   - Streaming response capability for real-time feedback

2. **Document Context Management**:
   - Relevant document sections retrieved via vector search
   - Selected text incorporation for targeted questions
   - Context window construction with optimal token usage
   - Citation tracking for response verification

3. **Conversation History**:
   - Persistent chat storage with document association
   - Message threading for coherent conversations
   - User and AI role differentiation
   - Context carryover between sessions

4. **Document Summmarization**:
   - Document-level overview summaries
   - Section-specific focused summaries
   - Preservation of critical legal terminology
   - Clause-type targeted summaries (e.g., "Summarize all confidentiality clauses")

5. **Text Simplification**:
   - Legal jargon replacement with common terminology (Complexity Reduction)
   - Sentence structure simplification
   - Meaning-preserving transformations
   - Audience-targeted outputs (client, non-legal professional, general public)

### Authentication System

The application implements comprehensive security measures:

1. **User Management**:
   - Registration with email verification
   - Secure password hashing and storage
   - Session-based authentication with CSRF protection

2. **API Security**:
   - JWT token authentication for API endpoints
   - Permission-based access control
   - Document ownership validation

### Database Schema

The system uses a PostgreSQL database with the following key models:

1. **User Model**: Extended from Django's built-in User model
   - Standard fields: username, email, password
   - Profile information storage

2. **Document Model**: Stores uploaded documents and metadata
   - UUID primary key for secure identification
   - File storage with path tracking
   - Processing status monitoring
   - User relationship with cascade deletion

3. **Annotation Model**: Records document highlights and classifications
   - Text position tracking (start/end indices)
   - Classification results with confidence scores
   - Metadata for additional information

4. **ChatMessage Model**: Stores conversations with documents
   - User and AI message history
   - Document context association
   - Source tracking for AI responses

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- PostgreSQL

### Backend Setup

1. Create a PostgreSQL database named `legal_doc_analyzer`

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:
   - Windows: 
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux: 
     ```bash
     source venv/bin/activate
     ```

5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

6. Configure environment variables:
   - Copy `.env.example` to `.env` (Create .env file in the same directory / location)
   - Add your OpenAI API key to the `.env` file:
     ```     
     OPENAI_API_KEY=your_api_key_here
     PINECONE_API_KEY=your-pinecone-api-key-here
     ```
**Email (methsaradisanayaka@gmail.com) or Contact via GitHub, LinkedIn for the required api keys.**

7. Set up the clause classification model:
   - Download the model files from the Google Drive : https://drive.google.com/drive/folders/1P1pYmNRhNTr4ATwRoIKkT8tS8ZZtm5T1?usp=sharing
   - Extract / Save the RoBERTa model files to `backend/backend_core/models/clause_classifier/`
   - Test the model with the file in `tests/test_classifier.py`: 
     ```bash
     python test_classifier.py
     ```

8. Apply migrations:
   ```bash
   cd backend_core
   python manage.py migrate
   ```

9. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ai-legal-document-analysis-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Ensure the API URL points to your Django backend:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000/api
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### 1. Registration and Authentication

The system implements a secure authentication flow:

1. **User Registration**:
   - Create an account with email and password
   - Verification ensures account security
   - Registration API: `POST /api/auth/register/`

2. **Login Flow**:
   - Authenticate with credentials via `POST /api/auth/login/`
   - Session-based authentication with secure cookies
   - CSRF protection for all form submissions

3. **Session Management**:
   - Protected routes require authentication
   - JWT tokens used for API authorization
   - Session validation through `GET /api/auth/session/`

### 2. Document Management

1. **Upload Process**:
   - Upload documents via the sidebar or dashboard
   - Supported formats: PDF, DOCX, TXT, RTF
   - Size limit: 20MB per document
   - Upload API: `POST /api/upload/`

2. **Processing States**:
   - `uploaded`: Initial state after successful upload
   - `processing`: Document is being analyzed
   - `analyzed`: Processing complete, ready for interaction
   - `error`: Processing failed (with error details)
   - Status checking API: `GET /api/documents/{id}/status/`

3. **Document Listing**:
   - View all your documents in the dashboard
   - Sort by date, name, or status
   - Filter by document type or processing status
   - Document listing API: `GET /api/documents/user/`

### 3. Document Interaction

1. **Document Viewing**:
   - Interactive document viewer with highlighting
   - Color-coded annotations by category
   - Tooltip information on hover
   - Click annotations for detailed information

2. **Contextual Chat**:
   - Ask questions about the document content
   - AI responses with source citations
   - Select specific text for targeted questions
   - Message history preserved across sessions
   - Chat API: `POST /api/chat/`

3. **Semantic Search**:
   - Search within documents using natural language
   - Results ranked by relevance
   - Highlighting of search terms in results
   - Search API: `POST /api/search/{id}/`

## Technologies Used

- **Frontend**:
  - Next.js - React framework for server-rendered applications
  - React - UI component library
  - TypeScript - Type-safe JavaScript
  - Tailwind CSS - Utility-first CSS framework
  - shadcn/ui - Component library for modern UIs
  - React Query - Data fetching and state management

- **Backend**:
  - Django - Python web framework
  - Django REST Framework - API development toolkit
  - PostgreSQL - Relational database
  - OpenAI API - LLM integration for chat and embeddings
  - PyPDF2/pdfplumber - PDF processing
  - python-docx - DOCX processing
  - spaCy - NLP toolkit for entity recognition
  - nltk - NLP toolkit for tokenization and word vocabulary
  - PyTorch - ML framework for the clause classifier
  - JWT - Token-based authentication

## Key APIs and Data Flow

### 1. Document Processing Flow

```
┌────────────┐   ┌────────────┐   ┌────────────────┐   ┌───────────────┐
│ Document   │   │ Text       │   │ NLP            │   │ Vector        │
│ Upload     ├──►│ Extraction ├──►│ Processing     ├──►│ Embedding     │
└────────────┘   └────────────┘   └────────────────┘   └───────┬───────┘
                                                              │
┌────────────┐   ┌────────────┐   ┌────────────────┐   ┌───────▼───────┐
│ Chat       │◄──┤ Knowledge  │◄──┤ Clause         │◄──┤ Database      │
│ Interface  │   │ Graph      │   │ Classification │   │ Storage       │
└────────────┘   └────────────┘   └────────────────┘   └───────────────┘
```

### 2. Authentication API Endpoints

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|--------------|
| `/api/auth/register/` | POST | Register new user | `{username, email, password}` |
| `/api/auth/login/` | POST | User login | `{username, password}` |
| `/api/auth/logout/` | POST | User logout | None |
| `/api/auth/session/` | GET | Check session | None |

### 3. Document API Endpoints

| Endpoint | Method | Description | Request Body/Params |
|----------|--------|-------------|--------------|
| `/api/upload/` | POST | Upload document | FormData with file |
| `/api/documents/user/` | GET | Get user documents | None |
| `/api/documents/<id>/` | GET | Get document details | `document_id` in URL |
| `/api/documents/<id>/status/` | GET | Check document status | `document_id` in URL |
| `/api/documents/<id>/chat-history/` | GET | Get chat history | `document_id` in URL |
| `/api/chat/` | POST | Send chat message | `{message, documentId, selectedText}` |

### 4. Search API Endpoints

| Endpoint | Method | Description | Request Body/Params |
|----------|--------|-------------|--------------|
| `/api/search/embed/<id>/` | POST | Embed document | `document_id` in URL |
| `/api/search/search/<id>/` | POST | Search document | `{query}` + `document_id` in URL |
| `/api/search/status/<id>/` | GET | Check embedding status | `document_id` in URL |

## Document Highlighting System

The document highlighting system intelligently identifies and visually marks important elements in legal texts:

### Detection Methods

1. **Pattern Matching**: Uses regular expressions to identify:
   - Legal citations (e.g., "Smith v. Jones", "Section 123")
   - Date patterns (e.g., "January 1, 2023", "within 30 days")
   - Reference patterns (e.g., "pursuant to Article 5")

2. **Named Entity Recognition**: Uses spaCy NLP to identify:
   - Person names (parties to agreements)
   - Organization names (companies, institutions)
   - Location names (jurisdictions, places)

3. **Clause Classification**: Uses the RoBERTa model to identify:
   - Specific clause types (e.g., governing law, termination)
   - Confidence scores for each classification

### Annotation Types

Each annotation type has a distinct visual style in the document viewer:

| Type | Visual Style | Description | Example |
|------|--------------|-------------|---------|
| `legal_term` | Blue underline | Legal references | "Data Protection Act 2018" |
| `date` | Green highlight | Temporal information | "January 1, 2023" |
| `party` | Purple highlight | People & organizations | "John Smith", "Acme Corp" |
| `obligation` | Orange highlight | Requirements | "shall provide notice" |
| `condition` | Yellow highlight | Conditions | "if the payment is late" |

## Clause Classification System

The legal clause classifier automatically categorizes sections of legal text:

### Model Architecture
- **Base Model**: RoBERTa transformer architecture
- **Training Data**: LEDGAR dataset with labeled clauses from SEC filings
- **Output**: 100 clause types with confidence scores

### Supported Clause Types
The classifier can identify clauses including:
- `governing_law`: Which laws apply to the agreement
- `termination`: How the agreement can be ended
- `confidentiality`: Protection of sensitive information
- `indemnification`: Compensation for losses
- `limitation_of_liability`: Caps on financial responsibility
- `assignment`: Transfer of rights or obligations
- `warranty`: Guarantees provided by parties
- And 93+ additional clause types
