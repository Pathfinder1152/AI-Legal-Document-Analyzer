from django.http import JsonResponse

def home(request):
    """
    Simple home view for the Django backend
    """
    return JsonResponse({
        'message': 'Welcome to the Legal Document Analyzer API',
        'endpoints': {
            'api/test/': 'Test API endpoint',
            'api/debug/': 'Debug information endpoint',
            'api/upload/': 'Upload documents for analysis',
            'api/documents/<document_id>/': 'Get document details',
            'api/documents/<document_id>/status/': 'Check document processing status',
            'api/chat/': 'Chat with documents using AI'
        }
    }) 