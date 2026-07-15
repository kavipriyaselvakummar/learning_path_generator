import faiss
import numpy as np
from rag_service import load_all_pdfs,split_text
from embedding_service import create_embeddings,create_query_embedding

def build_faiss_index(embeddings):
    embeddings = np.array(embeddings).astype("float32")
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index

def search(index,query_embedding,k=3):
    distances,indices = index.search(query_embedding.astype("float32"),k)
    return distances,indices

def retrieve_chunks(chunks,indices):
    retrieved = []

    for idx in indices[0]:
        retrieved.append(chunks[idx])
    
    return retrieved


if __name__ == "__main__":
    text = load_all_pdfs()
    chunks = split_text(text)
    embeddings = create_embeddings(chunks)
    index = build_faiss_index(embeddings)
    query = "How do I become a Machine Learning Engineer?"
    query_embedding = create_query_embedding(query)
    distances,indices = search(index,query_embedding)
    retrieved = retrieve_chunks(chunks,indices)
    context = "\n\n".join(retrieved)
    print("\nRetrieved chunks:\n")

    for chunk in retrieved:
        print(chunk[:300])
        print("-"*60)
    print("Chunks:",len(chunks))
    print("Vectors:",index.ntotal)

