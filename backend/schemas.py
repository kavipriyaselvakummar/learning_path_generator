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