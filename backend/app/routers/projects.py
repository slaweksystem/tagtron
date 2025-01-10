from typing import Annotated
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, Path
from ..models import Base, ProjectRoles, Roles
from ..models import Projects
from ..models import ProjectUsers
from ..models import Users
from ..database import engine, SessionLocal
from .auth import get_current_user

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

class UserProjectRequest(BaseModel):
    user_id : int
    project_id : int
    role_id : int

class UserProjectRequestEmail(BaseModel):
    user_email : str
    project_title : str
    role : str

    model_config = {
        "json_schema_extra": {
            "example": {
                "user_email": "example@mail.com",
                "project_title": "Project1",
                "role": "User"
            }
        }
    }

@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(Projects).all()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_project(user: user_dependency,
                         db: db_dependency, 
                         project_request: ProjectRequest):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    project = Projects(**project_request.model_dump(), owner_id=user.get('id'))

    db.add(project)
    db.commit()

    return {"id": project.id, "title": project.title}

# Delete a project
@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Projects).filter(Projects.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}

@router.get("/users/{project_id}", status_code=status.HTTP_200_OK)
async def get_users(user: user_dependency,
                    db: db_dependency,
                    project_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    project_users_model = db.query(ProjectUsers).filter(ProjectUsers.project_id == project_id)
    
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

# Add a user to a project
@router.post("/users", status_code=status.HTTP_201_CREATED)
async def add_user(user: user_dependency,
                         db: db_dependency, request: UserProjectRequest):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    project_user = ProjectUsers(
    project_id=request.project_id,
    user_id=request.user_id
    )

    db.add(project_user)
    db.commit()
    return {"id": project_user.id, "message": "User added to project"}

# Add a user to a project
@router.post("/users", status_code=status.HTTP_201_CREATED)
async def add_user(user: user_dependency,
                         db: db_dependency, request: UserProjectRequest):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    project_user = ProjectUsers(
    project_id=request.project_id,
    user_id=request.user_id
    )
    
    db.add(project_user)
    db.commit()
    return {"message": "User added to project"}

@router.delete("/users/delete_id/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user: user_dependency,
                         db: db_dependency, 
                         id: int = Path()):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    project_user = db.query(ProjectUsers).filter(
    ProjectUsers.id == id
    ).first()

    if not project_user:
        raise HTTPException(status_code=404, detail="User not assigned to this project")
    db.delete(project_user)
    db.commit()
    return {"message": "User removed from project"}

@router.post("/users/email/", status_code=status.HTTP_201_CREATED)
async def add_user_email(user: user_dependency,
                         db: db_dependency,
                         request: UserProjectRequestEmail):
    
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    print(f"Debug: user info: {user}")
    # user info
    user_data = db.query(Users).filter(Users.id == user.get('id')).first()
    if user_data is None:
        print("Debug: fail authentication?")
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    user_role = db.query(Roles).filter(Roles.id == user_data.role_id).first().name

    # get project data
    project_data = db.query(Projects).\
                      filter(Projects.title == request.project_title).first()

    if not project_data:
        raise HTTPException(status_code=404, 
                            detail=f'Project name: {request.project_title} not found')

    user_project_data = db.query(ProjectUsers).filter(ProjectUsers.project_id == project_data.id,
                                                      ProjectUsers.user_id == user_data.id)\
                                              .first()
    
    if user_project_data:
        user_project_role = db.query(ProjectRoles)\
                              .filter(ProjectRoles.id == user_project_data.role_id)\
                              .first().name
    else:
        user_project_role = "None"
    
    print(f"Debug {user_role}")
    # Check if user can add other users:
    if project_data.owner_id == user_data.id or \
       user_project_role == 'Modder' or \
       user_role == 'Admin':
        # Check if new user exists:
        new_user = db.query(Users)\
                      .filter(Users.email == request.user_email)\
                      .first()
        
        if not new_user:
            raise HTTPException(status_code=404, 
                                detail=f'User with email: {request.user_email} not found')
        new_role_id = db.query(ProjectRoles)\
                        .filter(ProjectRoles.name == request.role).first()
        
        if not new_role_id:
            raise HTTPException(status_code=404, 
                                detail=f'Role: {request.role} not found')
        new_role_id = new_role_id.id

        user_project_model = ProjectUsers(project_id=project_data.id,
                                                user_id=new_user.id,
                                                role_id=new_role_id)
        
        # Add to database
        db.add(user_project_model)
        db.commit()

        return {"message": "User added"}

    raise HTTPException(status_code=401, detail = 'Unauthorized :(')
