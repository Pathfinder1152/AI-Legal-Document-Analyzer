from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .file_handler import save_uploaded_file, extract_text_from_file
from .summarization import recursive_summarize

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_and_summarize(request):
    """Handles document upload and summarization."""
    if "file" not in request.FILES:
        return JsonResponse({"error": "No file uploaded"}, status=400)
    
    uploaded_file = request.FILES["file"]

    try:
        # Save the uploaded file
        file_path = save_uploaded_file(uploaded_file)

        # Extract text from the file
        extracted_text = extract_text_from_file(file_path)
        if not extracted_text:
            return JsonResponse({"error": "Could not extract text from file"}, status=400)

        # Summarize the extracted text
        summary = recursive_summarize(extracted_text)

        return JsonResponse({"summary": summary}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)