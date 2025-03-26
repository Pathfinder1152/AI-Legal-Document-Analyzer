import os
import PyPDF2
import docx
import pypandoc
from django.core.files.storage import default_storage

UPLOAD_DIR = "uploads/"  # Directory to store uploaded files

def save_uploaded_file(uploaded_file):
    """Saves the uploaded file and returns its file path."""
    file_path = default_storage.save(os.path.join(UPLOAD_DIR, uploaded_file.name), uploaded_file)
    return file_path

def extract_text_from_file(file_path):
    """Extracts text from a document (PDF, DOCX, TXT, RTF)."""
    file_ext = os.path.splitext(file_path)[1].lower()
    
    if file_ext == ".pdf":
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
    
    elif file_ext == ".docx":
        doc = docx.Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    
    elif file_ext == ".rtf":
        return pypandoc.convert_file(file_path, "plain")  # Converts RTF to plain text
    
    elif file_ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    
    return None
