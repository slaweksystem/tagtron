from typing import Annotated
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, Path , Query
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
async def read_all(
    user: user_dependency,
    db: db_dependency,
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1)
):
    """
    Read all projects with pagination.
    - `offset`: Number of items to skip (default: 0)
    - `limit`: Maximum number of items to return (default: 10)
    """

    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    user_data : Users = db.query(Users).filter(Users.id == user["id"]).first()
    
    # Check if user is an Admin
    admin_role = db.query(Roles).filter(Roles.name == "Admin").first()
    user_projects_query = db.query(ProjectUsers).filter(ProjectUsers.user_id == user["id"])

    print("debug:",admin_role.id)
    print("debug:",user_data.role_id)

    if admin_role and user_data.role_id == admin_role.id:
        # Admin can view all projects
        projects = db.query(Projects).offset(offset).limit(limit).all()
    else:
        # Regular users can only see assigned projects
        assigned_project_ids = user_projects_query.with_entities(ProjectUsers.project_id).all()
        projects = db.query(Projects).filter(Projects.id.in_([p[0] for p in assigned_project_ids])).offset(offset).limit(limit).all()

    return projects
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_project(user: user_dependency,
                         db: db_dependency, 
                         project_request: ProjectRequest):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    project = Projects(**project_request.model_dump(), owner_id=user.get('id'))

    db.add(project)
    db.commit()

    owner_id = db.query(ProjectRoles).filter(ProjectRoles.name == "Owner").first().id

    project_user = ProjectUsers(
    project_id=project.id,
    user_id=user["id"],
    role_id = owner_id
    )



    db.add(project_user)
    db.commit()

    return {"id": project.id, "title": project.title}

# Delete a project
@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, 
                         db: Session = Depends(get_db)):
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
    
    # Ensure user is authenticated
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')

     # Check if the user is assigned to the project
    is_assigned = (
        db.query(ProjectUsers)
        .filter(ProjectUsers.project_id == project_id, ProjectUsers.user_id == user['id'])
        .first()
    )

    is_owner = (
        db.query(Projects.id == project_id, Projects.owner_id == user['id'])
    )

    is_admin = (
        db.query(Users.id == user['id'], Users.role_id == 2)
                )

    if not is_assigned and not is_owner and not is_admin:
        raise HTTPException(status_code=403, detail="You are not allowed to view this project")
    
    # Fetch users assigned to the project
    project_users = (
        db.query(ProjectUsers, Users, ProjectRoles.name)
        .join(Users, ProjectUsers.user_id == Users.id)
        .join(ProjectRoles, ProjectUsers.role_id == ProjectRoles.id)
        .filter(ProjectUsers.project_id == project_id)
        .all()
    )

    users_list = [
        {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role_id": project_user.role_id,
            "role": role_name,
            "project_user_id": project_user.id,
        }
        for project_user, user, role_name in project_users
    ]

    return JSONResponse(
        content={"users": users_list, "message": ""}, status_code=200
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

@router.get("/check_role/{project_id}", status_code=status.HTTP_200_OK)
async def get_role(user: user_dependency,
                    db: db_dependency,
                    project_id: int = Path(gt=0)):
    
    # Ensure user is authenticated
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')

     # Check if the user is assigned to the project
    is_assigned = (
        db.query(ProjectUsers)
        .filter(ProjectUsers.project_id == project_id, ProjectUsers.user_id == user['id'])
        .first()
    )

    is_owner = (
        db.query(Projects.id == project_id, Projects.owner_id == user['id'])
    )

    is_admin = (
        db.query(Users.id == user['id'], Users.role_id == 2)
                )

    if not is_assigned and not is_owner and not is_admin:
        raise HTTPException(status_code=403, detail="You are not allowed to view this project")
    
    # Fetch users assigned to the project
    user_role_id = db.query(ProjectUsers).filter(ProjectUsers.user_id == user['id']).first().role_id
    project_role = (db.query(ProjectRoles).filter(ProjectRoles.id == user_role_id).first()).name


    return JSONResponse(
        content={"role": project_role, "message": ""}, status_code=200
    )
