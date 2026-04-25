from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from search import semantic_search, keyword_search
from ingest import get_collection
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="AI Semantic Search — Tiered Retrieval System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    get_collection()

@app.get("/")
def root():
    return {"status": "running", "model": "BAAI/bge-small-en-v1.5", "store": "ChromaDB"}

@app.get("/search")
def search(
    q: str = Query(...),
    mode: str = Query("semantic"),
    top_k: int = Query(5)
):
    if mode == "keyword":
        data = keyword_search(q, top_k)
    else:
        data = semantic_search(q, top_k)

    return {
        "query": q,
        "mode": mode,
        "results": data.get("results", []),
        "source": data.get("source", ""),
        "tier": data.get("tier", 1),
        "top_score": data.get("top_score", 0),
        "threshold": data.get("threshold", 0.7),
        "total": len(data.get("results", []))
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/ingest")
def reingest():
    from ingest import ingest_documents
    ingest_documents()
    return {"status": "re-ingested", "message": "55 documents loaded"}