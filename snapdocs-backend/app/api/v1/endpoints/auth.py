from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import (
    UserSignup, 
    UserLogin, 
    UserSignupResponse, 
    UserLoginResponse
)
from app.schemas.user import UserPublic
from app.middleware.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.post(
    "/signup", 
    response_model=UserSignupResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="User Registration",
    description="Register a new user account with email, name, and password"
)
def signup(
    user_data: UserSignup, 
    db: Session = Depends(get_db)
):
    """
    Create a new user account.
    
    **Required fields:**
    - **email**: Must be a valid email address and unique
    - **first_name**: User's first name (1-50 characters)
    - **last_name**: User's last name (1-50 characters)  
    - **password**: Minimum 8 characters
    
    **Optional fields:**
    - **phone_number**: User's phone number
    - **country_code**: Country code for phone number (e.g., +1, +91)
    
    **Returns:**
    - User information
    - JWT access token for immediate login
    - Token expiration time
    """
    try:
        auth_service = AuthService(db)
        result = auth_service.signup_user(user_data)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post(
    "/login", 
    response_model=UserLoginResponse,
    summary="User Login",
    description="Authenticate user with email and password"
)
def login(
    login_data: UserLogin, 
    db: Session = Depends(get_db)
):
    """
    Authenticate user and return access token.
    
    **Required fields:**
    - **email**: User's registered email address
    - **password**: User's password
    
    **Returns:**
    - JWT access token
    - User information
    - Token expiration time
    """
    try:
        auth_service = AuthService(db)
        result = auth_service.login_user(login_data)
        return result
    except Exception as e:
        # Re-raise HTTP exceptions
        if isinstance(e, HTTPException):
            raise e
        # Handle other exceptions
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get(
    "/me", 
    response_model=UserPublic,
    summary="Get Current User",
    description="Get current authenticated user information"
)
def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get information about the currently authenticated user.
    
    **Requires:**
    - Valid JWT token in Authorization header
    
    **Returns:**
    - Current user's profile information
    """
    return UserPublic(
        id=current_user.id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@router.post(
    "/test-signup", 
    status_code=status.HTTP_200_OK,
    summary="Test Signup Endpoint",
    description="Test endpoint to verify signup functionality"
)
def test_signup():
    """Test endpoint to verify signup route is working."""
    return {
        "message": "✅ Signup endpoint is working perfectly!",
        "endpoint": "/api/v1/auth/signup",
        "method": "POST",
        "required_fields": [
            "email",
            "first_name", 
            "last_name",
            "password"
        ],
        "optional_fields": [
            "phone_number",
            "country_code"
        ],
        "example": {
            "email": "user@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "phone_number": "9876543210",
            "country_code": "+91",
            "password": "securepassword123"
        }
    }

@router.post(
    "/test-login", 
    status_code=status.HTTP_200_OK,
    summary="Test Login Endpoint",
    description="Test endpoint to verify login functionality"
)
def test_login():
    """Test endpoint to verify login route is working."""
    return {
        "message": "✅ Login endpoint is working perfectly!",
        "endpoint": "/api/v1/auth/login",
        "method": "POST",
        "required_fields": [
            "email",
            "password"
        ],
        "example": {
            "email": "user@example.com",
            "password": "securepassword123"
        }
    }
