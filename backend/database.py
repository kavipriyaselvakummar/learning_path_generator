from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker,relationship

DATABASE_URL = "postgresql://postgres:k%40vi2211@localhost:5432/learning_pathDB"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit = False,autoflush = False,bind = engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()