from django.db import models
from django.db.models import JSONField
from django.contrib.postgres.fields import ArrayField

class CaseMetadata(models.Model):
    case_id = models.CharField(max_length=100, unique=True)
    case_number = models.CharField(max_length=255, null=True, blank=True)
    neutral_citation = models.CharField(max_length=255, null=True, blank=True)
    court = models.TextField(null=True, blank=True)
    judges = ArrayField(models.CharField(max_length=255), blank=True, default=list)
    hearing_date = models.CharField(max_length=100, null=True, blank=True)
    parties = JSONField(blank=True, null=True)
    representatives = JSONField(blank=True, null=True)
    case_text = models.TextField(blank=True)

    def __str__(self):
        return self.case_id
