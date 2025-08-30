# backend/services/document-service/app/api/routes.py - ENHANCED WITH FILE SERVING
from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse, FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from typing import List, Optional, Dict, Any
import os
import uuid
from datetime import datetime
import aiofiles
from pathlib import Path
import traceback
from bson import ObjectId
from dateutil.parser import parse as parse_date
import mimetypes
import aiofiles.os

documents_router = APIRouter(tags=["documents"])

# ===============================
# FILE SERVING ENDPOINTS - NEW
# ===============================

@documents_router.get("/files/{file_name}")
async def serve_file(file_name: str):
    """
    Serve static files directly - PRIMARY FILE SERVING ENDPOINT
    This endpoint serves files uploaded to the system
    """
    try:
        from app.utils.config import settings
        
        # Construct file path
        file_path = Path(settings.UPLOAD_DIRECTORY) / file_name
        
        print(f"📁 Serving file request: {file_name}")
        print(f"📂 Looking for file at: {file_path}")
        
        # Check if file exists
        if not file_path.exists() or not file_path.is_file():
            print(f"❌ File not found: {file_path}")
            raise HTTPException(status_code=404, detail=f"File '{file_name}' not found")
        
        # Get file stats
        file_stat = await aiofiles.os.stat(file_path)
        file_size = file_stat.st_size
        
        # Determine MIME type
        mime_type, _ = mimetypes.guess_type(str(file_path))
        if not mime_type:
            mime_type = 'application/octet-stream'
        
        print(f"✅ Serving file: {file_name} ({file_size} bytes, {mime_type})")
        
        # Return file response with proper headers
        return FileResponse(
            path=str(file_path),
            media_type=mime_type,
            filename=file_name,
            headers={
                "Content-Length": str(file_size),
                "Cache-Control": "public, max-age=3600",  # Cache for 1 hour
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
                "Access-Control-Allow-Headers": "Authorization, Content-Type"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error serving file {file_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error serving file: {str(e)}")

@documents_router.get("/documents/{document_id}/download")
async def download_document(document_id: str):
    """
    Download a specific document by ID with authentication
    """
    try:
        from app.utils.config import documents_collection, settings
        
        print(f"📥 Download request for document ID: {document_id}")
        
        if not documents_collection:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Validate ObjectId format
        try:
            doc_object_id = ObjectId(document_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid document ID format")
        
        # Find document in database
        document = documents_collection.find_one({"_id": doc_object_id})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Construct file path
        file_path = Path(document.get("file_path", ""))
        if not file_path.exists():
            # Try alternative path using unique_name
            if document.get("unique_name"):
                file_path = Path(settings.UPLOAD_DIRECTORY) / document["unique_name"]
        
        if not file_path.exists() or not file_path.is_file():
            print(f"❌ Physical file not found: {file_path}")
            raise HTTPException(status_code=404, detail="Physical file not found")
        
        # Get original filename
        original_name = document.get("original_name") or document.get("name") or file_path.name
        
        # Determine MIME type
        mime_type = document.get("mime_type")
        if not mime_type:
            mime_type, _ = mimetypes.guess_type(str(file_path))
            if not mime_type:
                mime_type = 'application/octet-stream'
        
        print(f"✅ Downloading: {original_name} from {file_path}")
        
        # Return file with download headers
        return FileResponse(
            path=str(file_path),
            media_type=mime_type,
            filename=original_name,
            headers={
                "Content-Disposition": f'attachment; filename="{original_name}"',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error downloading document {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@documents_router.head("/files/{file_name}")
async def check_file_exists(file_name: str):
    """
    Check if a file exists (HEAD request for testing)
    """
    try:
        from app.utils.config import settings
        
        file_path = Path(settings.UPLOAD_DIRECTORY) / file_name
        
        if not file_path.exists() or not file_path.is_file():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Get file stats
        file_stat = await aiofiles.os.stat(file_path)
        file_size = file_stat.st_size
        
        # Determine MIME type
        mime_type, _ = mimetypes.guess_type(str(file_path))
        if not mime_type:
            mime_type = 'application/octet-stream'
        
        # Return headers only (no body for HEAD request)
        return JSONResponse(
            content={},
            headers={
                "Content-Length": str(file_size),
                "Content-Type": mime_type,
                "Cache-Control": "public, max-age=3600",
                "Access-Control-Allow-Origin": "*"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error checking file {file_name}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error checking file: {str(e)}")

@documents_router.get("/documents/{document_id}/stream")
async def stream_document(document_id: str):
    """
    Stream a document for preview (alternative to direct file serving)
    """
    try:
        from app.utils.config import documents_collection, settings
        
        print(f"🎬 Stream request for document ID: {document_id}")
        
        if not documents_collection:
            raise HTTPException(status_code=500, detail="Database not available")
        
        # Validate ObjectId format
        try:
            doc_object_id = ObjectId(document_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid document ID format")
        
        # Find document in database
        document = documents_collection.find_one({"_id": doc_object_id})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Construct file path
        file_path = Path(document.get("file_path", ""))
        if not file_path.exists():
            if document.get("unique_name"):
                file_path = Path(settings.UPLOAD_DIRECTORY) / document["unique_name"]
        
        if not file_path.exists() or not file_path.is_file():
            raise HTTPException(status_code=404, detail="Physical file not found")
        
        # Determine MIME type
        mime_type = document.get("mime_type")
        if not mime_type:
            mime_type, _ = mimetypes.guess_type(str(file_path))
            if not mime_type:
                mime_type = 'application/octet-stream'
        
        print(f"✅ Streaming: {document.get('name')} ({mime_type})")
        
        # Stream file
        async def file_streamer():
            async with aiofiles.open(file_path, 'rb') as file:
                while chunk := await file.read(8192):  # 8KB chunks
                    yield chunk
        
        return StreamingResponse(
            file_streamer(),
            media_type=mime_type,
            headers={
                "Cache-Control": "public, max-age=3600",
                "Access-Control-Allow-Origin": "*"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error streaming document {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Stream failed: {str(e)}")

# ===============================
# GENERAL FOLDER UTILITY FUNCTIONS
# ===============================

def ensure_general_folder_exists():
    """
    Ensures that a default "General" folder exists in the database.
    Creates it if it doesn't exist.
    """
    try:
        from app.utils.config import folders_collection
        
        if folders_collection is None:
            print("❌ Folders collection not available")
            return False
        
        # Check if General folder already exists
        existing_general = folders_collection.find_one({"name": "General"})
        
        if not existing_general:
            print("📁 Creating default 'General' folder...")
            
            # Create the default General folder
            general_folder = {
                "name": "General",
                "description": "Default folder for documents uploaded directly to dashboard",
                "color": "#6B7280",  # Gray color
                "icon": "📂",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "document_count": 0,
                "is_default": True  # Mark as default folder
            }
            
            result = folders_collection.insert_one(general_folder)
            print(f"✅ General folder created with ID: {result.inserted_id}")
            return True
        else:
            print("📂 General folder already exists")
            # Update existing General folder to ensure it has the is_default flag
            folders_collection.update_one(
                {"name": "General"},
                {"$set": {"is_default": True, "icon": "📂", "updated_at": datetime.utcnow()}}
            )
            return True
            
    except Exception as e:
        print(f"❌ Error creating General folder: {str(e)}")
        return False

def get_or_create_general_folder():
    """
    Gets the General folder, creating it if it doesn't exist.
    Returns the General folder document.
    """
    try:
        from app.utils.config import folders_collection
        
        if folders_collection is None:
            return None
        
        # Try to find existing General folder
        general_folder = folders_collection.find_one({"name": "General"})
        
        if not general_folder:
            # Create it if it doesn't exist
            ensure_general_folder_exists()
            general_folder = folders_collection.find_one({"name": "General"})
        
        return general_folder
        
    except Exception as e:
        print(f"❌ Error getting General folder: {str(e)}")
        return None

# ===============================
# TEST ENDPOINTS
# ===============================

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
        folder_count = folders_collection.estimated_document_count() if folders_collection is not None else 0

        return {
            "success": True,
            "message": "Database connection is working! 🗄️",
            "database": "snapdocs",
            "collections": {"documents": doc_count, "folders": folder_count},
            "status": "connected"
        }
    except Exception as e:
        return {"success": False, "message": f"Database error: {str(e)}", "status": "error"}

@documents_router.get("/test/file-serving")
async def test_file_serving():
    """
    Test file serving capabilities
    """
    try:
        from app.utils.config import settings
        
        upload_dir = Path(settings.UPLOAD_DIRECTORY)
        
        # Check if upload directory exists
        if not upload_dir.exists():
            return {
                "success": False,
                "message": "Upload directory does not exist",
                "upload_directory": str(upload_dir)
            }
        
        # List files in upload directory
        files = []
        if upload_dir.exists():
            files = [f.name for f in upload_dir.iterdir() if f.is_file()]
        
        return {
            "success": True,
            "message": "File serving is working! 📁",
            "upload_directory": str(upload_dir),
            "files_count": len(files),
            "sample_files": files[:5],  # Show first 5 files
            "file_serving_endpoints": {
                "static_files": "/files/{filename}",
                "download_by_id": "/documents/{id}/download", 
                "stream_by_id": "/documents/{id}/stream",
                "check_file": "/files/{filename} (HEAD)"
            }
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"File serving test failed: {str(e)}"
        }

# ===============================
# DOCUMENT ENDPOINTS
# ===============================

@documents_router.get("/documents")
async def list_documents():
    try:
        from app.utils.config import documents_collection

        if documents_collection is None:
            return {"success": False, "message": "Database not available", "data": []}

        documents = list(
            documents_collection.find({})
            .sort("created_at", -1)
            .limit(100)
        )

        for doc in documents:
            doc["_id"] = str(doc["_id"])
            doc.setdefault("created_at", datetime.utcnow())
            doc.setdefault("folder_name", "General")
            doc.setdefault("folder_id", doc.get("folder_name", "General"))
            
            # Add file URL for easy access
            if doc.get("unique_name"):
                doc["file_url"] = f"/files/{doc['unique_name']}"

        return {
            "success": True,
            "message": f"Found {len(documents)} documents",
            "data": documents
        }
    except Exception as e:
        print(f"❌ Error in list_documents: {str(e)}")
        return {
            "success": False,
            "message": f"Error fetching documents: {str(e)}",
            "data": []
        }

@documents_router.post("/upload")
async def upload_document(file: UploadFile = File(...), folder_name: str = Form("General")):
    try:
        from app.utils.config import documents_collection, folders_collection, settings

        if documents_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")

        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        # Ensure General folder exists before upload
        ensure_general_folder_exists()
        
        # If no folder specified or folder is empty, use "General"
        target_folder = folder_name.strip() if folder_name and folder_name.strip() else "General"
        
        print(f"📤 Uploading file '{file.filename}' to folder '{target_folder}'")

        content = await file.read()
        file_size = len(content)

        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE} bytes"
            )

        file_extension = Path(file.filename).suffix.lower()
        unique_filename = f"{uuid.uuid4()}{file_extension}"

        upload_dir = Path(settings.UPLOAD_DIRECTORY)
        upload_dir.mkdir(exist_ok=True)

        file_path = upload_dir / unique_filename
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)

        # Always ensure the target folder exists in database
        if target_folder != "General" and folders_collection is not None:
            existing_folder = folders_collection.find_one({"name": target_folder})
            if not existing_folder:
                # Create the folder if it doesn't exist
                new_folder = {
                    "name": target_folder,
                    "description": f"Auto-created folder: {target_folder}",
                    "color": "#3B82F6",
                    "icon": "📁",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                    "document_count": 0
                }
                folders_collection.insert_one(new_folder)
                print(f"📁 Auto-created folder: {target_folder}")

        document_data = {
            "name": file.filename,
            "original_name": file.filename,
            "unique_name": unique_filename,
            "file_path": str(file_path),
            "file_size": file_size,
            "file_type": file_extension,
            "mime_type": file.content_type,
            "folder_name": target_folder,  # Always set to a valid folder
            "folder_id": target_folder,    # Keep both for compatibility
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "status": "completed",
            "file_url": f"/files/{unique_filename}"  # Add direct file URL
        }

        result = documents_collection.insert_one(document_data)
        document_data["_id"] = str(result.inserted_id)

        print(f"✅ File uploaded successfully to folder '{target_folder}'")

        return {
            "success": True,
            "message": f"File uploaded successfully to {target_folder}",
            "data": document_data
        }

    except Exception as e:
        print(f"❌ Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# ===============================
# FOLDER ENDPOINTS
# ===============================

@documents_router.get("/folders")
async def list_folders():
    try:
        from app.utils.config import folders_collection, documents_collection

        if folders_collection is None:
            return {"success": False, "message": "Database not available", "data": []}

        # Ensure General folder exists
        ensure_general_folder_exists()

        # Get all folders
        folders_cursor = folders_collection.find({}).sort("created_at", -1)
        folders = list(folders_cursor)
        
        # Sort to ensure General folder appears first
        folders.sort(key=lambda x: (x["name"] != "General", x["name"]))

        for folder in folders:
            folder["_id"] = str(folder["_id"])
            folder.setdefault("created_at", datetime.utcnow())
            folder.setdefault("is_default", folder["name"] == "General")
            
            if documents_collection is not None:
                folder["document_count"] = documents_collection.count_documents({
                    "$or": [
                        {"folder_name": folder["name"]},
                        {"folder_id": folder["name"]}
                    ]
                })
            else:
                folder["document_count"] = 0

        print(f"📁 Retrieved {len(folders)} folders (General folder included)")

        return {
            "success": True,
            "message": f"Found {len(folders)} folders",
            "data": folders
        }

    except Exception as e:
        print(f"❌ Error in list_folders: {str(e)}")
        return {
            "success": False,
            "message": f"Error fetching folders: {str(e)}",
            "data": []
        }

@documents_router.post("/folders")
async def create_folder(folder_data: Dict[str, Any]):
    try:
        from app.utils.config import folders_collection

        if folders_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")

        folder_name = folder_data.get("name", "").strip()
        if not folder_name:
            raise HTTPException(status_code=400, detail="Folder name is required")

        # Check if folder already exists
        existing = folders_collection.find_one({"name": folder_name})
        if existing:
            raise HTTPException(status_code=400, detail="Folder already exists")

        new_folder = {
            "name": folder_name,
            "description": folder_data.get("description", ""),
            "color": folder_data.get("color", "#3B82F6"),
            "icon": folder_data.get("icon", "📁"),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "document_count": 0,
            "is_default": folder_name == "General"  # Mark General as default
        }

        result = folders_collection.insert_one(new_folder)
        new_folder["_id"] = str(result.inserted_id)

        print(f"✅ Folder '{folder_name}' created successfully")

        return {
            "success": True,
            "message": "Folder created successfully",
            "data": new_folder
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error creating folder: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@documents_router.get("/folders/{folder_name}/documents")
async def get_folder_documents(folder_name: str):
    try:
        from app.utils.config import documents_collection

        if documents_collection is None:
            return {"success": False, "message": "Database not available", "data": []}

        documents = list(
            documents_collection.find({
                "$or": [
                    {"folder_name": folder_name},
                    {"folder_id": folder_name}
                ]
            }).sort("created_at", -1)
        )

        for doc in documents:
            doc["_id"] = str(doc["_id"])
            # Add file URL if unique_name exists
            if doc.get("unique_name"):
                doc["file_url"] = f"/files/{doc['unique_name']}"

        return {
            "success": True,
            "message": f"Found {len(documents)} documents in {folder_name}",
            "data": documents
        }

    except Exception as e:
        print(f"❌ Error in get_folder_documents: {str(e)}")
        return {
            "success": False,
            "message": f"Error fetching folder documents: {str(e)}",
            "data": []
        }

# ===============================
# DELETE ENDPOINTS
# ===============================

@documents_router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    try:
        from app.utils.config import documents_collection

        if documents_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")

        # Validate ObjectId format
        try:
            doc_object_id = ObjectId(document_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid document ID format")

        document = documents_collection.find_one({"_id": doc_object_id})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        # Delete physical file
        file_path = Path(document["file_path"])
        if file_path.exists():
            try:
                file_path.unlink()
                print(f"🗑️ Physical file deleted: {file_path}")
            except Exception as e:
                print(f"⚠️ Warning: Could not delete physical file: {e}")

        # Delete document from database
        documents_collection.delete_one({"_id": doc_object_id})
        print(f"✅ Document '{document.get('name', 'Unknown')}' deleted successfully")

        return {"success": True, "message": "Document deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

# ===============================
# UTILITY ENDPOINTS
# ===============================

@documents_router.get("/info")
async def service_info():
    """Service information endpoint with file serving details"""
    try:
        from app.utils.config import folders_collection, documents_collection, settings
        
        # Get stats
        folder_count = folders_collection.estimated_document_count() if folders_collection else 0
        doc_count = documents_collection.estimated_document_count() if documents_collection else 0
        
        # Check if General folder exists
        general_exists = False
        if folders_collection:
            general_exists = folders_collection.find_one({"name": "General"}) is not None
        
        # Check upload directory
        upload_dir = Path(settings.UPLOAD_DIRECTORY)
        files_on_disk = 0
        if upload_dir.exists():
            files_on_disk = len([f for f in upload_dir.iterdir() if f.is_file()])
        
        return {
            "service": "document-service",
            "version": "1.0.0",
            "status": "running",
            "upload_directory": str(upload_dir.absolute()),
            "stats": {
                "total_documents": doc_count,
                "total_folders": folder_count,
                "general_folder_exists": general_exists,
                "files_on_disk": files_on_disk
            },
            "file_serving": {
                "static_files_endpoint": "/files/{filename}",
                "download_endpoint": "/documents/{id}/download",
                "stream_endpoint": "/documents/{id}/stream",
                "file_check_endpoint": "/files/{filename} (HEAD)",
                "max_file_size": f"{settings.MAX_FILE_SIZE} bytes",
                "supported_formats": settings.ALLOWED_FILE_TYPES
            },
            "endpoints": {
                "test": "/test",
                "database_test": "/test/database", 
                "file_serving_test": "/test/file-serving",
                "folders": "/folders",
                "documents": "/documents",
                "upload": "/upload",
                "folder_documents": "/folders/{folder_name}/documents"
            }
        }
    except Exception as e:
        return {
            "service": "document-service",
            "version": "1.0.0", 
            "status": "error",
            "error": str(e)
        }