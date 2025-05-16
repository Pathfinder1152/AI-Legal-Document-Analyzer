import re
import sys
from backend_core.nlp.legal_references import extract_references

# Test sentences with legal references that were previously missed
test_cases = [
    "On 14 September 2005, in the Crown Court at Southwark, before His Honour Judge Rivlin QC, the applicant pleaded guilty to the unlawful and unauthorised interception of electronic mail communications to a public company, contrary to section 1(2) of the Regulation of Investigatory Powers Act 2000 (\"the Act\").",
    "This is covered by section 1(2) of the Act.",
    "As provided in subsection (6) of the regulation.",
    "According to section 12(3)(b) of the Data Protection Act 2018."
]

print("Testing updated legal reference extraction:")
print("=" * 80)

for i, case in enumerate(test_cases):
    print(f"\nTest Case {i+1}: \"{case}\"")
    references = extract_references(case)
    if references:
        for j, ref in enumerate(references):
            print(f"  Reference {j+1}: {ref['text']} (Match type: {ref['match_type']})")
    else:
        print("  No references found")

print("\n" + "=" * 80)
print("Test completed.")
