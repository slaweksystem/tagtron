from typing import Annotated
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, status, Path
import models
from models import Project
from database import engine, SessionLocal

from database import SessionLocal

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

class ProjectRequest(BaseModel):
    title : str = Field(min_lenght=3)
    description :str = Field(min_length=3, max_length=100)

@app.get("/")
def get_projects():
    return {'message': 'Hello!'}

@app.get("/Project", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(Project).all()

@app.post("/Project", status_code=status.HTTP_201_CREATED)
async def create_todo(db: db_dependency, todo_request: ProjectRequest):
    todo_model = Project(**todo_request.model_dump())

    db.add(todo_model)
    db.commit()
