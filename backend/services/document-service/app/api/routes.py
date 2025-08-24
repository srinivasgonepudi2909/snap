# app/api/routes.py

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Depends, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import uuid
from datetime import datetime
import aiofiles
from pathlib import Path

documents_router = APIRouter(tags=["documents"])

# Test endpoints
@documents_router.get("/test")
async def test_endpoint():
    """Test endpoint to verify service is working"""
    return {
        "success": True,
        "message": "Document service is working! 🚀",
        "service": "document-service",
        "version": "1.0.0"
    }

@documents_router.get("/test/database")
async def test_database_endpoint():
    """Test endpoint to verify database connection"""
    try:
        from app.utils.config import documents_collection, folders_collection
        
        if documents_collection is None:
            return {
                "success": False,
                "message": "Database connection not available",
                "status": "disconnected"
            }
        
        # Test database connection with a simple operation
        result = documents_collection.find_one({}, {"_id": 1})
        
        # Get collection stats
        doc_count = documents_collection.estimated_document_count()
        folder_count = folders_collection.estimated_document_count() if folders_collection is not None else 0
        
        return {
            "success": True,
            "message": "Database connection is working! 🗄️",
            "database": "snapdocs",
            "collections": {
                "documents": doc_count,
                "folders": folder_count
            },
            "status": "connected"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Database error: {str(e)}",
            "status": "error"
        }

# Document endpoints
@documents_router.get("/documents")
async def list_documents():
    """List all documents (no auth for testing)"""
    try:
        from app.utils.config import documents_collection
        
        if documents_collection is None:
            return {
                "success": False,
                "message": "Database not available",
                "data": []
            }
        
        documents = list(documents_collection.find({}).limit(50))
        
        # Convert ObjectId to string for JSON serialization
        for doc in documents:
            doc["_id"] = str(doc["_id"])
            # Add created_at if missing
            if "created_at" not in doc:
                doc["created_at"] = datetime.utcnow().isoformat()
        
        return {
            "success": True,
            "message": f"Found {len(documents)} documents",
            "data": documents
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error fetching documents: {str(e)}",
            "data": []
        }

@documents_router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    folder_name: str = Form("General")
):
    """Upload a document"""
    try:
        from app.utils.config import documents_collection, settings
        
        if documents_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Check file size
        file_size = 0
        content = await file.read()
        file_size = len(content)
        
        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413, 
                detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE} bytes"
            )
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create upload directory if it doesn't exist
        upload_dir = Path(settings.UPLOAD_DIRECTORY)
        upload_dir.mkdir(exist_ok=True)
        
        # Save file
        file_path = upload_dir / unique_filename
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        # Create document record
        document_data = {
            "name": file.filename,
            "original_name": file.filename,
            "file_path": str(file_path),
            "file_size": file_size,
            "file_type": file_extension,
            "mime_type": file.content_type,
            "folder_name": folder_name,
            "folder_id": folder_name,  # For compatibility
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "status": "completed"
        }
        
        result = documents_collection.insert_one(document_data)
        document_data["_id"] = str(result.inserted_id)
        
        return {
            "success": True,
            "message": "File uploaded successfully",
            "data": document_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@documents_router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    try:
        from app.utils.config import documents_collection
        from bson import ObjectId
        
        if documents_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Find document
        document = documents_collection.find_one({"_id": ObjectId(document_id)})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Delete file from storage
        try:
            file_path = Path(document["file_path"])
            if file_path.exists():
                file_path.unlink()
        except Exception as e:
            print(f"Warning: Could not delete file: {e}")
        
        # Delete from database
        documents_collection.delete_one({"_id": ObjectId(document_id)})
        
        return {
            "success": True,
            "message": "Document deleted successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

# Folder endpoints
@documents_router.get("/folders")
async def list_folders():
    """List all folders"""
    try:
        from app.utils.config import folders_collection
        
        if folders_collection is None:
            return {
                "success": False,
                "message": "Database not available",
                "data": []
            }
        
        folders = list(folders_collection.find({}).limit(50))
        
        # Convert ObjectId to string for JSON serialization
        for folder in folders:
            folder["_id"] = str(folder["_id"])
            if "created_at" not in folder:
                folder["created_at"] = datetime.utcnow().isoformat()
        
        return {
            "success": True,
            "message": f"Found {len(folders)} folders",
            "data": folders
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error fetching folders: {str(e)}",
            "data": []
        }

@documents_router.post("/folders")
async def create_folder(folder_data: dict):
    """Create a new folder"""
    try:
        from app.utils.config import folders_collection
        
        if folders_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Validate required fields
        if "name" not in folder_data:
            raise HTTPException(status_code=400, detail="Folder name is required")
        
        # Check if folder already exists
        existing = folders_collection.find_one({"name": folder_data["name"]})
        if existing:
            raise HTTPException(status_code=400, detail="Folder already exists")
        
        # Create folder record
        new_folder = {
            "name": folder_data["name"],
            "description": folder_data.get("description", ""),
            "color": folder_data.get("color", "#3B82F6"),
            "icon": folder_data.get("icon", "📁"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "document_count": 0
        }
        
        result = folders_collection.insert_one(new_folder)
        new_folder["_id"] = str(result.inserted_id)
        
        return {
            "success": True,
            "message": "Folder created successfully",
            "data": new_folder
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create folder: {str(e)}")

# Search endpoint
@documents_router.get("/search")
async def search_documents(q: str = Query(..., description="Search query")):
    """Search documents"""
    try:
        from app.utils.config import documents_collection
        
        if documents_collection is None:
            return {
                "success": False,
                "message": "Database not available",
                "results": []
            }
        
        if not q.strip():
            return {
                "success": True,
                "message": "Empty query",
                "results": []
            }
        
        # Simple text search (you can make this more sophisticated)
        search_query = {
            "$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"original_name": {"$regex": q, "$options": "i"}},
                {"folder_name": {"$regex": q, "$options": "i"}}
            ]
        }
        
        documents = list(documents_collection.find(search_query).limit(20))
        
        # Convert ObjectId to string
        for doc in documents:
            doc["_id"] = str(doc["_id"])
        
        return {
            "success": True,
            "message": f"Found {len(documents)} results",
            "results": documents
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Search failed: {str(e)}",
            "results": []
        }

# Info endpoint
@documents_router.get("/info")
async def service_info():
    """Service information endpoint"""
    import os
    return {
        "service": "document-service",
        "version": "1.0.0",
        "status": "running",
        "upload_directory": os.path.abspath("./uploads"),
        "endpoints": {
            "test": "/api/v1/test",
            "database_test": "/api/v1/test/database", 
            "folders": "/api/v1/folders",
            "documents": "/api/v1/documents",
            "upload": "/api/v1/upload",
            "search": "/api/v1/search"
        }
    }