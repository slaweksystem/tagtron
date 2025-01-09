from .database import Base
from sqlalchemy import Column, ForeignKey
from sqlalchemy import Integer, String, Boolean, DATETIME

class Roles(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role_id = Column(Integer, ForeignKey("roles.id"))

class Projects(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))

class Images(Base):
    __tablename__ = 'images'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    path = Column(String, unique=True)
    upload_date = Column(DATETIME)
    size_x = Column(Integer)
    size_y = Column(Integer)
    project_id = Column(Integer, ForeignKey("projects.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))

class Labels(Base):
    __tablename__ = 'labels'

    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.id"))
    label = Column(String)
    create_time = Column(DATETIME)
    position_x1 = Column(Integer)
    position_y1 = Column(Integer)
    position_x2 = Column(Integer)
    position_y2 = Column(Integer)
    owner_id = Column(Integer, ForeignKey("users.id"))

class ProjectUsers(Base):
    __tablename__ = 'project_users'

    id =  Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role_id = Column(Integer, ForeignKey("project_roles.id"))

class ProjectRoles(Base):
    __tablename__ = 'project_roles'

    id =  Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)