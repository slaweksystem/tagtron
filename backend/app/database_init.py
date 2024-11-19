from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Roles

def add_role(db: Session,role: str):
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

async def init_db():
    """Initializes the database with default data, like the default role."""
    db = SessionLocal()
    add_role(db, "User")
    add_role(db, "Admin")
