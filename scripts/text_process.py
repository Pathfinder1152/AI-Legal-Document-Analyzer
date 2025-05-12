import re
import nltk
from nltk.corpus import words

# Download word list if not already available
try:
    nltk.data.find('corpora/words')
except LookupError:
    nltk.download('words')

ENGLISH_WORDS = set(words.words())

# Define a list of common exceptions that should always merge, even if both words are valid
EXCEPTIONS = {
    "cannot", "will not", "will be", "is not", "do not", "cannot be", "have not", "would not", 
    "has not", "are not", "was not", "would be", "isn't", "aren't", "doesn't", "didn't", "hasn't"
}

def clean_paragraph_text(text):
    # Normalize line breaks and whitespace
    text = re.sub(r"\s+", " ", text)

    # Remove space after opening brackets or quotes
    text = re.sub(r"([(\[{“‘])\s+", r"\1", text)

    # Remove space before closing brackets or quotes
    text = re.sub(r"\s+([)\]}”’])", r"\1", text)

    # Remove extra space before punctuation
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)

    # Ensure space after punctuation if followed by a word character
    text = re.sub(r"([.,;:!?])(?=\w)", r"\1 ", text)

    # Fix broken words (e.g., "autho risation" -> "authorisation")
    def merge_broken_words(match):
        word1, word2 = match.group(1), match.group(2)
        merged = word1 + word2

        w1 = word1.lower()
        w2 = word2.lower()
        merged_lower = merged.lower()

        if f"{w1} {w2}" in EXCEPTIONS:
            return merged

        if (
            merged_lower in ENGLISH_WORDS and
            not (w1 in ENGLISH_WORDS and w2 in ENGLISH_WORDS) and
            not (len(w1) >= 3 and len(w2) >= 3)
        ):
            return merged

        return word1 + " " + word2

    text = re.sub(r"\b(\w{1,10})\s+(\w{1,10})\b", merge_broken_words, text)

    # Fix broken numeric ranges like "3 to 5" -> "3-5"
    text = re.sub(r"(\d)\s+(to|\-|–|—)\s+(\d)", r"\1-\3", text)

    # Remove space before possessives and contractions
    text = re.sub(r"\s+’s", "’s", text)

    # Fix broken ordinal indicators (e.g., "1 st" -> "1st")
    text = re.sub(r"(\d)\s+(st|nd|rd|th)\b", r"\1\2", text)

    return text.strip()

# Example use
if __name__ == "__main__":
    messy_text = (
        "Support\n\n"
        "was expressed generally, and Mr Macmillan thought a new CTO would not be    \n"
        "required immediately “because we can cope with Janine, Iryna, Bohdan and    \n"
        "Kostya  But there will be an expectation from prospects and investors that there\n"
        "is a technical lead they can meet … a replacement [will mean people] focus less. s(1 )"
    )
    print(clean_paragraph_text(messy_text))
