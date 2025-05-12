from transformers import pipeline

def summarize_text(text):
    """Summarizes the given text using a pre-trained model."""
    if not text or len(text.split()) < 50:  # Check if text is empty or too short
        return "The text is too short to summarize."

    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    try:
        summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        return f"Error during summarization: {str(e)}"