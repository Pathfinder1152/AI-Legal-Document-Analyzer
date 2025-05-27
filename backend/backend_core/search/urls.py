from django.urls import path
from .views import embed_document, search_document, check_embedding_status

urlpatterns = [
    path('embed/<uuid:document_id>/', embed_document, name='embed_document'),
    path('search/<uuid:document_id>/', search_document, name='search_document'),
    path('status/<uuid:document_id>/', check_embedding_status, name='check_embedding_status'),
]
