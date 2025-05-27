import re
import sys
from pprint import pprint

# Test sentence from the document
test_sentence = "1.\tOn 14 September 2005, in the Crown Court at Southwark, before His Honour Judge Rivlin QC, the applicant pleaded guilty to the unlawful and unauthorised interception of electronic mail communications to a public company, contrary to section 1(2) of the Regulation of Investigatory Powers Act 2000 (\"the Act\")."

# Extracted sentence from JSON file
json_sentence = "- - - -  MR T OWEN QC and MR A BAILIN appeared on behalf of THE APPLICANT  MISS S WHITEHOUSE appeared on behalf of THE CROWN  - - - - - - -  J U D G M E N T     Wednesday, 1 February 2006  THE LORD CHIEF JUSTICE:    1.\tOn 14 September 2005, in the Crown Court at Southwark, before His Honour Judge Rivlin QC, the applicant pleaded guilty to the unlawful and unauthorised interception of electronic mail communications to a public company, contrary to section 1(2) of the Regulation of Investigatory Powers Act 2000 (\"the Act\")."

# Other test cases from the user
test_cases = [
    "section 1(2) of the Regulation of Investigatory Powers Act 2000",
    "section 1(2) of the Act",
    "subsection (6) from criminal liability under"
]

# Patterns from legal_references.py
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

# Additional patterns to test
ADDITIONAL_PATTERNS = [
    # Pattern for "section X of the Act"
    r"(?:s\.?|section)\s*\d+[A-Za-z]?\(?[^\)]*\)?(?:\(.*?\))?\s+of\s+the\s+Act",
    
    # Pattern for "subsection (X)" references
    r"(?:sub)?section\s*\(\d+[A-Za-z]?\)",
    
    # More flexible pattern for section references with Act names
    r"(?:s\.?|section)\s*\d+[A-Za-z]?\(?[^\)]*\)?(?:\(.*?\))?\s+of\s+the\s+(?:[A-Za-z]+\s+)*Act(?:\s+\d{4})?"
]

print("=" * 80)
print("TESTING ORIGINAL PATTERNS ON ORIGINAL SENTENCE")
print("=" * 80)
for i, pattern in enumerate(LEGAL_REFERENCE_PATTERNS):
    matches = re.findall(pattern, test_sentence)
    if matches:
        print(f"Pattern {i+1} found: {matches}")
    else:
        print(f"Pattern {i+1}: No match")

print("\n" + "=" * 80)
print("TESTING ORIGINAL PATTERNS ON JSON EXTRACTED SENTENCE")
print("=" * 80)
for i, pattern in enumerate(LEGAL_REFERENCE_PATTERNS):
    matches = re.findall(pattern, json_sentence)
    if matches:
        print(f"Pattern {i+1} found: {matches}")
    else:
        print(f"Pattern {i+1}: No match")

print("\n" + "=" * 80)
print("TESTING ORIGINAL PATTERNS ON SPECIFIC EXAMPLES")
print("=" * 80)
for case in test_cases:
    print(f"\nCase: \"{case}\"")
    matches_found = False
    for i, pattern in enumerate(LEGAL_REFERENCE_PATTERNS):
        matches = re.findall(pattern, case)
        if matches:
            matches_found = True
            print(f"  Pattern {i+1} found: {matches}")
    
    if not matches_found:
        print("  No matches with original patterns")

print("\n" + "=" * 80)
print("TESTING ADDITIONAL PATTERNS")
print("=" * 80)
for case in [test_sentence] + test_cases:
    print(f"\nCase: \"{case}\"")
    for i, pattern in enumerate(ADDITIONAL_PATTERNS):
        matches = re.findall(pattern, case)
        if matches:
            print(f"  Additional pattern {i+1} found: {matches}")

# Test how text cleaning might affect matching
print("\n\nTesting how RTF formatting might affect matching...")
rtf_style_sentence = "1.\\tOn 14 September 2005, in the Crown Court at Southwark, before His Honour Judge Rivlin QC, the applicant pleaded guilty to the unlawful and unauthorised interception of electronic mail communications to a public company, contrary to section 1(2) of the Regulation of Investigatory Powers Act 2000 (\\\"the Act\\\")."

print(f"Original: {rtf_style_sentence}")
for i, pattern in enumerate(LEGAL_REFERENCE_PATTERNS):
    matches = re.findall(pattern, rtf_style_sentence)
    if matches:
        print(f"Pattern {i+1} found: {matches}")
