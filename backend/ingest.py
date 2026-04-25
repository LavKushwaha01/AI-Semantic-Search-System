import json
import chromadb
from embeddings import get_embeddings

COLLECTION_NAME = "semantic_search"

def get_chroma_client():
    return chromadb.PersistentClient(path="./chroma_db")

def ingest_documents(documents_path: str = "data/documents.json"):
    client = get_chroma_client()

    try:
        client.delete_collection(COLLECTION_NAME)
    except:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"}
    )

    with open(documents_path) as f:
        documents = json.load(f)

    texts = [f"{doc['title']}. {doc['content']}" for doc in documents]
    embeddings = get_embeddings(texts)

    collection.add(
        ids=[doc["id"] for doc in documents],
        embeddings=embeddings.tolist(),
        documents=texts,
        metadatas=[{
            "title": doc["title"],
            "content": doc["content"],
            "section": doc.get("section", "general"),
            "node_id": f"doc_{doc['id']}"
        } for doc in documents]
    )

    print(f"✅ Ingested {len(documents)} documents into ChromaDB")
    return collection

def get_collection():
    client = get_chroma_client()
    try:
        return client.get_collection(COLLECTION_NAME)
    except:
        print("Collection not found, ingesting now...")
        return ingest_documents()