import os
import json
import tiktoken
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM

# Default config
MAX_INPUT_TOKENS = 1024
TARGET_SUMMARY_TOKENS = 1024
MODEL_NAME = "facebook/bart-large-cnn"

tokenizer = tiktoken.get_encoding("cl100k_base")

def count_tokens(text):
    return len(tokenizer.encode(text))

def batch_chunks(input_chunks, max_tokens=MAX_INPUT_TOKENS):
    batches = []
    current_batch = []
    current_tokens = 0

    for chunk in input_chunks:
        chunk_tokens = count_tokens(chunk)
        if current_tokens + chunk_tokens > max_tokens:
            batches.append(" ".join(current_batch))
            current_batch = [chunk]
            current_tokens = chunk_tokens
        else:
            current_batch.append(chunk)
            current_tokens += chunk_tokens

    if current_batch:
        batches.append(" ".join(current_batch))

    return batches

def recursive_summarize(chunks, model_name=MODEL_NAME):
    summarizer = pipeline("summarization", model=model_name, tokenizer=model_name)
    history = []
    current = chunks[:]
    level = 0

    while True:
        level += 1
        print(f"[Level {level}] Chunks: {len(current)}")

        summaries = []
        for chunk in current:
            try:
                result = summarizer(chunk, max_length=200, min_length=30, do_sample=False)
                summaries.append(result[0]['summary_text'])
            except Exception as e:
                print(f"Summarization failed: {e}")
                continue

        history.append({
            "level": level,
            "summaries": summaries,
            "total_tokens": sum(count_tokens(s) for s in summaries)
        })

        total_tokens = history[-1]["total_tokens"]
        if total_tokens <= TARGET_SUMMARY_TOKENS or len(summaries) == 1:
            return {
                "final_summary": " ".join(summaries),
                "initial_chunk_summaries": history[0]["summaries"],
                "token_count": total_tokens,
                "model_used": model_name,
                "levels": level
            }

        # Recursively summarize the summaries
        current = batch_chunks(summaries)

if __name__ == "__main__":
    with open("example_chunks.json", "r", encoding="utf-8") as f:
        chunks = json.load(f)

    result = recursive_summarize(chunks)

    with open("recursive_summary_output.json", "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print("\nFinal summary:\n")
    print(result["final_summary"])