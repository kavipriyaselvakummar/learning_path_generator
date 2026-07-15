from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
# from cache_service import INDEX, CHUNKS
# from embedding_service import create_query_embedding
# from faiss_service import search, retrieve_chunks
from gemini_service import generate_learning_roadmap, chat_with_ai, generate_quiz, generate_notes
from database import engine, get_db
from models import Base, User, LearningGoal, LearningPath, Progress
from schemas import (
    UserCreate, UserResponse, UserLogin, Token, 
    LearningGoalCreate, LearningGoalUpdate, RoadmapCreate, 
    LearningPathResponse, ProgressUpdate, ProgressResponse,
    ChatRequest, TopicRequest
)
from auth import (
    get_password_hash, verify_password, create_access_token, 
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from datetime import timedelta

Base.metadata.create_all(bind=engine)
app = FastAPI(title="AI OS Learning Path Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI learning path generator"}

# --- AUTHENTICATION ---
@app.post("/auth/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(name=user.name, email=user.email, hashed_password=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- LEARNING GOALS ---
@app.post("/learning-goals")
def create_learning_goal(
    learning_goal: LearningGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_goal = LearningGoal(
        user_id=current_user.id,
        goal=learning_goal.goal,
        current_skills=learning_goal.current_skills,
        duration=learning_goal.duration
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@app.get("/learning-goals")
def get_learning_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goals = db.query(LearningGoal).filter(LearningGoal.user_id == current_user.id).all()
    return goals

# --- ROADMAP & PATHS ---
@app.post("/generate-path/{goal_id}")
def generate_path(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(LearningGoal).filter(
        LearningGoal.id == goal_id, LearningGoal.user_id == current_user.id
    ).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    roadmap = generate_learning_roadmap(
        goal.goal,
        goal.current_skills,
        goal.duration
    )

    new_path = LearningPath(
        goal_id=goal.id,
        roadmap=roadmap
    )
    db.add(new_path)
    db.commit()
    db.refresh(new_path)
    return {"goal": goal.goal, "roadmap": roadmap}

@app.get("/learning-paths")
def get_learning_paths(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    paths = db.query(LearningPath).join(LearningGoal).filter(LearningGoal.user_id == current_user.id).all()
    return paths

# --- PROGRESS ---
@app.post("/progress")
def update_progress(
    progress_update: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    progress = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.topic_id == progress_update.topic_id
    ).first()
    
    if progress:
        progress.status = progress_update.status
        progress.hours_spent += progress_update.hours_spent
        if progress_update.status == "completed":
            from datetime import datetime
            progress.completed_at = datetime.utcnow()
    else:
        progress = Progress(
            user_id=current_user.id,
            topic_id=progress_update.topic_id,
            status=progress_update.status,
            hours_spent=progress_update.hours_spent
        )
        db.add(progress)
    
    db.commit()
    db.refresh(progress)
    return progress

@app.get("/progress")
def get_progress(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    progress = db.query(Progress).filter(Progress.user_id == current_user.id).all()
    return progress

# --- AI FEATURES ---
@app.post("/chat")
def chat(request: ChatRequest):
    try:
        response = chat_with_ai(request.message, request.history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/quiz")
def get_quiz(request: TopicRequest):
    try:
        quiz = generate_quiz(request.topic)
        return quiz
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/flashcards")
def get_flashcards(request: TopicRequest):
    try:
        notes = generate_notes(request.topic)
        return notes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-path-preview")
def generate_path_preview(request: RoadmapCreate):
    """Generate a roadmap preview without saving to DB. No auth required."""
    try:
        roadmap = generate_learning_roadmap(request.goal, request.skills, request.duration)
        return {"goal": request.goal, "roadmap": roadmap, "months": roadmap.get("months", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
