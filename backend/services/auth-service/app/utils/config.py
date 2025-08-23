# app/utils/config.py

from pymongo import MongoClient
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    MONGO_URI: str

    class Config:
        env_file = ".env"  # Automatically loads this file


# Create settings instance
settings = Settings()

# MongoDB connection using the URI from settings
client = MongoClient(settings.MONGO_URI)
db = client["snapdocs"]
user_collection = db["users"]
