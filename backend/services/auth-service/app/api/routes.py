from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserSignup, UserLogin, TokenResponse, User
from app.services.auth import get_current_user, verify_password
from app.services.jwt_handler import create_access_token
from app.utils.config import user_collection

auth_router = APIRouter()


@auth_router.post("/signup", status_code=201)
def register_user(user: UserSignup):
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    from app.utils.hash import hash_password
    hashed = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed
    user_collection.insert_one(user_dict)

    return {"message": f"User {user.email} registered successfully!"}


@auth_router.post("/login", response_model=TokenResponse)
def login_user(user_credentials: UserLogin):
    # 🔍 Debugging prints
    print("✅ Login request received")
    print("➡️ Credentials:", user_credentials.dict())

    user = user_collection.find_one({"email": user_credentials.email})
    print("🔍 User from DB:", user)

    if not user:
        print("❌ User not found")
        raise HTTPException(status_code=401, detail="User not found")

    if not verify_password(user_credentials.password, user.get("password", "")):
        print("❌ Invalid password")
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_access_token({"sub": user["email"]})
    print("✅ Token generated")

    return {"access_token": token, "token_type": "bearer"}


@auth_router.get("/dashboard")
def get_dashboard(current_user: str = Depends(get_current_user)):
    return {"message": f"Welcome back, {current_user}!"}


@auth_router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@auth_router.get("/health/mongo")
def check_mongo_connection():
    try:
        # This pings the MongoDB server
        user_collection.database.command("ping")
        return {"status": "ok", "message": "MongoDB is connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MongoDB connection failed: {str(e)}")