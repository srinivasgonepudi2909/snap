# backend/services/document-service/app/api/routes.py

from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
import uuid
from datetime import datetime
import aiofiles
from pathlib import Path
from pydantic import BaseModel

documents_router = APIRouter(tags=["documents"])

# Pydantic models for request validation
class FolderCreateRequest(BaseModel):
    name: str
    description: Optional[str] = ""
    color: Optional[str] = "#3B82F6"
    icon: Optional[str] = "📁"

# Test endpoints (keep existing)
@documents_router.get("/test")
async def test_endpoint():
    return {
        "success": True,
        "message": "Document service is working! 🚀",
        "service": "document-service",
        "version": "1.0.0"
    }

@documents_router.get("/test/database")
async def test_database_endpoint():
    try:
        from app.utils.config import documents_collection, folders_collection
        
        if documents_collection is None:
            return {"success": False, "message": "Database connection not available"}
        
        doc_count = documents_collection.estimated_document_count()
        folder_count = folders_collection.estimated_document_count() if folders_collection else 0
        
        return {
            "success": True,
            "message": "Database connection is working! 🗄️",
            "database": "snapdocs",
            "collections": {"documents": doc_count, "folders": folder_count},
            "status": "connected"
        }
    except Exception as e:
        return {"success": False, "message": f"Database error: {str(e)}", "status": "error"}

# Documents endpoints
@documents_router.get("/documents")
async def list_documents():
    """List all documents"""
    try:
        from app.utils.config import documents_collection
        
        if documents_collection is None:
            return {"success": False, "message": "Database not available", "data": []}
        
        # Get all documents, sorted by creation date (newest first)
        documents = list(
            documents_collection
            .find({})
            .sort("created_at", -1)
            .limit(100)
        )
        
        # Convert ObjectId to string and ensure all fields exist
        for doc in documents:
            doc["_id"] = str(doc["_id"])
            # Ensure created_at exists
            if "created_at" not in doc:
                doc["created_at"] = datetime.utcnow()
            # Ensure folder fields exist
            if "folder_name" not in doc:
                doc["folder_name"] = "General"
            if "folder_id" not in doc:
                doc["folder_id"] = doc.get("folder_name", "General")
        
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
        
        # Read file content
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
        
        # Create upload directory
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
            "unique_name": unique_filename,
            "file_path": str(file_path),
            "file_size": file_size,
            "file_type": file_extension,
            "mime_type": file.content_type,
            "folder_name": folder_name,
            "folder_id": folder_name,
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

# Folders endpoints
@documents_router.get("/folders")
async def list_folders():
    """List all folders"""
    try:
        from app.utils.config import folders_collection, documents_collection
        
        if folders_collection is None:
            return {"success": False, "message": "Database not available", "data": []}
        
        # Get all folders
        folders = list(folders_collection.find({}).sort("created_at", -1))
        
        # Convert ObjectId to string and calculate document counts
        for folder in folders:
            folder["_id"] = str(folder["_id"])
            if "created_at" not in folder:
                folder["created_at"] = datetime.utcnow()
            
            # Count documents in this folder
            if documents_collection:
                doc_count = documents_collection.count_documents({
                    "$or": [
                        {"folder_name": folder["name"]},
                        {"folder_id": folder["name"]}
                    ]
                })
                folder["document_count"] = doc_count
            else:
                folder["document_count"] = 0
        
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
async def create_folder(folder_request: FolderCreateRequest):
    """Create a new folder"""
    try:
        from app.utils.config import folders_collection
        
        print(f"🚀 Received folder creation request: {folder_request}")  # Debug log
        
        if folders_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Validate required fields
        if not folder_request.name or not folder_request.name.strip():
            raise HTTPException(status_code=400, detail="Folder name is required")
        
        folder_name = folder_request.name.strip()
        
        # Check if folder already exists
        existing = folders_collection.find_one({"name": folder_name})
        if existing:
            raise HTTPException(status_code=400, detail="Folder already exists")
        
        # Create folder record
        new_folder = {
            "name": folder_name,
            "description": folder_request.description or "",
            "color": folder_request.color or "#3B82F6",
            "icon": folder_request.icon or "📁",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "document_count": 0
        }
        
        print(f"📝 Creating folder with data: {new_folder}")  # Debug log
        
        result = folders_collection.insert_one(new_folder)
        new_folder["_id"] = str(result.inserted_id)
        
        print(f"✅ Folder created successfully with ID: {result.inserted_id}")  # Debug log
        
        return {
            "success": True,
            "message": "Folder created successfully",
            "data": new_folder
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error creating folder: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Failed to create folder: {str(e)}")

@documents_router.get("/folders/{folder_name}/documents")
async def get_folder_documents(folder_name: str):
    """Get all documents in a specific folder"""
    try:
        from app.utils.config import documents_collection
        
        if documents_collection is None:
            return {"success": False, "message": "Database not available", "data": []}
        
        # Find documents in the specified folder
        documents = list(
            documents_collection
            .find({
                "$or": [
                    {"folder_name": folder_name},
                    {"folder_id": folder_name}
                ]
            })
            .sort("created_at", -1)
        )
        
        # Convert ObjectId to string
        for doc in documents:
            doc["_id"] = str(doc["_id"])
        
        return {
            "success": True,
            "message": f"Found {len(documents)} documents in {folder_name}",
            "data": documents
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Error fetching folder documents: {str(e)}",
            "data": []
        }

# Search endpoint
@documents_router.get("/search")
async def search_documents(q: str = Query(..., description="Search query")):
    """Search documents"""
    try:
        from app.utils.config import documents_collection
        
        if documents_collection is None or not q.strip():
            return {"success": True, "message": "No results", "results": []}
        
        # Search in document names and folder names
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

# Delete endpoints
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
        
        return {"success": True, "message": "Document deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@documents_router.delete("/folders/{folder_id}")
async def delete_folder(folder_id: str):
    """Delete a folder and optionally its contents"""
    try:
        from app.utils.config import folders_collection, documents_collection
        from bson import ObjectId
        
        if folders_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Find folder
        folder = folders_collection.find_one({"_id": ObjectId(folder_id)})
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        
        # Check if folder has documents
        if documents_collection:
            doc_count = documents_collection.count_documents({
                "$or": [
                    {"folder_name": folder["name"]},
                    {"folder_id": folder["name"]}
                ]
            })
            
            if doc_count > 0:
                # Move documents to "General" folder instead of deleting them
                documents_collection.update_many(
                    {"$or": [
                        {"folder_name": folder["name"]},
                        {"folder_id": folder["name"]}
                    ]},
                    {"$set": {"folder_name": "General", "folder_id": "General"}}
                )
        
        # Delete folder
        folders_collection.delete_one({"_id": ObjectId(folder_id)})
        
        return {"success": True, "message": "Folder deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

# Info endpoint
@documents_router.get("/info")
async def service_info():
    """Service information endpoint"""
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
            "search": "/api/v1/search",
            "folder_documents": "/api/v1/folders/{folder_name}/documents"
        }
    }