from pinecone import Pinecone
from api.models import CaseMetadata

# Init Pinecone
pc = Pinecone(api_key="pcsk_5ekBj9_DLGe9otFGoyF5pk9ewkzcHa1DUqEkn9m56PN5QTUnD7bwo6QoU7kBse5XpTAnXg")
index = pc.Index("legal-embeddings")

# Get all namespaces
namespaces = CaseMetadata.objects.exclude(semantic_text_path__isnull=True).values_list("file_name", flat=True).distinct()

# Loop through each and delete vectors
for ns in namespaces:
    try:
        index.delete(delete_all=True, namespace=ns)
        print(f"Cleared vectors from namespace: {ns}")
    except Exception as e:
        print(f"Failed to delete namespace {ns}: {e}")
