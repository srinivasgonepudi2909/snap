from app.utils.config import user_collection
from app.utils.hash import hash_password, verify_password
from app.services.jwt_handler import create_access_token
from app.models.user import UserSignup, UserLogin
from fastapi import HTTPException, status
from fastapi import Depends
from app.services.jwt_handler import decode_access_token, oauth2_scheme

def signup_user(user: UserSignup):
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed

    user_collection.insert_one(user_dict)
    return {"message": "User registered successfully"}

def login_user(user: UserLogin):
    found = user_collection.find_one({"email": user.email})
    if not found:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, found["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    return decode_access_token(token)
