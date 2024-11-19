from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, Path, status, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Users
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from .auth import get_current_user

router = APIRouter(
    prefix='/user',
    tags=['user']
)

class ChangePassword(BaseModel):
    password: str
    new_password: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated = 'auto')

@router.get("/", status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    user_info = db.query(Users).filter(Users.id == user.get('id')).first()
    print(f"Hell :{dir(user_info)}")
    user_info.role = user.get('username')
    print(f"Role :{user.get('username')}")
    #print(f"Role :{user.role_id}")
    return db.query(Users).filter(Users.id == user.get('id')).first()

@router.put("/password", status_code=status.HTTP_204_NO_CONTENT)
async def update_password(user: user_dependency,
                          user_new_password: ChangePassword,
                          db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    user_data = db.query(Users).filter(Users.id == user.get('id')).first()

    if not bcrypt_context.verify(user_new_password.password, user_data.hashed_password):
        raise HTTPException(status_code=401, detail='Error on password change')
    user_data.hashed_password = bcrypt_context.hash(user_new_password.password)

    db.add(user_data)
    db.commit()