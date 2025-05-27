from django.urls import path
from django.urls import path
from .views import test_api, health_check
from .views import upload_document, get_document_status, get_document, chat_with_document, debug_info, get_chat_history, get_user_documents
from .clause_classification import classify_clause, classify_clauses_batch

urlpatterns = [
    path('test/', test_api, name='test_api'),
    path('health-check/', health_check, name='health_check'),
    path('debug/', debug_info, name='debug_info'),
    path('upload/', upload_document, name='upload_document'),
    path('documents/user/', get_user_documents, name='get_user_documents'),
    path('documents/<str:document_id>/status/', get_document_status, name='get_document_status'),
    path('documents/<str:document_id>/', get_document, name='get_document'),
    path('documents/<str:document_id>/chat-history/', get_chat_history, name='get_chat_history'),
    path('chat/', chat_with_document, name='chat_with_document'),
    path('classify-clause/', classify_clause, name='classify_clause'),
    path('classify-clauses-batch/', classify_clauses_batch, name='classify_clauses_batch'),
]
