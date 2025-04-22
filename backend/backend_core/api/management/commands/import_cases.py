import json
import os
from django.core.management.base import BaseCommand
from api.models import CaseMetadata
from django.utils.dateparse import parse_datetime

ANNOTATIONS_DIR = 'D:\\ai-legal-document-analysis\\backend\\data\\annotated'

class Command(BaseCommand):
    help = 'Import case metadata from annotated JSON files'

    def handle(self, *args, **kwargs):
        for filename in os.listdir(ANNOTATIONS_DIR):
            if filename.endswith(".json"):
                filepath = os.path.join(ANNOTATIONS_DIR, filename)

                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                except UnicodeDecodeError:
                    try:
                        with open(filepath, 'r', encoding='Windows-1252') as f:
                            data = json.load(f)
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"❌ Skipped {filename}: {e}"))
                        continue

                metadata = data.get("metadata", {})

                CaseMetadata.objects.update_or_create(
                    file_name=data.get("file_name", filename.replace(".json", "")),
                    defaults={
                        "case_number": metadata.get("case_number"),
                        "neutral_citation": metadata.get("neutral_citation"),
                        "court": metadata.get("court"),
                        "judges": metadata.get("judges", []),
                        "hearing_date": metadata.get("hearing_date"),
                        "parties": metadata.get("parties", {}),
                        "representatives": metadata.get("representatives", {}),
                        "text_path": data.get("text_path", ""),
                        "extracted_at": parse_datetime(metadata.get("extracted_at")) if metadata.get("extracted_at") else None
                    }
                )

        self.stdout.write(self.style.SUCCESS("✅ Case metadata imported successfully."))
