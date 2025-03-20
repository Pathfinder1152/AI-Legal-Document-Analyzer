from transformers import pipeline

# Load summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text):
    """Generates a summary for legal documents"""
    if len(text.split()) < 20:  # Ensure the text isn't too short
        return "Text is too short for summarization."
    
    summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
    return summary[0]["summary_text"]