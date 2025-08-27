from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import os
import uuid
from datetime import datetime
import aiofiles
from pathlib import Path
import traceback
from bson import ObjectId
from dateutil.parser import parse as parse_date

documents_router = APIRouter(tags=["documents"])

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
            "status": "completed"
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
# SEARCH ENDPOINTS
# ===============================

@documents_router.get("/search")
async def search_documents(q: str = Query(..., description="Search query")):
    try:
        from app.utils.config import documents_collection

        if documents_collection is None or not q.strip():
            return {"success": True, "message": "No results", "results": []}

        search_query = {
            "$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"original_name": {"$regex": q, "$options": "i"}},
                {"folder_name": {"$regex": q, "$options": "i"}}
            ]
        }

        documents = list(documents_collection.find(search_query).limit(20))
        for doc in documents:
            doc["_id"] = str(doc["_id"])

        return {
            "success": True,
            "message": f"Found {len(documents)} results",
            "results": documents
        }

    except Exception as e:
        print(f"❌ Error in search_documents: {str(e)}")
        return {
            "success": False,
            "message": f"Search failed: {str(e)}",
            "results": []
        }

@documents_router.get("/search/advanced")
async def advanced_search(
    q: Optional[str] = Query(None),
    file_types: Optional[List[str]] = Query(None),
    folders: Optional[List[str]] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    min_size: Optional[int] = Query(None),
    max_size: Optional[int] = Query(None),
    sort_by: Optional[str] = Query("created_at"),
    sort_order: Optional[str] = Query("desc")
):
    try:
        from app.utils.config import documents_collection

        if documents_collection is None:
            return {"success": False, "message": "Database not available", "results": []}

        query: Dict[str, Any] = {}

        if q:
            query["$or"] = [
                {"name": {"$regex": q, "$options": "i"}},
                {"original_name": {"$regex": q, "$options": "i"}},
                {"folder_name": {"$regex": q, "$options": "i"}}
            ]

        if file_types:
            query["file_type"] = {"$in": [ft.lower() for ft in file_types]}

        if folders:
            query["$or"] = query.get("$or", []) + [
                {"folder_name": {"$in": folders}},
                {"folder_id": {"$in": folders}}
            ]

        if date_from or date_to:
            date_filter = {}
            if date_from:
                date_filter["$gte"] = parse_date(date_from)
            if date_to:
                date_filter["$lte"] = parse_date(date_to)
            query["created_at"] = date_filter

        if min_size is not None or max_size is not None:
            size_filter = {}
            if min_size is not None:
                size_filter["$gte"] = min_size
            if max_size is not None:
                size_filter["$lte"] = max_size
            query["file_size"] = size_filter

        sort_field = sort_by if sort_by in ["created_at", "name", "file_size"] else "created_at"
        sort_direction = -1 if sort_order == "desc" else 1

        documents = list(documents_collection.find(query).sort(sort_field, sort_direction).limit(100))
        for doc in documents:
            doc["_id"] = str(doc["_id"])

        return {
            "success": True,
            "message": f"Found {len(documents)} results",
            "results": documents
        }

    except Exception as e:
        print(f"❌ Error in advanced_search: {str(e)}")
        return {
            "success": False,
            "message": f"Advanced search failed: {str(e)}",
            "results": []
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

@documents_router.delete("/folders/{folder_id}")
async def delete_folder(folder_id: str):
    try:
        from app.utils.config import folders_collection, documents_collection

        if folders_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")

        # Validate ObjectId format
        try:
            folder_object_id = ObjectId(folder_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid folder ID format")

        folder = folders_collection.find_one({"_id": folder_object_id})
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")

        # Prevent deletion of General folder
        if folder.get("name") == "General" or folder.get("is_default"):
            raise HTTPException(status_code=400, detail="Cannot delete the default General folder")

        # Move documents from this folder to General folder
        if documents_collection is not None:
            update_result = documents_collection.update_many(
                {"$or": [
                    {"folder_name": folder["name"]},
                    {"folder_id": folder["name"]}
                ]},
                {"$set": {
                    "folder_name": "General",
                    "folder_id": "General",
                    "updated_at": datetime.utcnow()
                }}
            )
            print(f"📁 Moved {update_result.modified_count} documents to General folder")

        # Delete the folder
        folders_collection.delete_one({"_id": folder_object_id})
        print(f"✅ Folder '{folder.get('name', 'Unknown')}' deleted successfully")

        return {
            "success": True, 
            "message": f"Folder deleted successfully. {update_result.modified_count if 'update_result' in locals() else 0} documents moved to General folder."
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting folder: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

# ===============================
# UTILITY ENDPOINTS
# ===============================

@documents_router.post("/initialize-general-folder")
async def initialize_general_folder():
    """Manual endpoint to create General folder if needed"""
    try:
        result = ensure_general_folder_exists()
        
        if result:
            return {
                "success": True,
                "message": "General folder initialized successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to initialize General folder")
            
    except Exception as e:
        print(f"❌ Error initializing General folder: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Initialization failed: {str(e)}")

@documents_router.get("/info")
async def service_info():
    """Service information endpoint"""
    try:
        from app.utils.config import folders_collection, documents_collection
        
        # Get stats
        folder_count = folders_collection.estimated_document_count() if folders_collection else 0
        doc_count = documents_collection.estimated_document_count() if documents_collection else 0
        
        # Check if General folder exists
        general_exists = False
        if folders_collection:
            general_exists = folders_collection.find_one({"name": "General"}) is not None
        
        return {
            "service": "document-service",
            "version": "1.0.0",
            "status": "running",
            "upload_directory": os.path.abspath("./uploads"),
            "stats": {
                "total_documents": doc_count,
                "total_folders": folder_count,
                "general_folder_exists": general_exists
            },
            "endpoints": {
                "test": "/api/v1/test",
                "database_test": "/api/v1/test/database",
                "folders": "/api/v1/folders",
                "documents": "/api/v1/documents",
                "upload": "/api/v1/upload",
                "search": "/api/v1/search",
                "search_advanced": "/api/v1/search/advanced",
                "folder_documents": "/api/v1/folders/{folder_name}/documents",
                "initialize_general": "/api/v1/initialize-general-folder"
            }
        }
    except Exception as e:
        return {
            "service": "document-service",
            "version": "1.0.0", 
            "status": "error",
            "error": str(e)
        }

# ===============================
# STARTUP EVENT
# ===============================

@documents_router.on_event("startup")
async def startup_event():
    """Ensure General folder exists on service startup"""
    print("🚀 Document service starting up...")
    ensure_general_folder_exists()
    print("✅ Document service startup completed")