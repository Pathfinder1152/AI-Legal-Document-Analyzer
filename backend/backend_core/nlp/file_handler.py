import os
import PyPDF2
import docx
import pypandoc
from django.conf import settings

UPLOAD_DIR = os.path.join(settings.MEDIA_ROOT, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_uploaded_file(uploaded_file):
    """Saves the uploaded file and returns its file path."""
    file_name = uploaded_file.name
    file_path = os.path.join(UPLOAD_DIR, file_name)
    with open(file_path, 'wb') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
    return file_path

def extract_text_from_file(file_path):
    """Extracts text from a document (PDF, DOCX, TXT, RTF)."""
    file_ext = os.path.splitext(file_path)[1].lower()

    try:
        if file_ext == ".pdf":
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
                if not text.strip():
                    raise ValueError("No text could be extracted from the PDF.")
                return text

        elif file_ext == ".docx":
            doc = docx.Document(file_path)
            text = "\n".join([para.text for para in doc.paragraphs])
            if not text.strip():
                raise ValueError("No text could be extracted from the DOCX file.")
            return text

        elif file_ext == ".rtf":
            text = pypandoc.convert_file(file_path, "plain")
            if not text.strip():
                raise ValueError("No text could be extracted from the RTF file.")
            return text

        elif file_ext == ".txt":
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
                if not text.strip():
                    raise ValueError("No text could be extracted from the TXT file.")
                return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None

    return None