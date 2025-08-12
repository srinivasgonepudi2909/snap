import pytest
from fastapi.testclient import TestClient

def test_signup_success(client: TestClient):
    """Test successful user signup."""
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"

def test_login_success(client: TestClient):
    """Test successful user login."""
    # First signup
    client.post(
        "/api/v1/auth/signup",
        json={
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User", 
            "password": "testpassword123"
        }
    )
    
    # Then login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@example.com",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_invalid_login(client: TestClient):
    """Test login with invalid credentials."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
