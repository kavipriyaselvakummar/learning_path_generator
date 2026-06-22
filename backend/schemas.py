from pydantic import BaseModel

class UserCreate(BaseModel):
    name : str
    email : str

class LearningGoalCreate(BaseModel):
    user_id : int
    goal : str
    current_skills : str
    duration : str

class LearningPathGenerator(BaseModel):
    goal_id : int
    roadmap : str

class LearningGoalUpdate(BaseModel):
    goal : str
    current_skills: str
    duration: str

class RoadmapCreate(BaseModel):
    goal : str
    skills : str
    duration :  str
