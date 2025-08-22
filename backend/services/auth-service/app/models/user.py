from pydantic import BaseModel, EmailStr, Field
from typing import Optional


# Main user model used in responses and token decoding
class User(BaseModel):
    id: Optional[str] = Field(alias="_id")  # Accept MongoDB ObjectId as string
    email: EmailStr

    class Config:
        allow_population_by_field_name = True  # Let you use 'id' in your code


# Used for user signup requests
class UserSignup(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)


# Used for user login requests
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Used for token response after login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
