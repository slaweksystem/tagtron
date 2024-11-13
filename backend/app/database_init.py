from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Roles

async def init_db():
    """Initializes the database with default data, like the default role."""
    db = SessionLocal()
    def add_role(role):
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
    
    add_role("User")
    add_role("Admin")