from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Roles, ProjectRoles, Users, Projects

from .test.data import data_users, data_projects

def add_role(db: Session, role: str):
    try:
        # Check if the default role already exists
        if not db.query(Roles).filter(Roles.name == role).first():
            default_role = Roles(name=role)
            db.add(default_role)
            db.commit()
            #print(f"{role} role created.") - add logger
        else:
            pass
            #print(f"{role} role already exists.") add logger
    finally:
        db.close()

def add_project_role(db: Session, role: str):
    try:
        # Check if the default project role already exists
        if not db.query(ProjectRoles).filter(ProjectRoles.name == role).first():
            default_role = ProjectRoles(name=role)
            db.add(default_role)
            db.commit()
            #print(f"{role} role created.") - add logger
        else:
            pass
            #print(f"{role} role already exists.") add logger
    finally:
        db.close()

# Test Users
def add_users(db: Session):
    for test_user in data_users:
        user = db.query(Users).filter(Users.username == test_user.username).first()
        if not user:
            db.add(test_user)
            db.commit()

# Test Projects
def add_projects(db: Session):
    for test_project in data_projects:
        project = db.query(Projects).filter(Projects.title == test_project.title).first()
        if not project:
            db.add(test_project)
            db.commit()

async def init_db():
    """Initializes the database with default data, like the default role."""
    db = SessionLocal()
    # Add role
    add_role(db, "User")
    add_role(db, "Admin")
    add_project_role(db, "Owner")
    add_project_role(db, "User")
    add_project_role(db, "Modder")
    add_users(db)
    add_projects(db)


    