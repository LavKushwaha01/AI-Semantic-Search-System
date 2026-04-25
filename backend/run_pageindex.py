import json
import os

def build_page_index(documents_path="data/documents.json", output_path="data/pageindex.json"):
    with open(documents_path) as f:
        docs = json.load(f)

    sections = {}
    for doc in docs:
        section = doc.get("section", "general")
        if section not in sections:
            sections[section] = {
                "node_id": f"section_{section}",
                "label": section.upper(),
                "children": []
            }
        sections[section]["children"].append({
            "node_id": f"doc_{doc['id']}",
            "doc_id": doc["id"],
            "title": doc["title"],
            "content": doc["content"],
            "keywords": doc["title"].lower().split() + doc["content"].lower().split()[:20]
        })

    page_index = {
        "root": {
            "node_id": "root",
            "label": "Knowledge Base",
            "children": list(sections.values())
        }
    }

    os.makedirs("data", exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(page_index, f, indent=2)

    print(f"✅ PageIndex built: {len(docs)} documents across {len(sections)} sections")
    print(f"   Saved to {output_path}")

if __name__ == "__main__":
    build_page_index()