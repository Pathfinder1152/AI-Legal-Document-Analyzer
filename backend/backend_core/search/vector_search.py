"""
Pinecone vector search utilities
"""
import os
import uuid
from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict, Any
from preprocessing.chunking import smart_chunk_text
from preprocessing.cleaning import clean_paragraph_text
from django.conf import settings
import json

# Pinecone setup - using the api key from embedding.py
pc = Pinecone(api_key="pcsk_5ekBj9_DLGe9otFGoyF5pk9ewkzcHa1DUqEkn9m56PN5QTUnD7bwo6QoU7kBse5XpTAnXg")
PINECONE_INDEX_NAME = "legal-embeddings"

# Constants for chunking
SAFE_MAX_TOKENS = 250
OVERLAP = 50

def get_pinecone_index():
    """Get or create Pinecone index"""
    # Ensure the Pinecone index exists
    if PINECONE_INDEX_NAME not in [i.name for i in pc.list_indexes()]:
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=1024,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
    
    return pc.Index(PINECONE_INDEX_NAME)

def embed_and_upsert_document(document_id: str, text: str, document_name: str) -> Dict[str, Any]:
    """
    Process a document:
    1. Clean the text
    2. Split it into chunks
    3. Generate embeddings
    4. Upsert to Pinecone
    
    Args:
        document_id: UUID of the document
        text: Raw text content
        document_name: Name of the document
        
    Returns:
        Dict with metadata about the process
    """
    # Clean and chunk the text
    cleaned_text = clean_paragraph_text(text)
    chunks = smart_chunk_text(cleaned_text, max_tokens=SAFE_MAX_TOKENS, overlap=OVERLAP)
    
    if not chunks:
        return {
            "success": False,
            "message": "Could not extract meaningful chunks from document",
            "chunks_count": 0
        }
    
    # Get the index
    index = get_pinecone_index()
    
    # Prepare vectors and local storage
    vectors = []
    local_embeddings = []
    
    for i, chunk in enumerate(chunks):
        try:
            # Generate embeddings using Pinecone's endpoint
            response = pc.inference.embed(
                model="llama-text-embed-v2",
                inputs=[chunk],
                parameters={"input_type": "passage"}
            )
            embedding_vector = response[0]["values"]
        except Exception as e:
            print(f"Embedding failed on chunk {i}: {e}")
            continue
            
        # Create a unique ID for this chunk
        vector_id = f"{document_id}_chunk_{i}"
        
        # Store for local use
        local_embeddings.append({
            "chunk_index": i,
            "text": chunk,
            "embedding": embedding_vector
        })
        
        # Format for Pinecone
        vectors.append({
            "id": vector_id,
            "values": embedding_vector,
            "metadata": {
                "document_id": document_id,
                "document_name": document_name,
                "chunk_index": i,
                "text": chunk,
            }
        })
    
    # Save locally in a directory inside media
    embeddings_dir = os.path.join(settings.MEDIA_ROOT, 'embeddings')
    os.makedirs(embeddings_dir, exist_ok=True)
    
    output_path = os.path.join(embeddings_dir, f"{document_id}.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(local_embeddings, f, indent=2)
    
    # Upsert to Pinecone
    try:
        index.upsert(vectors=vectors, namespace=str(document_id))
        return {
            "success": True,
            "message": f"Successfully embedded document and upserted {len(vectors)} vectors",
            "chunks_count": len(vectors),
            "local_path": output_path
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error upserting to Pinecone: {str(e)}",
            "chunks_count": len(vectors),
            "local_path": output_path
        }

def search_similar_chunks(text: str, document_id: str = None, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Search for chunks similar to the given text.
    
    Args:
        text: Query text
        document_id: Optional, limit search to specific document namespace
        top_k: Number of results to return
        
    Returns:
        List of similar chunks with metadata
    """
    # Clean the query text
    cleaned_text = clean_paragraph_text(text)
    
    try:
        # Generate embedding for query
        response = pc.inference.embed(
            model="llama-text-embed-v2",
            inputs=[cleaned_text],
            parameters={"input_type": "passage"}
        )
        query_embedding = response[0]["values"]
    except Exception as e:
        print(f"Query embedding failed: {e}")
        return []
    
    # Get the index
    index = get_pinecone_index()
    
    try:
        # Perform search
        namespace = str(document_id) if document_id else None
        search_response = index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            namespace=namespace
        )
        
        # Format results
        results = []
        for match in search_response.matches:
            results.append({
                "score": match.score,
                "text": match.metadata.get("text", ""),
                "document_id": match.metadata.get("document_id", ""),
                "document_name": match.metadata.get("document_name", ""),
                "chunk_index": match.metadata.get("chunk_index", -1),
            })
        
        return results
    except Exception as e:
        print(f"Search failed: {e}")
        return []
