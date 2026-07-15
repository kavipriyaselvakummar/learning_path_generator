from rag_service import load_all_pdfs,split_text
from embedding_service import create_embeddings
from faiss_service import build_faiss_index

def initialize_rag():
    text = load_all_pdfs("data")
    chunks = split_text(text)
    embeddings = create_embeddings(chunks)
    index = build_faiss_index(embeddings)
    return index,chunks

INDEX,CHUNKS = initialize_rag()
print("Number of chunks:",len(CHUNKS))
print("Number of vectors:",INDEX.ntotal)