import pytest

from sqlalchemy import create_engine, StaticPool, text
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from fastapi.testclient import TestClient

from ..main import app
from ..database import Base
from ..database_init import add_role
from ..models import Projects, Users
from ..routers.auth import bcrypt_context

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
    try:
        yield db
    finally:
        db.close

def override_get_current_user():
    return {'username': 'johnny', 'id': 1, 'user_role': 'Admin'}

client = TestClient(app)

@pytest.fixture
def test_Projects():
    project = Projects(
        title="First Sample Project",
        description="This is a test project designed for testing purposes",
        owner_id=1
    )

    db = TestingSessionLocal()
    db.add(project)
    db.commit()
    yield project
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM tagtron_projects;"))
        connection.commit()

@pytest.fixture
def test_user():
    user = Users(
        username="johnny",
        email="johnnybravo@example.com",
        first_name="Johnny",
        last_name="Bravo",
        hashed_password=bcrypt_context.hash("1ubiepl@cki"),
        role_id="1",
    )
    db = TestingSessionLocal()
    db.add(user)
    db.commit()
    yield user
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM tagtron_users;"))
        connection.commit()