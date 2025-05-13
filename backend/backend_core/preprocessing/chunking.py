import nltk
import tiktoken
from nltk.tokenize import sent_tokenize

nltk.download("punkt", quiet=True)

tokenizer = tiktoken.get_encoding("cl100k_base")

def count_tokens(text):
    return len(tokenizer.encode(text))

def smart_chunk_text(text, max_tokens=250, overlap=50):
    """
    Chunk legal document text by sentences, aiming for tighter, semantically meaningful segments.

    Args:
        text (str): Pre-cleaned legal text.
        max_tokens (int): Max tokens per chunk (recommended: 300–500).
        overlap (int): Overlap tokens to retain from previous chunk for context.

    Returns:
        List[str]: List of sentence-packed text chunks.
    """
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = []
    current_tokens = 0

    for sentence in sentences:
        tokens = count_tokens(sentence)

        # Too long to fit anywhere (rare), force as own chunk
        if tokens > max_tokens:
            if current_chunk:
                chunks.append(" ".join(current_chunk))
            chunks.append(sentence)
            current_chunk = []
            current_tokens = 0
            continue

        if current_tokens + tokens > max_tokens:
            chunks.append(" ".join(current_chunk))

            # Overlap: carry over sentences until token budget hits `overlap`
            overlap_chunk = []
            overlap_tokens = 0
            for s in reversed(current_chunk):
                s_tokens = count_tokens(s)
                if overlap_tokens + s_tokens > overlap:
                    break
                overlap_chunk.insert(0, s)
                overlap_tokens += s_tokens

            current_chunk = overlap_chunk
            current_tokens = overlap_tokens

        current_chunk.append(sentence)
        current_tokens += tokens

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks