from pinecone import Pinecone
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add the project root to the path so we can import the settings
script_dir = Path(__file__).resolve().parent
project_root = script_dir.parent
backend_core_dir = project_root / 'backend' / 'backend_core'
sys.path.insert(0, str(backend_core_dir))

# Try to load from .env file in the backend directory
env_path = project_root / 'backend' / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

# Get API key from environment
pinecone_api_key = os.environ.get('PINECONE_API_KEY')
if not pinecone_api_key:
    print("WARNING: No Pinecone API key found in environment variables. Please set PINECONE_API_KEY.")
    sys.exit(1)

# Import after setting up the path
from api.models import CaseMetadata

# Init Pinecone
pc = Pinecone(api_key=pinecone_api_key)
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
