import os
import json
from django.core.management.base import BaseCommand
from api.models import CaseMetadata
from nlp.legal_references import get_nlp_model, extract_references

# Set up output directory for extracted sentences
BASE_DIR = "D:/ai-legal-document-analysis/"
OUTPUT_DIR = ("data/processed/new_sentence_annotations")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Use the shared NLP model
nlp = get_nlp_model()

class Command(BaseCommand):
    help = "Extract sentences and legal references from cases"

    def handle(self, *args, **options):
        cases = CaseMetadata.objects.exclude(text_path__isnull=True)

        for case in cases:
            full_path = os.path.join(BASE_DIR, case.text_path.replace("\\", "/"))

            if not os.path.exists(full_path):
                self.stdout.write(self.style.WARNING(f"[!] Missing file: {full_path}"))
                continue

            with open(full_path, "r", encoding="utf-8") as f:
                text = f.read()

            doc = nlp(text)
            results = []

            for sent in doc.sents:
                sent_text = sent.text.strip()
                if not sent_text:
                    continue

                refs = extract_references(sent_text)

                if refs:
                    results.append({
                        "sentence": sent_text,
                        "legal_references": refs
                    })

            # Save results JSON per case
            output_path = os.path.join(OUTPUT_DIR, f"{case.file_name.replace('.pdf','').replace('.rtf','')}_sentences.json")
            with open(output_path, "w", encoding="utf-8") as outf:
                json.dump(results, outf, indent=2)

            self.stdout.write(self.style.SUCCESS(f"[✓] Extracted: {case.file_name}"))
