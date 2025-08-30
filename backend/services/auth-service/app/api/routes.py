# backend/services/auth-service/app/api/routes.py - COMPLETE FIX FOR SIGNUP

from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserSignup, UserLogin, TokenResponse, User
from app.services.auth import get_current_user, verify_password
from app.services.jwt_handler import create_access_token
from app.utils.config import user_collection
import re
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_router = APIRouter()

# Enhanced password policy validation
def validate_password_policy(password: str) -> dict:
    """
    Validate password against policy requirements
    Returns dict with validation results
    """
    validation_result = {
        "is_valid": True,
        "errors": [],
        "requirements_met": {
            "min_length": len(password) >= 8,
            "has_uppercase": bool(re.search(r'[A-Z]', password)),
            "has_lowercase": bool(re.search(r'[a-z]', password)),
            "has_number": bool(re.search(r'\d', password)),
            "has_special": bool(re.search(r'[!@#$%^&*(),.?":{}|<>]', password))
        }
    }
    
    # Check each requirement
    if not validation_result["requirements_met"]["min_length"]:
        validation_result["errors"].append("Password must be at least 8 characters long")
    
    if not validation_result["requirements_met"]["has_uppercase"]:
        validation_result["errors"].append("Password must contain at least one uppercase letter")
        
    if not validation_result["requirements_met"]["has_lowercase"]:
        validation_result["errors"].append("Password must contain at least one lowercase letter")
    
    if not validation_result["requirements_met"]["has_number"]:
        validation_result["errors"].append("Password must contain at least one number")
    
    if not validation_result["requirements_met"]["has_special"]:
        validation_result["errors"].append("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)")
    
    validation_result["is_valid"] = len(validation_result["errors"]) == 0
    
    return validation_result

@auth_router.post("/signup", status_code=201)
def register_user(user: UserSignup):
    """
    FIXED: Enhanced signup endpoint with comprehensive error handling
    """
    logger.info(f"🚀 Signup request received for: {user.email}")
    logger.info(f"📋 User data: username={user.username}, email={user.email}")
    
    try:
        # Step 1: Validate input data exists
        if not user.email or not user.username or not user.password or not user.confirm_password:
            logger.error("❌ Missing required fields")
            raise HTTPException(
                status_code=400,
                detail={
                    "type": "validation_error",
                    "message": "All required fields must be provided",
                    "field": "required_fields"
                }
            )
        
        # Step 2: Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, user.email):
            logger.error(f"❌ Invalid email format: {user.email}")
            raise HTTPException(
                status_code=400,
                detail={
                    "type": "validation_error",
                    "message": "Invalid email format",
                    "field": "email"
                }
            )
        
        # Step 3: Check if email already exists
        existing_email = user_collection.find_one({"email": user.email.lower()})
        if existing_email:
            logger.error(f"❌ Email already exists: {user.email}")
            raise HTTPException(
                status_code=400, 
                detail={
                    "type": "email_exists",
                    "message": "Email already registered",
                    "field": "email"
                }
            )
        
        # Step 4: Check if username already exists
        existing_username = user_collection.find_one({"username": user.username.strip()})
        if existing_username:
            logger.error(f"❌ Username already exists: {user.username}")
            raise HTTPException(
                status_code=400,
                detail={
                    "type": "username_exists", 
                    "message": "Username already taken",
                    "field": "username"
                }
            )
        
        # Step 5: Validate username format
        if len(user.username.strip()) < 3:
            logger.error(f"❌ Username too short: {user.username}")
            raise HTTPException(
                status_code=400,
                detail={
                    "type": "validation_error",
                    "message": "Username must be at least 3 characters long",
                    "field": "username"
                }
            )
        
        # Step 6: Validate password match - CRITICAL FIX
        if user.password != user.confirm_password:
            logger.error("❌ Passwords do not match")
            raise HTTPException(
                status_code=400,
                detail={
                    "type": "password_mismatch",
                    "message": "Passwords do not match",
                    "field": "confirm_password"
                }
            )
        
        # Step 7: Validate password policy
        password_validation = validate_password_policy(user.password)
        if not password_validation["is_valid"]:
            logger.error(f"❌ Password policy validation failed: {password_validation['errors']}")
            raise HTTPException(
                status_code=400,
                detail={
                    "type": "password_policy",
                    "message": "Password does not meet security requirements",
                    "field": "password",
                    "errors": password_validation["errors"],
                    "requirements": password_validation["requirements_met"]
                }
            )
        
        # Step 8: Hash password and create user
        from app.utils.hash import hash_password
        hashed = hash_password(user.password)
        
        user_data = {
            "username": user.username.strip(),
            "email": user.email.lower().strip(),
            "password": hashed,
            "created_at": "2024-12-26T10:00:00Z",
            "is_active": True
        }
        
        # Step 9: Insert user into database
        result = user_collection.insert_one(user_data)
        logger.info(f"✅ User created successfully with ID: {result.inserted_id}")
        
        return {
            "success": True,
            "message": f"User {user.email} registered successfully!",
            "data": {
                "username": user.username,
                "email": user.email,
                "user_id": str(result.inserted_id)
            }
        }
        
    except HTTPException:
        # Re-raise HTTPException as-is
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error creating user: {str(e)}")
        logger.error(f"❌ Error type: {type(e)}")
        import traceback
        logger.error(f"❌ Traceback: {traceback.format_exc()}")
        
        raise HTTPException(
            status_code=500,
            detail={
                "type": "server_error",
                "message": "An unexpected error occurred while creating your account",
                "error": "Internal server error"  # Don't expose internal error details
            }
        )

