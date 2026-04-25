import numpy as np
from embeddings import get_embedding
from ingest import get_collection
from page_index import PageIndexAgent

CONFIDENCE_THRESHOLD = 0.55

page_agent = PageIndexAgent("data/pageindex.json")

def _label(score: float) -> str:
    if score >= 0.7:
        return "High"
    elif score >= 0.4:
        return "Medium"
    return "Low"

def semantic_search(query: str, top_k: int = 5) -> dict:
    collection = get_collection()
    query_embedding = get_embedding(query)

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=top_k,
        include=["metadatas", "distances", "documents"]
    )

    metadatas = results["metadatas"][0]
    distances = results["distances"][0]
    similarities = [1 - d for d in distances]
    print("Semantic scores:", similarities)
    top_score = max(similarities) if similarities else 0

    if top_score < CONFIDENCE_THRESHOLD:
        fallback_results = page_agent.search(query, top_k)
        return {
            "results": fallback_results,
            "source": "Reasoning Engine (Fallback)",
            "tier": 2,
            "top_score": round(top_score, 3),
            "threshold": CONFIDENCE_THRESHOLD
        }

    vector_results = []
    for meta, sim in zip(metadatas, similarities):
        vector_results.append({
            "id": meta.get("node_id", ""),
            "title": meta["title"],
            "content": meta["content"],
            "score": round(sim * 100, 1),
            "relevance": _label(sim),
            "source": "Vector Match",
            "node_id": meta.get("node_id", "")
        })

    return {
        "results": vector_results,
        "source": "Semantic Vector Search (Primary)",
        "tier": 1,
        "top_score": round(top_score, 3),
        "threshold": CONFIDENCE_THRESHOLD
    }

def keyword_search(query: str, top_k: int = 5) -> dict:
    import json
    import re
    with open("data/documents.json") as f:
        documents = json.load(f)

    STOPWORDS = {"the", "is", "at", "which", "on", "and", "a", "an", "by", "of", "to", "in", "that"}

    query_words = set(
    w for w in re.findall(r'\b\w+\b', query.lower())
    if w not in STOPWORDS and len(w) > 3
    )

    results = []
    for doc in documents:
        text = f"{doc['title']} {doc['content']}".lower()
        text_words = set(re.findall(r'\b\w+\b', text))

        matches = sum(1 for w in query_words if w in text_words)
        if matches > 0:
            score = matches / len(query_words)
            results.append({
                "id": doc["id"],
                "title": doc["title"],
                "content": doc["content"],
                "score": round(score * 100, 1),
                "relevance": _label(score),
                "source": "Keyword Match"
            })

    results.sort(key=lambda x: x["score"], reverse=True)
    return {"results": results[:top_k], "source": "Keyword Search"}