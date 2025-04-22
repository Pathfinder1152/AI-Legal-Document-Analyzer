import os
import json
from pathlib import Path
from PyPDF2 import PdfReader
from docx import Document
import chardet
from striprtf.striprtf import rtf_to_text

# --- Helper function to extract text from supported file types ---
def extract_text_from_file(file_path: Path) -> str:
    ext = file_path.suffix.lower()

    if ext == ".pdf":
        with open(file_path, "rb") as f:
            reader = PdfReader(f)
            text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text.replace("\n", " ")
            return text

    elif ext == ".docx":
        doc = Document(file_path)
        return " ".join([p.text for p in doc.paragraphs])

    elif ext == ".rtf":
    # Read the raw bytes
        with open(file_path, "rb") as f:
            raw_data = f.read()

        # Detect encoding
        detected = chardet.detect(raw_data)
        encoding = detected["encoding"] or "utf-8"  # fallback to utf-8 just in case

        try:
            decoded_text = raw_data.decode(encoding)
            return rtf_to_text(decoded_text).replace("\n", " ")
        except UnicodeDecodeError:
            print(f"❌ Still failed to decode {file_path.name} with detected encoding: {encoding}")
            return ""

    else:
        return ""

# --- Paths ---
documents_dir = Path("data/raw/Documents")
json_output_dir = Path("backend/data/annotated")
text_output_dir = Path("data/processed/cases_txt")
text_output_dir.mkdir(parents=True, exist_ok=True)

# --- Main Loop ---
for file in documents_dir.iterdir():
    if file.suffix.lower() in [".pdf", ".docx", ".rtf"]:
        case_id = file.stem

        # Extract and clean text
        extracted_text = extract_text_from_file(file)
        if not extracted_text.strip():
            print(f"⚠️ No text extracted from: {file.name}")
            continue

        # Save cleaned text
        txt_file_path = text_output_dir / f"{case_id}.txt"
        with open(txt_file_path, "w", encoding="utf-8") as out_f:
            out_f.write(extracted_text)

        # Update JSON
        json_file_path = json_output_dir / f"{case_id}.json"
        if json_file_path.exists():
            with open(json_file_path, "r", encoding="utf-8") as jf:
                data = json.load(jf)

            data["text_path"] = str(txt_file_path)
            data.pop("full_text", None)

            with open(json_file_path, "w", encoding="utf-8") as jf:
                json.dump(data, jf, indent=2)

print("✅ All supported files processed and JSONs updated.")