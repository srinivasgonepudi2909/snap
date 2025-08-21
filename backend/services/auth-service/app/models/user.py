from pydantic import BaseModel, EmailStr, Field
from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class User(BaseModel):
    id: Optional[UUID] = None
    email: EmailStr


class UserSignup(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
