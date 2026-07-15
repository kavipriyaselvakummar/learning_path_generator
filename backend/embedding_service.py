from sentence_transformers import SentenceTransformer
from rag_service import load_all_pdfs, split_text

model = SentenceTransformer("all-MiniLM-L6-v2")
 
def create_embeddings(chunks):
    embeddings = model.encode(chunks)
    return embeddings

def create_query_embedding(query):
    return model.encode([query])

if __name__ == "__main__":
    
    text = load_all_pdfs()
    chunks = split_text(text)

    embeddings = create_embeddings(chunks)

    print("Number of embeddings:",len(embeddings))
    print("Number of chunks:",len(chunks))
    print("Dimension:",len(embeddings[0]))