from fastapi import FastAPI,Depends
from sqlalchemy.orm import Session
from gemini_service import generate_learning_roadmap
from database import engine, get_db
from models import Base,User,LearningGoal,LearningPath
from schemas import UserCreate,LearningGoalCreate,LearningGoalUpdate,LearningPathGenerator,RoadmapCreate
Base.metadata.create_all(bind=engine)
app = FastAPI()

@app.get("/")
def home():
    return {"message":"AI learning path generator"}

@app.post("/users")
def create_user(user:UserCreate, db:Session = Depends(get_db)):
    new_user=User(name = user.name,email = user.email)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.post("/learning-goals")
def create_learning_goal(
    learning_goal: LearningGoalCreate,
    db: Session = Depends(get_db)
):
    new_goal = LearningGoal(
        user_id = learning_goal.user_id,
        goal = learning_goal.goal,
        current_skills = learning_goal.current_skills,
        duration = learning_goal.duration
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal

@app.get("/learning-goals")
def get_learning_goals(db:Session = Depends(get_db)):
    goals = db.query(LearningGoal).all()
    return goals

@app.post("/generate-path/{goal_id}")
def generate_path(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(LearningGoal).filter(
        LearningGoal.id == goal_id
    ).first()

    if not goal:
        return {"error": "Goal not found"}

    roadmap= generate_learning_roadmap(
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

    return {
        "goal": goal.goal,
        "roadmap": roadmap
    }

@app.get("/learning-paths")
def get_learning_paths(db: Session = Depends(get_db)):
    paths = db.query(LearningPath).all()
    return paths

@app.get("/learning-paths/{path_id}")
def get_learning_path(path_id: int,db:Session = Depends(get_db)):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id
    ).first()

    if not path:
        return {"error":"Learning path not found"}
    
    return path

@app.put("/learning-goals/{goal_id}")
def update_learning_goal(
    goal_id: int,
    updated_goal: LearningGoalUpdate,
    db: Session = Depends(get_db)
):
    goal = db.query(LearningGoal).filter(
        LearningGoal.id == goal_id
    ).first()

    if not goal:
        return {"error":"Goal not found"}
    
    goal.goal = updated_goal.goal
    goal.current_skills = updated_goal.current_skills
    goal.duration = updated_goal.duration

    db.commit()
    db.refresh(goal)

    return goal

@app.delete("/learning-goals/{goal_id}")
def delete_learning_goal(
    goal_id : int,
    db: Session = Depends(get_db)
):
    goal = db.query(LearningGoal).filter(
        LearningGoal.id == goal_id
    ).first()

    if not goal:
        return {"error":"Goal not found"}
    
    db.delete(goal)
    db.commit()

    return {"message":"Goal deleted successfully"}

@app.post("/generate-roadmap")
def generate_roadmap(
    request : RoadmapCreate,
    db: Session = Depends(get_db)
):
    roadmap = generate_learning_roadmap(
        request.goal,
        request.skills,
        request.duration
    )

    return{
        "goal":request.goal,
        "roadmap":roadmap
    }

