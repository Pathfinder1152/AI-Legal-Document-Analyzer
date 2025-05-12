# backend/backend_core/nlp/annotation_utils.py

import json
import os

ANNOTATION_DIR = "data/annotated"

def save_annotation(output, filename=None):
    os.makedirs(ANNOTATION_DIR, exist_ok=True)
    if not filename:
        filename = output.get("file_name", "output") + ".json"
    file_path = os.path.join(ANNOTATION_DIR, filename.replace(".pdf", ".json").replace(".rtf", ".json"))
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)
    print(f"Saved: {file_path}")