# Add password policy check endpoint
@auth_router.post("/check-password-policy")
def check_password_policy(data: dict):
    """
    Check password against policy without creating account
    """
    password = data.get("password", "")
    
    if not password:
        raise HTTPException(
            status_code=400,
            detail={
                "type": "validation_error",
                "message": "Password is required"
            }
        )
    
    validation_result = validate_password_policy(password)
    
    return {
        "success": True,
        "data": validation_result
    }

# Add availability check endpoints
@auth_router.post("/check-email-availability")
def check_email_availability(data: dict):
    """
    Check if email is available for registration
    """
    email = data.get("email", "").lower().strip()
    
    if not email:
        raise HTTPException(
            status_code=400,
            detail={
                "type": "validation_error", 
                "message": "Email is required"
            }
        )
    
    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return {
            "success": True,
            "data": {
                "email": email,
                "is_available": False,
                "message": "Invalid email format"
            }
        }
    
    try:
        existing_email = user_collection.find_one({"email": email})
        is_available = existing_email is None
        
        return {
            "success": True,
            "data": {
                "email": email,
                "is_available": is_available,
                "message": "Email is available" if is_available else "Email is already registered"
            }
        }
    except Exception as e:
        logger.error(f"❌ Error checking email availability: {str(e)}")
        return {
            "success": True,
            "data": {
                "email": email,
                "is_available": False,
                "message": "Error checking email availability"
            }
        }

@auth_router.post("/check-username-availability") 
def check_username_availability(data: dict):
    """
    Check if username is available for registration
    """
    username = data.get("username", "").strip()
    
    if not username:
        raise HTTPException(
            status_code=400,
            detail={
                "type": "validation_error",
                "message": "Username is required" 
            }
        )
    
    if len(username) < 3:
        return {
            "success": True,
            "data": {
                "username": username,
                "is_available": False,
                "message": "Username must be at least 3 characters long"
            }
        }
    
    try:
        existing_username = user_collection.find_one({"username": username})
        is_available = existing_username is None
        
        return {
            "success": True,
            "data": {
                "username": username,
                "is_available": is_available,
                "message": "Username is available" if is_available else "Username is already taken"
            }
        }
    except Exception as e:
        logger.error(f"❌ Error checking username availability: {str(e)}")
        return {
            "success": True,
            "data": {
                "username": username,
                "is_available": False,
                "message": "Error checking username availability"
            }
        }

@auth_router.post("/login")
def login_user(user_credentials: UserLogin):
    """
    Enhanced login endpoint with better error handling
    """
    logger.info(f"✅ Login request received for: {user_credentials.email}")

    try:
        user = user_collection.find_one({"email": user_credentials.email.lower()})
        logger.info(f"🔍 User found in DB: {user is not None}")

        if not user:
            logger.error("❌ User not found")
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not verify_password(user_credentials.password, user.get("password", "")):
            logger.error("❌ Invalid password")
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token({"sub": user["email"]})
        logger.info("✅ Token generated successfully")

        return {
            "access_token": token,
            "token_type": "bearer",
            "username": user.get("username", "User")
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Login error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during login"
        )

@auth_router.get("/dashboard")
def get_dashboard(current_user: str = Depends(get_current_user)):
    """
    Dashboard endpoint
    """
    return {"message": f"Welcome back, {current_user}!"}

@auth_router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user info
    """
    return current_user

@auth_router.get("/health/mongo")
def check_mongo_connection():
    """
    Check MongoDB connection health
    """
    try:
        user_collection.database.command("ping")
        return {"status": "ok", "message": "MongoDB is connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB connection failed: {str(e)}")