from django.db import models
from django.db.models import JSONField
from django.contrib.postgres.fields import ArrayField

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
