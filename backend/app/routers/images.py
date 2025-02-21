from typing import Annotated
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, Path
from fastapi import File, UploadFile
from fastapi.responses import FileResponse

import shutil
from pathlib import Path as OSPath
import uuid
from datetime import datetime
from PIL import Image


from ..models import Base
from ..models import Roles
from ..models import Projects
from ..models import ProjectRoles
from ..models import ProjectUsers
from ..models import Images
from ..models import Labels
from ..models import Users
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
UPLOAD_DIR = OSPath("media/images")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class LabelRequest(BaseModel):
    label : str
    position_x1 : int
    position_y1 : int
    position_x2 : int
    position_y2 : int

def is_admin_or_project_member(user: user_dependency,
                               db: db_dependency,
                               project_id):
    """
    Check if the user is an admin or a member of the project.
    """
    admin_role = db.query(Roles).filter(Roles.name == "Admin").first()
    user_data : Users = db.query(Users).filter(Users.id == user["id"]).first()
    is_admin = admin_role and user_data.role_id == admin_role.id

    is_project_member = db.query(ProjectUsers).filter(
        ProjectUsers.project_id == project_id,
        ProjectUsers.user_id == user["id"]
    ).first()

    return is_admin or is_project_member

def is_owner_or_moderator(user: user_dependency,
                          db: db_dependency,
                          project_id):
    """
    Check if the user has the role of 'Owner' or 'Moderator' in the given project.
    """
    # Check if Admin
    admin_role = db.query(Roles).filter(Roles.name == "Admin").first()
    user_data : Users = db.query(Users).filter(Users.id == user["id"]).first()
    is_admin = admin_role and user_data.role_id == admin_role.id

    if is_admin:
        return True

    # Check if project role matches
    project_role = db.query(ProjectUsers).filter(
        ProjectUsers.project_id == project_id,
        ProjectUsers.user_id == user["id"]
    ).first()
    
    if not project_role:
        return False
    
    role = db.query(ProjectRoles).filter(ProjectRoles.id == project_role.role_id).first()
    
    return role and role.name in ["Owner", "Moderator"]

@router.get("/{project_id}", status_code=status.HTTP_200_OK)
async def read_project_images(user: user_dependency, db: db_dependency, project_id:int = Path(gt=0)):

    if not is_admin_or_project_member(user, db, project_id):
        raise HTTPException(status_code=403, detail="Not authorized to add labels to this project")

    return db.query(Images).filter(Images.project_id == project_id).all()

@router.post("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def add_image(user: user_dependency, 
                    db: db_dependency, 
                    file: UploadFile = File(...),
                    project_id:int = Path(gt=0)):
    
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')
    
    if not is_admin_or_project_member(user, db, project_id):
        raise HTTPException(status_code=403, detail="Not authorized to add labels to this project")
    
    # Generate a unique filename using UUID
    unique_filename = f"{uuid.uuid4()}.jpg"
    file_path = UPLOAD_DIR / unique_filename

    # Save the file to the designated directory
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

        # Get image details using Pillow
    with Image.open(file_path) as img:
        size_x, size_y = img.size  # Extract width and height

    # Create a new image entry in the database
    new_image = Images(
        name=file.filename,
        path=str(file_path),
        upload_date=datetime.utcnow(),
        size_x=size_x,
        size_y=size_y,
        project_id=project_id,
        owner_id=user["id"]
    )

    db.add(new_image)
    db.commit()

    return {"id": new_image.id, "filename": unique_filename, "path": new_image.path}

