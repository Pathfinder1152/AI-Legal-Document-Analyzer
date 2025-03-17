from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import os
import uuid
from datetime import datetime
import re
import logging
import mimetypes

# Import libraries with try-except to handle optional dependencies
try:
    import fitz  # PyMuPDF for PDFs
except ImportError:
    fitz = None

try:
    import docx  # python-docx for Word documents
except ImportError:
    docx = None

logger = logging.getLogger(__name__)

class DocumentPreprocessor:
    """Utility class for handling document preprocessing operations"""
    
    @staticmethod
    def extract_text_from_pdf(file_path):
        """Extract text from PDF using PyMuPDF"""
        if fitz is None:
            logger.error("PyMuPDF not installed. Install with 'pip install pymupdf'")
            return "Error: PDF extraction library not available."
            
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            return None
    
    @staticmethod
    def extract_text_from_docx(file_path):
        """Extract text from DOCX using python-docx"""
        if docx is None:
            logger.error("python-docx not installed. Install with 'pip install python-docx'")
            return "Error: DOCX extraction library not available."
            
        try:
            doc = docx.Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            logger.error(f"Error extracting text from DOCX: {e}")
            return None
    
    @staticmethod
    def extract_text_from_txt(file_path):
        """Extract text from plain text files"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error extracting text from text file: {e}")
            return None
    
    @staticmethod
    def extract_text_from_other(file_path):
        """
        Basic text extraction for other file types
        Note: textract is not used due to dependency issues
        """
        try:
            # Check if it might be a text file despite the extension
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                sample = f.read(1024)  # Read a sample
                if all(c.isspace() or c.isprintable() for c in sample):
                    # If it looks like text, read the whole file
                    f.seek(0)
                    return f.read()
            
            return "This file type is not directly supported for text extraction. Consider converting to PDF or DOCX."
        except Exception as e:
            logger.error(f"Error extracting text from document: {e}")
            return None
            
    @staticmethod
    def clean_text(text):
        """Basic text cleaning operations"""
        if text is None:
            return ""
            
        # Replace multiple newlines with a single one
        text = re.sub(r'\n+', '\n', text)
        
        # Replace multiple spaces with a single one
        text = re.sub(r'\s+', ' ', text)
        
        # Remove any non-printable characters
        text = re.sub(r'[^\x20-\x7E\n]', '', text)
        
        return text.strip()
    
    @staticmethod
    def detect_sections(text):
        """Detect document sections based on headings, etc."""
        # Simple section detection by looking for capitalized lines followed by newlines
        section_pattern = r'([A-Z][A-Z\s]+)(?:\r?\n)'
        sections = re.findall(section_pattern, text)
        
        # Try to detect numbered sections like "1. INTRODUCTION"
        numbered_pattern = r'(\d+\.\s+[A-Z][A-Z\s]+)(?:\r?\n)'
        numbered_sections = re.findall(numbered_pattern, text)
        
        # Combine and return list of potential section headings
        all_sections = [s.strip() for s in sections if len(s.strip()) > 3]
        all_sections += [s.strip() for s in numbered_sections if len(s.strip()) > 3]
        
        return all_sections


class DocumentUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        """Handle document upload and preprocessing"""
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.FILES['file']
        file_extension = os.path.splitext(uploaded_file.name)[1].lower()
        
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        upload_dir = os.path.join('media', 'documents')
        
        # Ensure directory exists
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save uploaded file
        with open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        
        # Extract text based on file type
        text = None
        if file_extension == '.pdf':
            text = DocumentPreprocessor.extract_text_from_pdf(file_path)
        elif file_extension in ['.docx', '.doc']:
            text = DocumentPreprocessor.extract_text_from_docx(file_path)
        elif file_extension in ['.txt', '.md', '.html', '.htm']:
            text = DocumentPreprocessor.extract_text_from_txt(file_path)
        else:
            text = DocumentPreprocessor.extract_text_from_other(file_path)
        
        # Clean extracted text
        cleaned_text = DocumentPreprocessor.clean_text(text)
        
        # Detect document sections
        sections = DocumentPreprocessor.detect_sections(cleaned_text)
        
        # Get file MIME type
        mime_type, _ = mimetypes.guess_type(file_path)
        
        # Determine document type based on content and extension
        doc_type = self._determine_document_type(file_extension, cleaned_text, sections)
        
        # Store in database (to be implemented)
        document_id = str(uuid.uuid4())
        
        # Return response with document info
        return Response({
            'document_id': document_id,
            'filename': uploaded_file.name,
            'size': uploaded_file.size,
            'mime_type': mime_type or 'application/octet-stream',
            'upload_date': datetime.now().isoformat(),
            'text_length': len(cleaned_text) if cleaned_text else 0,
            'detected_sections': sections[:10] if sections else [],  # First 10 sections for preview
            'document_type': doc_type
        }, status=status.HTTP_201_CREATED)
    
    def _determine_document_type(self, extension, text, sections):
        """
        Determine document type based on content analysis
        This is a simple implementation and could be enhanced with ML classification
        """
        if not text:
            return "Unknown"
            
        text_lower = text.lower()
        
        # Check for common document keywords
        if "contract" in text_lower or "agreement" in text_lower:
            return "Contract"
        elif "v." in text or "plaintiff" in text_lower or "defendant" in text_lower:
            return "Case Law"
        elif "brief" in text_lower:
            return "Legal Brief"
        elif "motion" in text_lower:
            return "Motion"
        elif "statute" in text_lower or "code" in text_lower:
            return "Statute"
            
        # Fallback to extension-based guessing
        ext_to_type = {
            '.pdf': 'PDF Document',
            '.docx': 'Word Document',
            '.doc': 'Word Document',
            '.txt': 'Text Document',
            '.rtf': 'Rich Text Document',
        }
        
        return ext_to_type.get(extension, "Document")


class DocumentListView(APIView):
    """View to list processed documents"""
    
    def get(self, request):
        # This would typically fetch from database
        # For now, return mock data
        return JsonResponse({
            'documents': [
                {
                    'id': '1',
                    'filename': 'example_contract.pdf',
                    'upload_date': '2023-06-01T10:30:00',
                    'size': 1245678,
                    'type': 'Contract'
                },
                {
                    'id': '2',
                    'filename': 'legal_brief.docx',
                    'upload_date': '2023-06-02T14:20:00',
                    'size': 567890,
                    'type': 'Brief'
                }
            ]
        })
