import os
from dotenv import load_dotenv
from pymongo import MongoClient
# app/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "supersecretkey"  # Use env var in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

db = client["snapdocs-auth"]
user_collection = db["users"]
