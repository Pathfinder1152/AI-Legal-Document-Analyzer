from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework import status
import json
from api.models import Document
from .vector_search import embed_and_upsert_document, search_similar_chunks

@api_view(['POST'])
def embed_document(request, document_id):
    """
    Process and embed a document for semantic search
    """
    try:
        # Only allow access to user's own documents
        if request.user.is_authenticated:
            document = Document.objects.get(id=document_id, user=request.user)
        else:
            return JsonResponse({
                'error': 'Authentication required to embed documents'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if document is analyzed
        if document.status != 'analyzed':
            return JsonResponse({
                'error': 'Document must be analyzed before embedding'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Process embedding
        result = embed_and_upsert_document(
            document_id=str(document.id),
            text=document.content,
            document_name=document.name
        )
        
        if not result['success']:
            return JsonResponse({
                'error': result['message']
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return JsonResponse({
            'message': result['message'],
            'chunks_count': result['chunks_count']
        })
        
    except Document.DoesNotExist:
        return JsonResponse({
            'error': 'Document not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@parser_classes([JSONParser])
def search_document(request, document_id):
    """
    Search for similar chunks in a document based on query text
    """
    try:
        # Only allow access to user's own documents
        if request.user.is_authenticated:
            document = Document.objects.get(id=document_id, user=request.user)
        else:
            return JsonResponse({
                'error': 'Authentication required to search documents'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Get query from request data - using DRF's parsed data
        query_text = request.data.get('query')
        top_k = request.data.get('top_k', 3)
        
        if not query_text:
            return JsonResponse({
                'error': 'Query text is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Call search function
        results = search_similar_chunks(
            text=query_text,
            document_id=str(document.id),
            top_k=top_k
        )
        
        return JsonResponse({
            'results': results
        })
        
    except Document.DoesNotExist:
        return JsonResponse({
            'error': 'Document not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def check_embedding_status(request, document_id):
    """
    Check if a document has been embedded
    """
    try:
        # Only allow access to user's own documents
        if request.user.is_authenticated:
            document = Document.objects.get(id=document_id, user=request.user)
        else:
            return JsonResponse({
                'error': 'Authentication required to check embedding status'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Look for embeddings
        import os
        from django.conf import settings
        
        embeddings_path = os.path.join(settings.MEDIA_ROOT, 'embeddings', f"{document_id}.json")
        is_embedded = os.path.exists(embeddings_path)
        
        return JsonResponse({
            'documentId': str(document.id),
            'isEmbedded': is_embedded
        })
        
    except Document.DoesNotExist:
        return JsonResponse({
            'error': 'Document not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
