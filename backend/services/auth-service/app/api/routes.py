from fastapi import APIRouter, HTTPException, status
from app.models.user import UserSignup, UserLogin, TokenResponse

auth_router = APIRouter()

@auth_router.post("/signup", status_code=201)
def register_user(user: UserSignup):
    # Later: hash password & save to MongoDB
    return {"message": f"User {user.email} registered successfully!"}

@auth_router.post("/login", response_model=TokenResponse)
def login_user(user: UserLogin):
    # Later: verify credentials, return real JWT
    return TokenResponse(access_token="fake-jwt-token-for-now")
