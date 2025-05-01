import nltk
import tiktoken
from nltk.tokenize import sent_tokenize

nltk.download('punkt', quiet=True)

# Tokenizer matching llama-text-embed-v2's tokenizer (CL100k)
tokenizer = tiktoken.get_encoding("cl100k_base")

def count_tokens(text):
    return len(tokenizer.encode(text))

def smart_chunk_text(text, max_tokens=1800, overlap=200):
    """
    Splits cleaned legal document text into chunks with optional overlap.
    Uses sentence boundaries and preserves token count limits.

    Args:
        text (str): Input cleaned document.
        max_tokens (int): Max tokens per chunk.
        overlap (int): Tokens to retain from previous chunk.

    Returns:
        List[str]: List of chunked text segments.
    """
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks = []
    current_chunk = []
    current_tokens = 0

    for para in paragraphs:
        sentences = sent_tokenize(para)
        for sentence in sentences:
            tokens = count_tokens(sentence)

            if current_tokens + tokens > max_tokens:
                # Finalize current chunk
                chunks.append(" ".join(current_chunk))

                # Handle overlap from previous chunk
                if overlap > 0:
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
                else:
                    current_chunk = []
                    current_tokens = 0

            current_chunk.append(sentence)
            current_tokens += tokens

    # Final chunk
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
