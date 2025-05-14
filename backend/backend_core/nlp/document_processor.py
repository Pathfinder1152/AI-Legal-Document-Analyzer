import os
import chardet
from pathlib import Path
import pdfplumber
from docx import Document
from striprtf.striprtf import rtf_to_text
from django.conf import settings
import uuid

# Import cleaning functions
from preprocessing.cleaning import clean_paragraph_text

def detect_encoding(raw_bytes):
    """Detect the encoding of raw bytes."""
    detected = chardet.detect(raw_bytes)
    return detected["encoding"] or "utf-8"  # fallback to utf-8

def extract_text_from_file(file_path):
    """
    Extract text from various document formats (PDF, DOCX, RTF, TXT)
    
    Args:
        file_path: Path to the file
        
    Returns:
        Extracted text as a string
    """
    file_path = Path(file_path)
    ext = file_path.suffix.lower()

    if ext == ".pdf":
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n\n"
            return text
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return None

    elif ext == ".docx":
        try:
            doc = Document(file_path)
            return "\n\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        except Exception as e:
            print(f"Error extracting text from DOCX: {e}")
            return None

    elif ext == ".rtf":
        try:
            with open(file_path, "rb") as f:
                raw_data = f.read()
            
            encoding = detect_encoding(raw_data)
            
            try:
                decoded_text = raw_data.decode(encoding)
                rtf_text = rtf_to_text(decoded_text)
                paragraphs = [p.strip() for p in rtf_text.split("\n") if p.strip()]
                return "\n\n".join(paragraphs)
            except UnicodeDecodeError:
                print(f"Failed to decode {file_path.name} with detected encoding: {encoding}")
                return None
        except Exception as e:
            print(f"Error extracting text from RTF: {e}")
            return None

    elif ext == ".txt":
        try:
            with open(file_path, "rb") as f:
                raw_data = f.read()
            
            encoding = detect_encoding(raw_data)
            
            try:
                return raw_data.decode(encoding)
            except UnicodeDecodeError:
                print(f"Failed to decode {file_path.name} with detected encoding: {encoding}")
                return None
        except Exception as e:
            print(f"Error extracting text from TXT: {e}")
            return None

    else:
        print(f"Unsupported file format: {ext}")
        return None

def save_uploaded_file(uploaded_file):
    """
    Save an uploaded file to the media directory
    
    Args:
        uploaded_file: The uploaded file object from request.FILES
        
    Returns:
        Path to the saved file
    """
    # Create a unique filename to prevent collisions
    original_name = uploaded_file.name
    ext = os.path.splitext(original_name)[1].lower()
    unique_filename = f"{uuid.uuid4()}{ext}"
    
    # Ensure media folder exists
    media_root = getattr(settings, 'MEDIA_ROOT', os.path.join(settings.BASE_DIR, 'media'))
    uploads_dir = os.path.join(media_root, 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Save the file
    file_path = os.path.join(uploads_dir, unique_filename)
    with open(file_path, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
    
    return file_path

def process_document_text(file_path):
    """
    Full pipeline to process a document:
    1. Extract text
    2. Clean text
    
    Args:
        file_path: Path to the file
        
    Returns:
        Tuple of (raw_text, cleaned_text)
    """
    # Extract raw text
    raw_text = extract_text_from_file(file_path)
    if not raw_text:
        return None, None
    
    # Clean the text
    paragraphs = raw_text.split('\n\n')
    cleaned_paragraphs = [clean_paragraph_text(p) for p in paragraphs]
    cleaned_text = '\n\n'.join(cleaned_paragraphs)
    
    return raw_text, cleaned_text
