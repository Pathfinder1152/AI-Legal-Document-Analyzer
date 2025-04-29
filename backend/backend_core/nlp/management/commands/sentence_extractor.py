import os
import re
import json
import spacy
from django.core.management.base import BaseCommand
from api.models import CaseMetadata

# Load spaCy transformer model
nlp = spacy.load("en_core_web_trf")

BASE_DIR = "D:/ai-legal-document-analysis/"
OUTPUT_DIR = ("data/processed/new_sentence_annotations")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Known acts and abbreviations
KNOWN_ACTS = [
    "Children Act", "Data Protection Act", "Human Rights Act", "Criminal Justice Act",
    "Computer Misuse Act", "Telecommunications (Security) Act", "Privacy and Electronic Communications Regulations",
    "GDPR", "General Data Protection Regulation", "DORA", "EU Artificial Intelligence Act", "Companies Act",
    "Freedom of Information Act", "Defamation Act", "Protection from Harassment Act", "Serious Crime Act"
]

# Law short forms (for quick matching)
SHORT_FORMS = [
    r"HRA\s*1998", r"CA\s*1989", r"DPA\s*2018", r"GDPR", r"FOIA\s*2000", r"PECR"
]

# Complex regex patterns - FIXED VERSION
LEGAL_REFERENCE_PATTERNS = [
    r"(?:s\.?|section)\s*\d+[A-Za-z]?\(?[^\)]*\)?(?:\(.*?\))?\s+of\s+the\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*(?:\s+Act\s+\d{4})",
    r"(?:Reg\.?|regulation)\s*\d+[A-Z]?(?:\([^)]+\))?(?:\s+of)?\s+S\.I\.\s*\d{4}/\d+",
    r"(?:Case\s+C|T)-\d+/\d+",  # European case C-123/45
    r"HC Deb\s+\d{1,2}\s+[A-Za-z]+\s+\d{4},\s+vol\s+\d+,\s+col\s+\d+[WA]?",
    r"HL Deb\s+\d{1,2}\s+[A-Za-z]+\s+\d{4},\s+vol\s+\d+,\s+col\s+\d+[WA]?",
    r"(?:Law Commission|Ministry of|Department of),\s+.*\(.*?\d{4}\)",
    r"Consolidated version of the Treaty.*?\d{4}.*?OJ\s+C\d+/\d+",
    r"Council (Directive|Regulation).*?\[\d{4}\] OJ L\d+/\d+",
    r"\[\d{4}\]\s*ECR\s*[I|II]-\d+",
    r"\d+\s+EHRR\s+\d+"
]

# Handling Ibid and cross-referencing (simple)
last_reference = None

def extract_references(sentence: str) -> list:
    global last_reference
    references = []
    doc = nlp(sentence)

    # 1. spaCy entity matching
    for ent in doc.ents:
        if ent.label_ == "LAW":
            references.append({"text": ent.text.strip(), "match_type": "spaCy - LAW Entity"})
            last_reference = ent.text.strip()

    # 2. Known Act names manually
    for act in KNOWN_ACTS:
        if act.lower() in sentence.lower():
            references.append({"text": act, "match_type": "Regex - Known Act"})
            last_reference = act

    # 3. Short forms (s 1(1), HRA 1998 etc)
    for sf_pattern in SHORT_FORMS:
        if re.search(sf_pattern, sentence):
            match = re.search(sf_pattern, sentence)
            if match:
                references.append({"text": match.group(0), "match_type": "Regex - Short Form"})
                last_reference = match.group(0)

    # 4. Big regex patterns
    for pattern in LEGAL_REFERENCE_PATTERNS:
        matches = re.findall(pattern, sentence)
        for m in matches:
            if isinstance(m, tuple):
                m = m[0]  # Sometimes tuple output
            references.append({"text": m.strip(), "match_type": "Regex - Complex Pattern"})
            last_reference = m.strip()

    # 5. Handling "ibid" manually
    if re.search(r"\bibid\b", sentence, re.IGNORECASE):
        if last_reference:
            references.append({"text": last_reference, "match_type": "Contextual - Ibid Reference"})

    # 6. Remove duplicates in the same sentence
    seen = set()
    clean_references = []
    for ref in references:
        key = (ref["text"].lower(), ref["match_type"])
        if key not in seen:
            seen.add(key)
            clean_references.append(ref)

    return clean_references

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
