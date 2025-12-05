import os
import chromadb
from chromadb.config import Settings
from functools import lru_cache

@lru_cache()
def get_chroma_client():
    """
    Get a singleton ChromaDB client instance.
    Uses environment variables for configuration.
    """
    host = os.getenv("CHROMA_HOST", "localhost")
    port = os.getenv("CHROMA_PORT", "8000")
    api_key = os.getenv("CHROMA_API_KEY")
    tenant = os.getenv("CHROMA_TENANT", "default_tenant")
    database = os.getenv("CHROMA_DATABASE", "default_database")
    
    print(f"Connecting to ChromaDB at {host}:{port} (Tenant: {tenant})")
    
    try:
        # If API key is present, assume we need authentication
        if api_key:
            client = chromadb.HttpClient(
                host=host,
                port=int(port),
                headers={"X-Chroma-Token": api_key},
                tenant=tenant,
                database=database,
                settings=Settings(allow_reset=True, anonymized_telemetry=False)
            )
        else:
            # Fallback to local persistent client if no host/key provided, 
            # or HttpClient without auth if host provided but no key.
            # But user said "added relevant api key", so likely the above path.
            # If they are running locally without auth, this might fail if we enforce key.
            # Let's try HttpClient without headers if no key.
             client = chromadb.HttpClient(
                host=host,
                port=int(port),
                tenant=tenant,
                database=database,
                settings=Settings(allow_reset=True, anonymized_telemetry=False)
            )
            
        return client
    except Exception as e:
        print(f"Error connecting to ChromaDB: {e}")
        # Fallback to local persistent storage if remote fails? 
        # The user wants to replace local storage, so maybe we shouldn't fallback silently.
        # But for development safety, maybe.
        # For now, let's raise or return None.
        raise e

def get_face_collection():
    client = get_chroma_client()
    # Collection for face embeddings (already computed by InsightFace)
    # We don't need an embedding function because we provide embeddings directly
    return client.get_or_create_collection(
        name="faces",
        metadata={"hnsw:space": "cosine"} # Use cosine similarity for face embeddings
    )

def get_conversation_collection():
    client = get_chroma_client()
    # Collection for conversation history
    # Uses default embedding function (all-MiniLM-L6-v2) for text
    return client.get_or_create_collection(
        name="conversations",
        metadata={"hnsw:space": "cosine"}
    )
