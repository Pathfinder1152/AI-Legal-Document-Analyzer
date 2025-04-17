import re
from nltk.tokenize import sent_tokenize

# Common UK Acts pattern to match both common and rare acts
UK_ACT_PATTERNS = [
    r"(Computer Misuse Act\s*\d{4})",
    r"(Data Protection Act\s*\d{4})",
    r"(Police and Criminal Evidence Act\s*\d{4})",
    r"(Misuse of Drugs Act\s*\d{4})",
    r"(Terrorism Act\s*\d{4})",
    r"([A-Z][a-z]+(?:\s[A-Z][a-z]+)* Act\s*\d{4})"  # General Act pattern
]

# Section and subsection pattern (e.g., Section 3, Sec. 5(2)(a))
SECTION_PATTERN = r"(Section|Sec\.?)\s+(\d+[A-Za-z]?(\([\dA-Za-z]+\))*)"

def extract_sentences_with_legal_refs(text):
    """
    Extracts sentences from legal text that reference Acts and Sections.
    """
    results = []
    sentences = sent_tokenize(text)

    for sentence in sentences:
        section_match = re.search(SECTION_PATTERN, sentence)
        act_match = None

        for act_pattern in UK_ACT_PATTERNS:
            match = re.search(act_pattern, sentence)
            if match:
                act_match = match.group(1)
                break

        if section_match and act_match:
            results.append({
                "sentence": sentence.strip(),
                "act": act_match,
                "section": section_match.group(2)
            })

    return results
