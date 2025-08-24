# app/api/routes.py

from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict
from app.utils.auth import get_current_user, get_current_user_id
from app.utils.config import documents_collection, folders_collection

documents_router = APIRouter(tags=["documents"])

# Test endpoints for initial testing

@documents_router.get("/test")
async def test_endpoint():
    """Test endpoint to verify service is working"""
    return {
        "success": True,
        "message": "Document service is working! 🚀",
        "service": "document-service",
        "version": "1.0.0"
    }

@documents_router.get("/test/auth")
async def test_auth_endpoint(current_user: Dict = Depends(get_current_user)):
    """Test endpoint to verify authentication is working"""
    return {
        "success": True,
        "message": "Authentication is working! 🔐",
        "user_email": current_user.get("email"),
        "user_data": current_user
    }

@documents_router.get("/test/database")
async def test_database_endpoint():
    """Test endpoint to verify database connection"""
    try:
        if documents_collection is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connection not available"
            )
        
        # Test database connection
        documents_collection.find_one()
        
        # Get collection stats
        doc_count = documents_collection.count_documents({})
        folder_count = folders_collection.count_documents({}) if folders_collection else 0
        
        return {
            "success": True,
            "message": "Database connection is working! 🗄️",
            "database": "snapdocs",
            "collections": {
                "documents": doc_count,
                "folders": folder_count
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database error: {str(e)}"
        )

@documents_router.get("/test/full")
async def test_full_endpoint(
    current_user: Dict = Depends(get_current_user),
    user_id: str = Depends(get_current_user_id)
):
    """Test endpoint for full authentication + database"""
    try:
        # Test database
        if documents_collection is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database not available"
            )
        
        # Test user documents query
        user_docs = list(documents_collection.find({"user_id": user_id}).limit(5))
        user_folders = list(folders_collection.find({"user_id": user_id}).limit(5))
        
        return {
            "success": True,
            "message": "Full stack test successful! ✅",
            "user_email": current_user.get("email"),
            "user_id": user_id,
            "user_documents_count": len(user_docs),
            "user_folders_count": len(user_folders),
            "database_status": "connected"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Full test failed: {str(e)}"
        )

# Basic folder endpoints for testing
@documents_router.get("/folders")
async def list_folders(user_id: str = Depends(get_current_user_id)):
    """List user folders (basic implementation for testing)"""
    try:
        if folders_collection is None:
            return {
                "success": False,
                "message": "Database not available",
                "data": []
            }
        
        folders = list(folders_collection.find({"user_id": user_id}))
        
        # Convert ObjectId to string for JSON serialization
        for folder in folders:
            folder["_id"] = str(folder["_id"])
        
        return {
            "success": True,
            "message": f"Found {len(folders)} folders",
            "data": folders
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching folders: {str(e)}"
        )

# Basic documents endpoints for testing
@documents_router.get("/documents")
async def list_documents(user_id: str = Depends(get_current_user_id)):
    """List user documents (basic implementation for testing)"""
    try:
        if documents_collection is None:
            return {
                "success": False,
                "message": "Database not available",
                "data": []
            }
        
        documents = list(documents_collection.find({"user_id": user_id}))
        
        # Convert ObjectId to string for JSON serialization
        for doc in documents:
            doc["_id"] = str(doc["_id"])
        
        return {
            "success": True,
            "message": f"Found {len(documents)} documents",
            "data": documents
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching documents: {str(e)}"
        )