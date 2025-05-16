"""
API endpoints for clause classification.
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from models.clause_classifier.classifier import get_classifier

@api_view(['POST'])
def classify_clause(request):
    """
    Classify a text into a clause type.
    
    Request body:
    {
        "text": "The text to classify"
    }
    """
    if not request.data or 'text' not in request.data:
        return Response({
            "error": "No text provided for classification"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    text = request.data['text']
    
    # Get or initialize the classifier
    classifier = get_classifier()
    
    try:
        # Classify the text
        result = classifier.classify(text)
        
        return Response({
            "text": text,
            "classification": result
        })
    except Exception as e:
        return Response({
            "error": f"Classification failed: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def classify_clauses_batch(request):
    """
    Classify multiple texts into clause types.
    
    Request body:
    {
        "texts": ["Text 1", "Text 2", ...]
    }
    """
    if not request.data or 'texts' not in request.data or not isinstance(request.data['texts'], list):
        return Response({
            "error": "Invalid request format. Expected {'texts': [...]}"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    texts = request.data['texts']
    
    # Get or initialize the classifier
    classifier = get_classifier()
    
    try:
        # Classify the texts
        results = classifier.classify_batch(texts)
        
        return Response({
            "results": [
                {
                    "text": text, 
                    "classification": result
                } for text, result in zip(texts, results)
            ]
        })
    except Exception as e:
        return Response({
            "error": f"Classification failed: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
