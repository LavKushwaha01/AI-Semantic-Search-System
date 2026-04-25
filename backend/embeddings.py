# from sentence_transformers import SentenceTransformer
# import numpy as np

# model = SentenceTransformer('all-MiniLM-L6-v2', device='cpu')

# def get_embedding(text: str) -> np.ndarray:
#     return model.encode(text, normalize_embeddings=True)

# def get_embeddings(texts: list[str]) -> np.ndarray:
#     return model.encode(texts, normalize_embeddings=True)

# def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
#     return float(np.dot(a, b))

import requests
import numpy as np
import os

HF_API_KEY = os.getenv("HF_API_KEY")

MODEL_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"

headers = {"Authorization": f"Bearer {HF_API_KEY}"}


def get_embedding(text: str):
    try:
        res = requests.post(MODEL_URL, headers=headers, json={"inputs": text})

        if res.status_code != 200:
            print("HF API Error:", res.text)
            return np.zeros(384)

        data = res.json()

        # Fix nested list issue
        if isinstance(data, list) and isinstance(data[0], list):
            return np.array(data[0])

        return np.array(data)

    except Exception as e:
        print("Embedding error:", str(e))
        return np.zeros(384)


def get_embeddings(texts: list[str]) -> np.ndarray:
    return np.array([get_embedding(t) for t in texts])