from django.db import models
from django.db.models import JSONField
from django.contrib.postgres.fields import ArrayField
import uuid

class CaseMetadata(models.Model):
    file_name = models.TextField(primary_key=True)
    case_number = models.TextField(null=True, blank=True)
    neutral_citation = models.TextField(null=True, blank=True)
    court = models.TextField(null=True, blank=True)
    hearing_date = models.TextField(null=True, blank=True)
    judges = models.JSONField(null=True, blank=True)
    parties = models.JSONField(null=True, blank=True)
    representatives = models.JSONField(null=True, blank=True)
    text_path = models.TextField()
    semantic_text_path = models.TextField(null=True, blank=True)
    extracted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.file_name} | {self.case_number or 'No Case No'}"

class Document(models.Model):
    """Model to store uploaded documents and their analysis results"""
    STATUS_CHOICES = [
        ('uploading', 'Uploading'),
        ('processing', 'Processing'),
        ('analyzed', 'Analyzed'),
        ('error', 'Error'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/')
    file_type = models.CharField(max_length=255)
    file_size = models.IntegerField()
    upload_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploading')
    content = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class Annotation(models.Model):
    """Model to store annotations for documents"""
    CATEGORY_CHOICES = [
        ('legal_term', 'Legal Term'),
        ('date', 'Date'),
        ('party', 'Party'),
        ('obligation', 'Obligation'),
        ('condition', 'Condition'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='annotations')
    text = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    start_index = models.IntegerField()
    end_index = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    clause_type = models.CharField(max_length=50, blank=True, null=True, help_text="LEDGAR clause type classification")
    clause_confidence = models.FloatField(blank=True, null=True, help_text="Confidence score for clause type classification")
    created_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.category}: {self.text[:50]}"
