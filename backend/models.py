from sqlalchemy import Column,Integer,String,ForeignKey,Text,JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__="users"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String)
    email = Column(String,unique=True)
    learning_goals = relationship(
        "LearningGoal",
        back_populates = "users"
    )

class LearningGoal(Base):
    __tablename__ = "learning_goals"

    id = Column(Integer,primary_key=True,index=True)
    user_id = Column(Integer,ForeignKey("users.id"))

    goal = Column(String)
    current_skills = Column(String)
    duration = Column(String)

    users = relationship(
        "User",
        back_populates = "learning_goals"
    )


class LearningPath(Base):
    __tablename__ = "learning_path"

    id = Column(Integer,primary_key=True,index=True)
    goal_id = Column(Integer,ForeignKey("learning_goals.id"))
    roadmap = Column(JSON)

    goal = relationship("LearningGoal")

