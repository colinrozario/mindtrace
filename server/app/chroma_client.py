import os
import chromadb
from chromadb.config import Settings
from functools import lru_cache

@lru_cache()
def get_chroma_client():
    """
    Get a singleton ChromaDB client instance.
    Uses environment variables for configuration.
    Connection is cached for performance.
    """
    host = os.getenv("CHROMA_HOST", "localhost")
    port = os.getenv("CHROMA_PORT", "8000")
    api_key = os.getenv("CHROMA_API_KEY", "").strip("'\"")  # Remove quotes if present
    tenant = os.getenv("CHROMA_TENANT", "default_tenant").strip("'\"")
    database = os.getenv("CHROMA_DATABASE", "default_database").strip("'\"")
    
    print(f"Connecting to ChromaDB at {host}:{port} (Tenant: {tenant}, Database: {database})")
    
    try:
        # If API key is present, assume we need authentication
        if api_key:
            # For cloud ChromaDB (api.trychroma.com), use SSL
            ssl = host == "api.trychroma.com" or port == "443"
            
            # Configure settings
            settings = Settings(
                allow_reset=True,
                anonymized_telemetry=False
            )
            
            client = chromadb.HttpClient(
                host=host,
                port=int(port),
                ssl=ssl,
                headers={"X-Chroma-Token": api_key},
                tenant=tenant,
                database=database,
                settings=settings
            )
        else:
            # Fallback to HttpClient without auth
            settings = Settings(
                allow_reset=True,
                anonymized_telemetry=False
            )
            
            client = chromadb.HttpClient(
                host=host,
                port=int(port),
                tenant=tenant,
                database=database,
                settings=settings
            )
            
        # Test connection
        client.heartbeat()
        print(f"✓ ChromaDB connection established successfully")
        return client
    except Exception as e:
        print(f"✗ Error connecting to ChromaDB: {e}")
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
