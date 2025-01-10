import pytest

from sqlalchemy import create_engine, StaticPool, text
#from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from fastapi.testclient import TestClient

from ..main import app
from ..database import Base
from ..database_init import add_project_role, add_role
from ..models import Projects, Users
from ..routers.auth import bcrypt_context

from .data import data_users
from .data import data_projects

SQLALCHEMY_DATABASE_URL = "sqlite:///./testdb.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass = StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    # Add Roles
    add_role(db, "Admin")
    add_role(db, "User")
    add_project_role(db, "Owner")
    add_project_role(db, "User")
    add_project_role(db, "Modder")
    try:
        yield db
    finally:
        db.close

def override_get_current_user():
    return {'username': 'johnny', 'id': 1, 'user_role': 'Admin'}

client = TestClient(app)

@pytest.fixture
def test_projects():
    db = TestingSessionLocal()
    for project in data_projects:
        db.add(project)
    db.commit()

    yield project[0]
    #with engine.connect() as connection:
    #    connection.execute(text("DELETE FROM projects;"))
    #    connection.commit()

@pytest.fixture
def test_users():
    db = TestingSessionLocal()
    # Add Users
    for test_user in data_users[0:1]:
        user = db.query(Users).filter(Users.username == test_user.username).first()
        print(f'Debug: {user}')
        if not user:
            db.add(test_user)
        db.commit()

    

    yield data_users[0]
    #with engine.connect() as connection:
    #    connection.execute(text("DELETE FROM users;"))
    #    connection.commit()

@pytest.fixture
def test_user():
    db = TestingSessionLocal()
    # Add Users
    user = db.query(Users).filter(Users.username == data_users[0].username).first()
    if not user:
        db.add(data_users[0])
        db.commit()

    yield data_users[0]
    #with engine.connect() as connection:
    #    connection.execute(text("DELETE FROM users;"))
    #    connection.commit()