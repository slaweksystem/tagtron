from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session

from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError

from ..database import SessionLocal
from ..models import Users, Roles

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

# extremly unique string
SECRET_KEY = 'a6fdgyr5er5ryu645rye3ty5y45es776574567srty456r7y4r67y6u56ueu56uyue54w45o'
ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated = 'auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl = 'auth/token')

class CreateUserRequest(BaseModel):
    username: str
    email: str
    first_name: str
    last_name: str
    password: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "username": "johnny",
                "email": "johnnybravo@example.com",
                "first_name": "Johnny",
                "last_name": "Bravo",
                "password": "1ubiepl@cki",
            }
        }
    }

class ChangePassword(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def authenticate_user(username: str, password: str, db: Session):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    print(f"founmd User {username}")
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(username: str, user_id: int, role: str, expires_delta: timedelta): 
    encode = {'sub': username, 'id': user_id, 'role': role}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        user_role: str = payload.get('role')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user.')
        return {'username': username, 'id': user_id, 'user_role': user_role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
user_dependency = Annotated[dict, Depends(get_current_user)]

    
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency,
                      create_user_request: CreateUserRequest):
    # fetch default role
    role_id = db.query(Roles).filter(Roles.name == "User").first().id

    print("Here OK, {}")
    create_user_model = Users(
        username = create_user_request.username,
        email = create_user_request.email,
        first_name = create_user_request.first_name,
        last_name = create_user_request.last_name,
        hashed_password = bcrypt_context.hash(create_user_request.password),
        role_id = role_id,
        is_active = True
        )

    db.add(create_user_model)
    db.commit()

@router.put("/", status_code=status.HTTP_204_NO_CONTENT)
async def update_password(user: user_dependency,
                          user_new_password: ChangePassword,
                          db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    user_new_password
    
    user_data = db.query(Users).filter(Users.id == user.get('id')).first()

    user_data.hashed_password = bcrypt_context.hash(user_new_password.password)

    db.add(user_data)
    db.commit()
    
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                  db: db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        return 'Failed Authentication'
    
    role = "User"
    token =  create_access_token(user.username, user.id, role, timedelta(minutes=20))

    return {'access_token': token, 'token_type': 'bearer'}
