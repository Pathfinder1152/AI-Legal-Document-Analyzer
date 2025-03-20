from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .summarization import summarize_text

@api_view(['GET','POST'])
def summarize_document(request):
    """API to summarize legal documents"""
    if request.content_type != 'application/json':  # ✅ Check content type
        return Response({"error": "Request must be JSON."}, status=415)
    
    if request.method == 'GET':  
        return Response({"message": "Use a POST request with a text payload to summarize."})  # ✅ Prevents 405 error

    text = request.data.get("text", "")
    if not text:
        return Response({"error": "No text provided"}, status=400)

    # Call the summarization function (assuming summarize_text handles the summarization)
    summary = summarize_text(text)
    
    return Response({"summary": summary})