import os
import json
from pathlib import Path

# Set your directories
ANNOTATION_DIR = Path("data/processed/annotations")
TEXT_DIR = Path("data/processed/cases_txt")

def update_json_with_text_paths():
    for json_file in ANNOTATION_DIR.glob("*.json"):
        base_name = json_file.stem
        txt_path = TEXT_DIR / f"{base_name}.txt"

        if not txt_path.exists():
            print(f"[!] Skipping {base_name} — no matching text file found.")
            continue

        with open(json_file, "r", encoding="utf-8") as jf:
            data = json.load(jf)

        # Update or insert text_file field
        data["text_file"] = str(txt_path.resolve())

        with open(json_file, "w", encoding="utf-8") as jf:
            json.dump(data, jf, indent=2)

        print(f"[✓] Updated: {json_file.name} with text_file path.")

if __name__ == "__main__":
    update_json_with_text_paths()