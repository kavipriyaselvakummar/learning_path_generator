from pypdf import PdfReader
from pathlib import Path
import os

BASE_DIR = Path(__file__).parent
DATA_DIR =BASE_DIR/"data"
def load_pdf(pdf_path):
    reader = PdfReader(pdf_path)

    text = ""

    for page in reader.pages:
        try:
           page_text = page.extract_text()

           if page_text:
               text += page_text + "\n"
        except Exception as e:
            print("Error reading page:",e)
    print(pdf_path.name,"Characters:",len(text))

    return text
 
def load_all_pdfs(data_folder=DATA_DIR):
    print("Current working Directory:",os.getcwd())
    folder = Path(data_folder)

    print("FOLDER EXISTS:",folder.exists())
    print("ABSOLUTE PATH:",folder.resolve())

    print("Files in folder:")
    if folder.exists():
        for f in folder.iterdir():
            print(f)

    pdf_files = list(folder.glob("*.pdf"))
    print("PDFs found:",pdf_files)
    all_text = ""

    pdf_files = list(Path(data_folder).glob("*.pdf"))
    print("PDFs found:",pdf_files)

    for pdf in pdf_files:
        try:
           print(f"Loading {pdf.name}")
           all_text += load_pdf(pdf)
        except Exception as e:
            print(f"Error reading {pdf.name}: {e}")

    return all_text

def split_text(text,chunk_size=1000,overlap=200):
    chunks=[]
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

if __name__ == "__main__":
    text = load_all_pdfs()
    chunks = split_text(text)
    print("Number of chunks:",len(chunks))
    print()
    print(chunks[0])

