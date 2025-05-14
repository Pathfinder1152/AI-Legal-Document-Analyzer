from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
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
        # Get document
        document = Document.objects.get(id=document_id)
        
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
def search_document(request, document_id):
    """
    Search for similar chunks in a document based on query text
    """
    try:
        # Get document
        document = Document.objects.get(id=document_id)
        
        # Get query from request body
        data = json.loads(request.body)
        query_text = data.get('query')
        top_k = data.get('top_k', 3)
        
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
        # Get document
        document = Document.objects.get(id=document_id)
        
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
