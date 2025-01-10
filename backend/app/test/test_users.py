import pytest
from .utils import client, override_get_db, override_get_current_user
from .utils import *
from ..routers.users import get_db, get_current_user
from fastapi import status

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

def test_return_user(test_users):
    response = client.get("/user")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['username'] == 'johnny'
    assert response.json()['email'] == 'johnnybravo@example.com'
    assert response.json()['first_name'] == "Johnny"
    assert response.json()['last_name'] == "Bravo"
    assert response.json()['role'] == "Admin"

def test_add_user(test_users):
    payload = {
                "username": "johnnytestpass",
                "email": "johnnybravotestpass@example.com",
                "first_name": "Johnny",
                "last_name": "Bravo",
                "password": "1ubiepl@cki",
              }
    # Add User
    response = client.post("/auth/", json = payload)
    assert response.status_code == status.HTTP_201_CREATED
    response = client.delete(f"/user/{payload["username"]}")
    assert response.status_code == status.HTTP_204_NO_CONTENT

def test_change_password_success():
    payload = {
                "username": "johnnytestpasschange",
                "email": "johnnybravotestchange@example.com",
                "first_name": "Johnny",
                "last_name": "Bravo",
                "password": "1ubiepl@cki", 
              }
    # Add User
    response = client.post("/auth/", json = payload)
    response = client.put("/user/password", json={"password": "1ubiepl@cki",
                                                  "new_password": "nielubiep!@ck0w"})
    assert response.status_code == status.HTTP_204_NO_CONTENT
    client.delete("/user/johnnytestpasschange")

def test_change_password_invalid_current_password():
    response = client.put("/user/password", json={"password": "wrong_password",
                                                  "new_password": "newpassword"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Error on password change'}