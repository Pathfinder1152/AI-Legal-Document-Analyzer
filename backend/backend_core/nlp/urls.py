from django.urls import path
from .views import upload_and_summarize

urlpatterns = [
    path('upload/', upload_and_summarize, name='upload_and_summarize'),
]