import re
import spacy
import os
import nltk
from typing import List, Dict, Any, Tuple

# Ensure required NLTK data is available
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

# Load spaCy model (lazy loading to avoid unnecessary loading)
_nlp = None
def get_nlp_model():
    global _nlp
    if _nlp is None:
        try:
            _nlp = spacy.load("en_core_web_trf")
        except OSError:
            # Fallback to a smaller model if transformer model isn't available
            try:
                _nlp = spacy.load("en_core_web_sm")
                print("Warning: Using smaller spaCy model. For better results, install en_core_web_trf")
            except OSError:
                print("Error: No spaCy model found. Please install one with: python -m spacy download en_core_web_sm")
                raise
    return _nlp

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

# Complex regex patterns
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

# Variables for cross-reference handling
last_reference = None

def extract_references(sentence: str) -> List[Dict[str, str]]:
    """
    Extract legal references from a sentence using various methods.
    
    Args:
        sentence: A string containing text to analyze
        
    Returns:
        List of dictionaries with extracted references and their match types
    """
    global last_reference
    references = []
    nlp = get_nlp_model()
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

def process_text_for_annotations(text: str) -> List[Dict[str, Any]]:
    """
    Process a full text document to extract sentences and legal references,
    and format them for annotation use.
    
    Args:
        text: The full document text
        
    Returns:
        List of annotation dictionaries with position information
    """
    nlp = get_nlp_model()
    doc = nlp(text)
    annotations = []
    
    for sent in doc.sents:
        sent_text = sent.text.strip()
        if not sent_text:
            continue
        
        # Get character offsets in the original document
        start_char = sent.start_char
        end_char = sent.end_char
        
        # Extract legal references from this sentence
        refs = extract_references(sent_text)
        
        # Create annotations for each reference
        for ref in refs:
            # Find the exact position of the reference in the sentence
            ref_text = ref["text"]
            
            # Search for the reference in this specific sentence range
            ref_start = text.find(ref_text, start_char, end_char)
            
            if ref_start != -1:
                annotations.append({
                    'text': ref_text,
                    'category': 'legal_term',
                    'startIndex': ref_start,
                    'endIndex': ref_start + len(ref_text),
                    'description': f"Legal reference: {ref['match_type']}"
                })
    
    # Remove overlapping annotations
    return remove_overlapping_annotations(annotations)

def remove_overlapping_annotations(annotations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Remove overlapping annotations to prevent text duplication in the UI.
    
    Args:
        annotations: List of annotation dictionaries
        
    Returns:
        Filtered list of annotations with overlaps removed
    """
    if not annotations:
        return []
        
    # Sort annotations by start index and then by length (shortest first for tiebreakers)
    sorted_annotations = sorted(
        annotations,
        key=lambda a: (a['startIndex'], a['endIndex'] - a['startIndex'])
    )
    
    result = []
    occupied_ranges = []
    
    for annotation in sorted_annotations:
        # Check if this annotation overlaps with any we've already added
        current_range = (annotation['startIndex'], annotation['endIndex'])
        
        # Skip if overlapping with existing annotations
        overlap = False
        for start, end in occupied_ranges:
            # Check for any overlap
            if max(current_range[0], start) < min(current_range[1], end):
                overlap = True
                break
        
        if not overlap:
            result.append(annotation)
            occupied_ranges.append(current_range)
    
    return result
