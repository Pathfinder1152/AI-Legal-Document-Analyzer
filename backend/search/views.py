# Find the search_document function and add the parser_classes decorator
@api_view(['POST'])
@parser_classes([JSONParser])
@csrf_exempt
def search_document(request, document_id):
    """
    Search for similar content in a document.
    """
    # Get query from request data
    query = request.data.get('query')
    if not query:
        return Response({'error': 'No query provided'}, status=400)
    
    # Get top_k from URL parameters, default to 5
    try:
        top_k = int(request.GET.get('top_k', 5))
    except ValueError:
        top_k = 5
    
    # Check if user has access to this document
    try:
        # Only allow access to user's own documents or legacy docs with no user
        if request.user.is_authenticated:
            document = Document.objects.filter(
                Q(id=document_id) & 
                (Q(user=request.user) | Q(user=None))
            ).first()
            
            if not document:
                return Response({'error': 'Document not found or access denied'}, status=404)
        else:
            return Response({'error': 'Authentication required to search documents'}, 
                          status=401)
    
        # Call search function to get similar chunks
        results = search_document_by_query(str(document_id), query, top_k)
        
        return Response({'results': results})
    
    except Exception as e:
        logger.error(f"Error in search_document: {str(e)}")
        return Response({'error': str(e)}, status=500)