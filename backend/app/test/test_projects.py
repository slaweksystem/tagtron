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

def test_add_users_to_project_email(test_user):
    # First Create a project
    payload_project = {
        "title": "Example project for Addig user",
        "description": "Add user with easy method"
    }
    response = client.post("/projects/", json=payload_project)
    project_id = response.json()['id']

    # Create user
    payload_user = {
                "username": "johnnytestaddproject",
                "email": "johnnytestaddproject@example.com",
                "first_name": "Johnny",
                "last_name": "test",
                "password": "test1234", 
              }
    response = client.post("/auth/", json = payload_user)
    user_id = response.json()["id"]
    print(f"Debug: id user:  {user_id}")
    # Test Add User
    payload_add_project = {
        "project_title": payload_project["title"],
        "user_email": payload_user["email"],
        "role": "Modder"
    }
    response = client.post("projects/users/email/", json = payload_add_project)
    # Test Creation
    assert response.status_code == 201
    
    
    # Test Invalid Role
    payload_add_project["Role"] = "Wrong_role"
    response = client.post("projects/users/email/", json = payload_add_project)
    assert response.status_code == 404

    # Test Wrong User
    payload_add_project["user_email"] = "Wrong@email"
    response = client.post("projects/users/email/", json = payload_add_project)
    assert response.status_code == 404

    # Test Wrong Project
    payload_add_project["project_title"] = "Wrong-Project"
    response = client.post("projects/users/email/", json = payload_add_project)
    assert response.status_code == 404

    # Cleanup - to be fixed later. Shouldn't be done in here, but gonna leave it for now
    client.delete(f"/projects/{project_id}")
    client.delete(f"/users/{user_id}")