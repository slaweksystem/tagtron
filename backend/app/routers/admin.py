from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext

from ..models import Base
from ..models import Users, Roles
from ..database import get_db
from .auth import get_current_user
from ..database import engine

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

Base.metadata.create_all(bind=engine)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class ResetPasswordRequest(BaseModel):
    username: str
    new_password: str

def is_admin(user: Users, db: Session):
    """Check if the user has an admin role."""
    admin_role = db.query(Roles).filter(Roles.name == "Admin").first()
    return admin_role and user.role_id == admin_role.id

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    user: dict = Depends(get_current_user), 
    db: Session = Depends(get_db), 
    request: ResetPasswordRequest = Depends()
):
    """
    Allows an admin to reset another user's password.
    """
    user_data = db.query(Users).filter(Users.id == user["id"]).first()

    if not is_admin(user_data, db):
        raise HTTPException(status_code=403, detail="Only admins can reset passwords")

    user_to_update = db.query(Users).filter(Users.username == request.username).first()

    if not user_to_update:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_password = pwd_context.hash(request.new_password)
    user_to_update.hashed_password = hashed_password

    db.commit()

    return {"message": "Password reset successfully"}
