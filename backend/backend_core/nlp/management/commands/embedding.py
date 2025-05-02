import os
import json
from django.core.management.base import BaseCommand
from pinecone import Pinecone, ServerlessSpec
from preprocessing.cleaning import clean_paragraph_text
from preprocessing.chunking import smart_chunk_text
from api.models import CaseMetadata

BASE_DIR = "D:/ai-legal-document-analysis/"

# Pinecone setup
pc = Pinecone(api_key="pcsk_5ekBj9_DLGe9otFGoyF5pk9ewkzcHa1DUqEkn9m56PN5QTUnD7bwo6QoU7kBse5XpTAnXg")
PINECONE_INDEX_NAME = "legal-embeddings"

# Ensure the Pinecone index exists
if PINECONE_INDEX_NAME not in [i.name for i in pc.list_indexes()]:
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=1024,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )

index = pc.Index(PINECONE_INDEX_NAME)

SAFE_MAX_TOKENS = 250
OVERLAP = 50
EMBEDDING_DIR = os.path.join(BASE_DIR, "data", "embeddings")

class Command(BaseCommand):
    help = "Generate vector embeddings and upsert to Pinecone (plus save JSON locally)."

    def handle(self, *args, **kwargs):
        
        cases = CaseMetadata.objects.exclude(semantic_text_path__isnull=True)

        for case in cases:
            file_path = os.path.join(BASE_DIR, case.semantic_text_path)
            if not os.path.isfile(file_path):
                self.stdout.write(self.style.WARNING(f"File not found: {file_path}"))
                continue

            with open(file_path, 'r', encoding='utf-8') as f:
                raw_text = f.read()

            cleaned = clean_paragraph_text(raw_text)
            chunks = smart_chunk_text(cleaned, max_tokens=SAFE_MAX_TOKENS, overlap=OVERLAP)

            local_embeddings = []
            vectors = []

            for i, chunk in enumerate(chunks):
                try:
                    response = pc.inference.embed(
                        model="llama-text-embed-v2",
                        inputs=[chunk],
                        parameters={"input_type": "passage"}
                    )
                    embedding_vector = response[0]["values"]
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Embedding failed on chunk {i}: {e}"))
                    continue

                # Local storage format
                local_embeddings.append({
                    "chunk_index": i,
                    "text": chunk,
                    "embedding": embedding_vector
                })

                # Pinecone vector format
                vector_id = f"{case.file_name}_chunk_{i}"
                vectors.append({
                    "id": vector_id,
                    "values": embedding_vector,
                    "metadata": {
                        "file_name": case.file_name,
                        "chunk_index": i,
                        "text": chunk,
                    }
                })

            # Save locally
            os.makedirs(EMBEDDING_DIR, exist_ok=True)
            output_path = os.path.join(EMBEDDING_DIR, f"{case.file_name}.json")
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(local_embeddings, f, indent=2)

            # Push to Pinecone
            try:
                index.upsert(vectors=vectors, namespace=case.file_name)
                self.stdout.write(self.style.SUCCESS(f"Upserted {len(vectors)} vectors to Pinecone in namespace '{case.file_name}'"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Pinecone upsert failed: {e}"))

            self.stdout.write(self.style.SUCCESS(f"Embeddings saved: {output_path}"))
