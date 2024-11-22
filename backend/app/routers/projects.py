from typing import Annotated
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, Path
from ..models import Base
from ..models import Projects
from ..database import engine, SessionLocal
from .auth import get_current_user
from ..routers import auth

from fastapi import APIRouter


router = APIRouter(
    prefix='/projects',
    tags=['projects']
)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class ProjectRequest(BaseModel):
    title : str = Field(min_lenght=3)
    description :str = Field(min_length=3, max_length=100)

class UserRequest(BaseModel):
    user_id : int
    project_id : int

@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(Projects).all()

@router.post("/new", status_code=status.HTTP_201_CREATED)
async def create_project(user: user_dependency,
                         db: db_dependency, project_request: ProjectRequest):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    project_model = Projects(**project_request.model_dump(), owner_id=user.get('id'))

    db.add(project_model)
    db.commit()

@router.get("/users", status_code=status.HTTP_200_OK)
async def get_users(user: user_dependency,
                    db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    return JSONResponse(
            content={"users": [
                        {
                            "id" : 1,
                            "email" : "johnnybravo@example.com",
                            "username" : "johnny",
                            "first_name" : "Johnny",
                            "last_name" : "Bravo",
                            "role_id" : "1"
                        }
                    ],
                    "message": ""},
                    status_code=200
                )

@router.post("/users", status_code=status.HTTP_201_CREATED)
async def add_user(user: user_dependency,
                         db: db_dependency, user_request: UserRequest):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
@router.delete("/users", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user: user_dependency,
                         db: db_dependency, user_request: UserRequest):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')