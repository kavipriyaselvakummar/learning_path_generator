from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LearningGoalCreate(BaseModel):
    goal: str
    current_skills: str
    duration: str

class LearningGoalUpdate(BaseModel):
    goal: str
    current_skills: str
    duration: str

class RoadmapCreate(BaseModel):
    goal: str
    skills: str
    duration: str

class LearningPathResponse(BaseModel):
    id: int
    goal_id: int
    roadmap: dict

    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    topic_id: str
    status: str
    hours_spent: float

class ProgressResponse(BaseModel):
    id: int
    topic_id: str
    status: str
    hours_spent: float
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, Any]] = []

class TopicRequest(BaseModel):
    topic: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class StudySessionCreate(BaseModel):
    path_id: Optional[int] = None
    topic_id: str

class StudySessionResponse(BaseModel):
    id: int
    user_id: int
    path_id: Optional[int]
    topic_id: str
    start_time: datetime
    end_time: Optional[datetime]
    duration_minutes: float

    class Config:
        from_attributes = True

class FlashcardProgressUpdate(BaseModel):
    topic_id: str
    card_id: str
    status: str # NEW, LEARNING, MASTERED

class FlashcardProgressResponse(BaseModel):
    id: int
    topic_id: str
    card_id: str
    status: str
    last_reviewed: Optional[datetime]

    class Config:
        from_attributes = True