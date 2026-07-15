from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON, DateTime, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    hashed_password = Column(String, nullable=True) # For JWT auth
    
    learning_goals = relationship("LearningGoal", back_populates="users")
    progress = relationship("Progress", back_populates="user")
    achievements = relationship("Achievement", back_populates="user")
    quiz_history = relationship("QuizHistory", back_populates="user")
    chat_history = relationship("ChatHistory", back_populates="user")

class LearningGoal(Base):
    __tablename__ = "learning_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    goal = Column(String)
    current_skills = Column(String)
    duration = Column(String)
    
    users = relationship("User", back_populates="learning_goals")
    learning_paths = relationship("LearningPath", back_populates="goal")

class LearningPath(Base):
    __tablename__ = "learning_path"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("learning_goals.id"))
    roadmap = Column(JSON)

    goal = relationship("LearningGoal", back_populates="learning_paths")
    projects = relationship("Project", back_populates="learning_path")
    resources = relationship("Resource", back_populates="learning_path")

class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(String) # references the topic in roadmap JSON
    status = Column(String) # 'in_progress', 'completed'
    hours_spent = Column(Float, default=0)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="progress")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    path_id = Column(Integer, ForeignKey("learning_path.id"))
    title = Column(String)
    description = Column(Text)
    difficulty = Column(String)
    estimated_time = Column(String)
    technologies = Column(String) # comma separated
    github_template = Column(String, nullable=True)
    status = Column(String, default="pending") # 'pending', 'completed'
    
    learning_path = relationship("LearningPath", back_populates="projects")

class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    badge_name = Column(String)
    description = Column(String)
    unlocked_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="achievements")

class QuizHistory(Base):
    __tablename__ = "quiz_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_name = Column(String)
    score = Column(Float)
    total_questions = Column(Integer)
    taken_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="quiz_history")

class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text)
    is_ai = Column(Boolean, default=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="chat_history")

class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    path_id = Column(Integer, ForeignKey("learning_path.id"))
    title = Column(String)
    type = Column(String) # book, video, course, article
    url = Column(String)
    recommended_for_stage = Column(String) # month or topic
    
    learning_path = relationship("LearningPath", back_populates="resources")
