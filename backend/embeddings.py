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

def get_embedding(text: str) -> np.ndarray:
    res = requests.post(MODEL_URL, headers=headers, json={"inputs": text})
    res.raise_for_status()  # fail fast if API error
    return np.array(res.json())

def get_embeddings(texts: list[str]) -> np.ndarray:
    return np.array([get_embedding(t) for t in texts])