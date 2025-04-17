import os
import json
from datetime import datetime
from .metadata_extractor import extract_case_data

INPUT_DIR = r"D:\\ai-legal-document-analysis\\data\\raw\\Documents"
OUTPUT_DIR = "data/annotated"

os.makedirs(OUTPUT_DIR, exist_ok=True)

def annotate_all_cases():
    """Annotates all documents in the input folder and saves them as JSON."""
    for filename in os.listdir(INPUT_DIR):
        file_path = os.path.join(INPUT_DIR, filename)

        # Only process actual files
        if not os.path.isfile(file_path):
            continue

        try:
            print(f"[+] Annotating: {filename}")
            data = extract_case_data(file_path)

            # Output path (same name with .json extension)
            output_filename = os.path.splitext(filename)[0] + ".json"
            output_path = os.path.join(OUTPUT_DIR, output_filename)

            # Save the annotation
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

            print(f"[✓] Saved annotation → {output_filename}")
        except Exception as e:
            print(f"[!] Error processing {filename}: {e}")

if __name__ == "__main__":
    annotate_all_cases()
