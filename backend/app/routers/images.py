from typing import Annotated
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, Path
from fastapi import File, UploadFile

import shutil
from pathlib import Path as OSPath


from ..models import Base
from ..models import Projects
from ..models import Images
from ..models import Labels
from ..database import engine, SessionLocal
from .auth import get_current_user
from ..routers import auth

from fastapi import APIRouter

router = APIRouter(
    prefix='/images',
    tags=['images']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

# Directory to save uploaded images
UPLOAD_DIR = OSPath("media")
UPLOAD_DIR.mkdir(exist_ok=True)

class LabelRequest(BaseModel):
    label : str
    position_x1 : int
    position_y1 : int
    position_x2 : int
    position_y2 : int

@router.get("/{project_id}", status_code=status.HTTP_200_OK)
async def read_project_images(user: user_dependency, db: db_dependency, project_id:int = Path(gt=0)):
    return db.query(Images).filter(Images.project_id == project_id).all()

@router.post("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def add_image(user: user_dependency, db: db_dependency, 
                    file: UploadFile = File(),
                    project_id:int = Path(gt=0)):
    pass

@router.delete("/{project_id}/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_image(user: user_dependency, db: db_dependency, 
                       project_id:int = Path(gt=0),
                       image_id:int = Path()):
    pass

@router.post("/multi-add/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def add_mnultiple_images(user: user_dependency, db: db_dependency, project_id:int = Path(gt=0)):
    pass

@router.get("/labels/{image_id}", status_code=status.HTTP_200_OK)
async def read_labels(user: user_dependency, db: db_dependency,
                              image_id:int = Path(gt=0)):
    return db.query(Labels).filter(Labels.id == image_id).all()

@router.post("/labels/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def save_label(user: user_dependency, db: db_dependency,
                              label_request: LabelRequest,
                              image_id:int = Path(gt=0),
                              ):
    pass

@router.put("/labels/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_label(user: user_dependency, db: db_dependency,
                              label_request: LabelRequest,
                              image_id:int = Path(gt=0)):
    pass

@router.delete("/labels/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_label(user: user_dependency, db: db_dependency, image_id:int = Path(gt=0)):
    pass
