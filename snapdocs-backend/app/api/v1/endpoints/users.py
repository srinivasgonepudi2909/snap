from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.services.user_service import UserService
from app.schemas.user import UserPublic, UserUpdate
from app.middleware.auth import get_current_active_user
from app.models.user import User

router = APIRouter()

@router.get(
    "/profile",
    response_model=UserPublic,
    summary="Get User Profile",
    description="Get detailed profile information for the current user"
)
def get_user_profile(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user's profile information."""
    return UserPublic(
        id=current_user.id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        is_active=current_user.is_active,
        created_at=current_user.created_at
    )

@router.put(
    "/profile",
    response_model=UserPublic,
    summary="Update User Profile",
    description="Update current user's profile information"
)
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile information."""
    user_service = UserService(db)
    updated_user = user_service.update_user(current_user.id, user_update)
    
    return UserPublic(
        id=updated_user.id,
        email=updated_user.email,
        first_name=updated_user.first_name,
        last_name=updated_user.last_name,
        is_active=updated_user.is_active,
        created_at=updated_user.created_at
    )

@router.get(
    "/stats",
    summary="Get User Statistics",
    description="Get statistics about the current user"
)
def get_user_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user statistics."""
    user_service = UserService(db)
    
    return {
        "user_id": current_user.id,
        "account_created": current_user.created_at.isoformat(),
        "is_active": current_user.is_active,
        "total_users": user_service.get_user_count(),
        "active_users": user_service.get_active_user_count()
    }
