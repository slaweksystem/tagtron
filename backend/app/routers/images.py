from typing import Annotated
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, Path
from ..models import Base
from ..models import Projects
from ..models import Images
from ..database import engine, SessionLocal
from .auth import get_current_user
from ..routers import auth

from fastapi import APIRouter