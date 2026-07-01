from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def create_embeddings(chunks):
    embeddings = model.encode(chunks)
    return embeddings

if __name__ == "__main__":
    chunks = [
        "Python is easy.",
        "Machine Learning uses data.",
        "FastAPI builds APIs."
    ]

    embeddings = create_embeddings(chunks)

    print("Number of embeddings:",len(embeddings))
    print()

    print("Dimension:",len(embeddings[0]))
    print()

    print(embeddings[0])