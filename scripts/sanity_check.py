import random
from pathlib import Path

# --- Paths ---
text_dir = Path("data/processed/cases_txt")  # Make sure this points correctly

# --- Settings ---
num_files_to_check = 5  # How many random .txt files you want to peek into
num_paragraphs_per_file = 5  # How many paragraphs per file to show

# --- Main ---
txt_files = list(text_dir.glob("*.txt"))

if not txt_files:
    print("❌ No text files found. Did you run the extractor?")
    exit()

sampled_files = random.sample(txt_files, min(num_files_to_check, len(txt_files)))

for file_path in sampled_files:
    print(f"\n📄 File: {file_path.name}")
    print("-" * 50)

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()]
    sampled_paragraphs = paragraphs[:num_paragraphs_per_file]

    for idx, para in enumerate(sampled_paragraphs, 1):
        print(f"\nParagraph {idx}:\n{para}\n")

    print("=" * 50)

print("\n✅ Sanity check complete.")
