from .utils import client, override_get_db, override_get_current_user
from .utils import *
from ..routers.users import get_db, get_current_user
from fastapi import status

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

# Test for creating a project
def test_create_project():
    response = client.post("/projects/", json={
        "title": "Test Project",
        "description": "A test project"
    })
    print(f"Debug : response {response}")
    assert response.status_code == 201
    print(f"Debug : response {response.json()}")
    assert response.json()["title"] == "Test Project"

# Test for deleting a project
def test_delete_project():
    # First, create a project to delete
    response = client.post("/projects/", json={
        "title": "Delete Project",
        "description": "Project to delete"
    })
    project_id = response.json()["id"]
    response = client.delete(f"/projects/{project_id}")
    assert response.status_code == 204

# Test for adding a user to a project
def test_add_user_to_project():
    response = client.post("/projects/users", json={
        "user_id": 1,
        "project_id": 1,
        "role_id": 1
    })
    assert response.status_code == 201
    assert response.json()["message"] == "User added to project"

# Test for removing a user from a project
def test_remove_user_from_project():
    # First, add a user to a project
    response_add = client.post("/projects/users", json={
        "user_id": 1,
        "project_id": 1,
        "role_id": 1
    })
    id = response_add.json()['id']
    response = client.delete(f"/projects/users/delete_id/{id}")
    assert response.status_code == 204