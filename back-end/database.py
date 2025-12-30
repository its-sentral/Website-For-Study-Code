from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


DATABASE_URL = "sqlite:///./users.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}) #create database file
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  #creates the session to use the database
Base = declarative_base() # reates a base class for ORM models.

#create usermodels
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)


class QuizProgress(Base):
    __tablename__ = "quiz_progress"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True) # Who took the quiz
    quiz_id = Column(String, index=True)  # Unique ID ex 109_1.1
    is_completed = Column(Boolean, default=True)
    
# create tables
Base.metadata.create_all(bind=engine)