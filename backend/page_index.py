import json

class PageIndexAgent:
    def __init__(self, index_path: str = "data/pageindex.json"):
        with open(index_path) as f:
            self.index = json.load(f)

    def _flatten_nodes(self, node: dict, results: list):
        if "doc_id" in node:
            results.append(node)
        for child in node.get("children", []):
            self._flatten_nodes(child, results)

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        query_terms = set(query.lower().split())
        all_nodes = []
        self._flatten_nodes(self.index["root"], all_nodes)

        scored = []
        for node in all_nodes:
            node_text = f"{node['title']} {node['content']}".lower()
            node_keywords = set(node.get("keywords", []))

            content_matches = sum(1 for t in query_terms if t in node_text)
            keyword_matches = len(query_terms & node_keywords)
            score = (content_matches * 0.6 + keyword_matches * 0.4) / max(len(query_terms), 1)

            if score > 0:
                scored.append({
                    "id": node["doc_id"],
                    "title": node["title"],
                    "content": node["content"],
                    "score": round(score * 100, 1),
                    "relevance": _label(score),
                    "source": "Reasoning Match",
                    "node_id": node["node_id"]
                })

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]


def _label(score: float) -> str:
    if score >= 0.7:
        return "High"
    elif score >= 0.35:
        return "Medium"
    return "Low"