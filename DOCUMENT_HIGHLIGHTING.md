# Legal Document Highlighting Implementation

This documentation outlines how legal references are extracted and highlighted in uploaded documents within the AI Legal Document Analyzer application.

## Overview

The highlighting process follows these steps:
1. Document is uploaded through the API
2. Text is extracted and cleaned
3. Legal references are detected using NLP and pattern matching
4. References are stored as annotations with start/end positions
5. Frontend renders the document with highlighted sections

## Backend Components

### 1. Legal Reference Extraction (`nlp/legal_references.py`)

This module contains the core functionality for detecting legal references:
- Uses spaCy for NLP-based entity detection
- Applies regex patterns for legal citations
- Detects act names, case references, and legal citations
- Finds the position of each reference in the document

```python
# Example of extracted reference
{
    "text": "Data Protection Act 2018",
    "category": "legal_term",
    "startIndex": 120,
    "endIndex": 142,
    "description": "Legal reference: Regex - Known Act"
}
```

### 2. Document Processing (`nlp/document_processor.py`)

Handles the processing pipeline for uploaded documents:
- Extracts text from various formats (PDF, DOCX, RTF, TXT)
- Applies text cleaning for better quality
- Prepares document text for annotation

### 3. Upload & Processing Flow

1. Document is uploaded via the API endpoint
2. Text is extracted using the document processor
3. Text is cleaned and normalized
4. Legal references are identified and positions recorded
5. Annotations are stored in the database
6. Document status is updated to "analyzed"

## Frontend Components

### 1. Document Viewer (`components/document/DocumentViewer.tsx`)

Renders the document with highlighted sections:
- Processes the document content and annotations
- Creates text segments with proper highlighting
- Handles user interaction with highlights
- Uses different colors for different annotation types

### 2. Document Page Example (`app/document/page.tsx`)

Example implementation of a document viewing page:
- Fetches document data from API
- Renders the document with highlighting
- Shows annotation details when clicked

## Usage in Your Project

To add highlighting to your own components:

1. Import the DocumentViewer:
```tsx
import { DocumentViewer } from '@/components/document/DocumentViewer';
```

2. Use it in your component, passing a document object:
```tsx
<DocumentViewer 
  document={document} 
  onAnnotationClick={(annotation) => {
    // Your annotation click handler
    console.log("Clicked annotation:", annotation);
  }} 
/>
```

3. The document object must follow this structure:
```typescript
interface Document {
  id: string;
  name: string;
  status: 'uploading' | 'processing' | 'analyzed' | 'error';
  content?: string;
  annotations?: Array<{
    id: string;
    text: string;
    category: string;
    startIndex: number;
    endIndex: number;
    description?: string;
  }>;
}
```

## Testing Your Implementation

To test the highlighting functionality:

1. Start the backend server:
```bash
cd backend/backend_core
python manage.py migrate  # Apply any pending migrations
python manage.py runserver
```

2. Start the frontend development server:
```bash
cd ai-legal-document-analysis-frontend
npm run dev
```

3. Upload a document through the application
4. Navigate to the document view page to see the highlights
