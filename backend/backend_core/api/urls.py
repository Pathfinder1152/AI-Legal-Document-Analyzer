from django.urls import path
from .views import test_api, health_check
from .views import upload_document, get_document_status, get_document, chat_with_document, debug_info

urlpatterns = [
    path('test/', test_api, name='test_api'),
    path('health-check/', health_check, name='health_check'),
    path('debug/', debug_info, name='debug_info'),
    path('upload/', upload_document, name='upload_document'),
    path('documents/<str:document_id>/status/', get_document_status, name='get_document_status'),
    path('documents/<str:document_id>/', get_document, name='get_document'),
    path('chat/', chat_with_document, name='chat_with_document'),
]