@router.get("/view/{image_id}", status_code=status.HTTP_200_OK)
async def view_image(
    user: user_dependency,
    db: db_dependency,
    image_id: int = Path(gt=0)
):
    if user is None:
        raise HTTPException(status_code=401, detail='Authentication Failed')

    # Pobierz szczegóły obrazu z bazy danych
    image = db.query(Images).filter(Images.id == image_id).first()

    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    if not is_admin_or_project_member(user, db, image.project_id):
        raise HTTPException(status_code=403, detail="Not authorized to add labels to this project")

    # Ścieżka do pliku
    file_path = OSPath(image.path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    # Zwróć plik jako odpowiedź
    return FileResponse(path=str(file_path), media_type="image/jpeg", filename=image.name)

@router.delete("/{project_id}/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_image(user: user_dependency, db: db_dependency, 
                       project_id:int = Path(gt=0),
                       image_id:int = Path()):
    pass

@router.delete("/delete/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    user: user_dependency, db: db_dependency, image_id: int = Path(gt=0)
):
    """
    Deletes an image and all associated labels if the user is an admin or the image owner.
    """
    image = db.query(Images).filter(Images.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    if not is_admin_or_project_member(user, db, image.project_id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this image")
    
    # Delete associated labels
    db.query(Labels).filter(Labels.image_id == image_id).delete()
    
    # Delete the image file from the storage
    file_path = OSPath(image.path)
    if file_path.exists():
        file_path.unlink()
    
    # Delete the image record from the database
    db.delete(image)
    db.commit()
    
    return {"message": "Image and related labels deleted successfully"}

@router.post("/multi-add/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def add_mnultiple_images(user: user_dependency, db: db_dependency, project_id:int = Path(gt=0)):
    pass

@router.get("/labels/{image_id}", status_code=status.HTTP_200_OK)
async def read_labels(user: user_dependency, db: db_dependency, image_id: int = Path(gt=0)):
    """
    Retrieve all labels for a given image if the user is an admin or belongs to the project.
    """
    image = db.query(Images).filter(Images.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    if not is_admin_or_project_member(user, db, image.project_id):
        raise HTTPException(status_code=403, detail="Not authorized to view labels for this project")

    labels = db.query(Labels).filter(Labels.image_id == image_id).all()
    return labels


@router.post("/labels/{image_id}", status_code=status.HTTP_201_CREATED)
async def save_label(user: user_dependency, db: db_dependency, 
                     label_request: LabelRequest, image_id: int = Path(gt=0)):
    """
    Save a new label associated with an image if the user is an admin or belongs to the project.
    """
    image = db.query(Images).filter(Images.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    if not is_admin_or_project_member(user, db, image.project_id):
        raise HTTPException(status_code=403, detail="Not authorized to add labels to this project")

    new_label = Labels(
        image_id=image_id,
        label=label_request.label,
        create_time=datetime.utcnow(),
        position_x1=label_request.position_x1,
        position_y1=label_request.position_y1,
        position_x2=label_request.position_x2,
        position_y2=label_request.position_y2,
        owner_id=user["id"]
    )

    db.add(new_label)
    db.commit()
    db.refresh(new_label)

    return {"message": "Label created successfully", "label_id": new_label.id}


@router.put("/labels/{image_id}/{label_id}", status_code=status.HTTP_200_OK)
async def update_label(user: user_dependency, db: db_dependency, 
                       label_request: LabelRequest, 
                       image_id: int = Path(gt=0),
                       label_id: int = Path(gt=0)):
    """
    Update an existing label for an image if the user is an admin, or the owner of the label.
    """
    label = db.query(Labels).filter(Labels.id == label_id, Labels.image_id == image_id).first()
    if not label:
        raise HTTPException(status_code=404, detail="Label not found")

    if not is_admin_or_project_member(user, db, label.image.project_id) and label.owner_id != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this label")

    label.label = label_request.label
    label.position_x1 = label_request.position_x1
    label.position_y1 = label_request.position_y1
    label.position_x2 = label_request.position_x2
    label.position_y2 = label_request.position_y2
    label.create_time = datetime.utcnow()

    db.commit()
    db.refresh(label)

    return {"message": "Label updated successfully", "label_id": label.id}

@router.delete("/labels/{image_id}/{label_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_label(user: user_dependency, db: db_dependency, 
                       image_id: int = Path(gt=0), 
                       label_id: int = Path(gt=0)):
    """
    Delete a label from an image if the user is an admin, or the owner of the label.
    """
    label = db.query(Labels).filter(Labels.id == label_id, Labels.image_id == image_id).first()
    if not label:
        raise HTTPException(status_code=404, detail="Label not found")
    
    image = db.query(Images).filter(Images.id == image_id).first()

    if not image:
        # Something is wrong - delete label
        db.delete(label)
        return {"message": "Label deleted successfully"}

    if not is_admin_or_project_member(user, db, image.project_id) and label.owner_id != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this label")

    db.delete(label)
    db.commit()
    
    return {"message": "Label deleted successfully"}

@router.get("/unlabeled-image/{project_id}", status_code=status.HTTP_200_OK)
async def get_unlabeled_image(
    project_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the ID of an unlabeled image for a given project.
    Checks if the user is an admin or assigned to the project.
    """
    if not is_admin_or_project_member(user, db, project_id):
        raise HTTPException(status_code=403, detail="Not authorized to add labels to this project")
    
    unlabeled_image = db.query(Images).outerjoin(Labels, Images.id == Labels.image_id)
    unlabeled_image = unlabeled_image.filter(Images.project_id == project_id, Labels.id == None).first()
    
    if not unlabeled_image:
        raise HTTPException(status_code=404, detail="No unlabeled images found for this project")
    
    return {"image_id": unlabeled_image.id}