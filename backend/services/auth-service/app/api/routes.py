from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserSignup, UserLogin, TokenResponse, User
from app.services.auth import get_current_user, verify_password
from app.services.jwt_handler import create_access_token
from app.utils.config import user_collection
import re

auth_router = APIRouter()

def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password according to policy:
    - Minimum 8 characters
    - At least one capital letter
    - At least one special character
    - At least one number
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one capital letter"
    
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', password):
        return False, "Password must contain at least one special character"
    
    return True, "Password is valid"

@auth_router.post("/signup", status_code=201)
def register_user(user: UserSignup):
    """
    Register a new user with duplicate prevention and password validation
    """
    print(f"🔍 Registration attempt for email: {user.email}, username: {user.username}")
    
    # Check if email already exists
    existing_email = user_collection.find_one({"email": user.email})
    if existing_email:
        print(f"❌ Email already exists: {user.email}")
        raise HTTPException(
            status_code=400, 
            detail="Email address is already registered. Please use a different email or try logging in."
        )
    
    # Check if username already exists
    existing_username = user_collection.find_one({"username": user.username})
    if existing_username:
        print(f"❌ Username already exists: {user.username}")
        raise HTTPException(
            status_code=400, 
            detail="Username is already taken. Please choose a different username."
        )
    
    # Validate password policy
    is_valid, password_message = validate_password(user.password)
    if not is_valid:
        print(f"❌ Password validation failed: {password_message}")
        raise HTTPException(
            status_code=400,
            detail=password_message
        )
    
    # Create user if all validations pass
    try:
        from app.utils.hash import hash_password
        hashed_password = hash_password(user.password)
        
        user_data = {
            "username": user.username,
            "email": user.email,
            "password": hashed_password,
            "created_at": "2024-01-01T00:00:00Z",
            "is_active": True
        }
        
        result = user_collection.insert_one(user_data)
        print(f"✅ User created successfully with ID: {result.inserted_id}")
        
        return {
            "success": True,
            "message": f"Account created successfully! Welcome to SnapDocs, {user.username}. You can now login with your credentials.",
            "user": {
                "username": user.username,
                "email": user.email
            }
        }
        
    except Exception as e:
        print(f"❌ Database error during user creation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create account due to server error. Please try again later."
        )

@auth_router.post("/login")
def login_user(user_credentials: UserLogin):
    print("✅ Login request received")
    print("➡️ Credentials:", user_credentials.dict())

    user = user_collection.find_one({"email": user_credentials.email})
    print("🔍 User from DB:", user)

    if not user:
        print("❌ User not found")
        raise HTTPException(
            status_code=401, 
            detail="No account found with this email address. Please check your email or sign up for a new account."
        )

    if not verify_password(user_credentials.password, user.get("password", "")):
        print("❌ Invalid password")
        raise HTTPException(
            status_code=401, 
            detail="Incorrect password. Please check your password and try again."
        )

    token = create_access_token({"sub": user["email"]})
    print("✅ Token generated")

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.get("username", "User"),
        "message": f"Welcome back, {user.get('username', 'User')}!"
    }

@auth_router.get("/dashboard")
def get_dashboard(current_user: str = Depends(get_current_user)):
    return {"message": f"Welcome back, {current_user}!"}

@auth_router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@auth_router.get("/health/mongo")
def check_mongo_connection():
    try:
        user_collection.database.command("ping")
        return {"status": "ok", "message": "MongoDB is connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB connection failed: {str(e)}")

# New endpoint to check username availability
@auth_router.get("/check-username/{username}")
def check_username_availability(username: str):
    if len(username) < 3:
        return {
            "available": False,
            "message": "Username must be at least 3 characters long"
        }
    
    existing_user = user_collection.find_one({"username": username})
    
    if existing_user:
        return {
            "available": False,
            "message": "Username is already taken"
        }
    
    return {
        "available": True,
        "message": "Username is available"
    }

# New endpoint to check email availability
@auth_router.get("/check-email/{email}")
def check_email_availability(email: str):
    existing_user = user_collection.find_one({"email": email})
    
    if existing_user:
        return {
            "available": False,
            "message": "Email address is already registered"
        }
    
    return {
        "available": True,
        "message": "Email is available"
    }