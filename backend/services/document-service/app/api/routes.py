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

# ------------------- Test Endpoints -------------------

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

# ------------------- Document Endpoints -------------------

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
        from app.utils.config import documents_collection, settings

        if documents_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")

        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

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
        print(f"❌ Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

# ------------------- Folder Endpoints -------------------

@documents_router.get("/folders")
async def list_folders():
    try:
        from app.utils.config import folders_collection, documents_collection

        if folders_collection is None:
            return {"success": False, "message": "Database not available", "data": []}

        folders = list(folders_collection.find({}).sort("created_at", -1))

        for folder in folders:
            folder["_id"] = str(folder["_id"])
            folder.setdefault("created_at", datetime.utcnow())
            if documents_collection is not None:
                folder["document_count"] = documents_collection.count_documents({
                    "$or": [
                        {"folder_name": folder["name"]},
                        {"folder_id": folder["name"]}
                    ]
                })
            else:
                folder["document_count"] = 0

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
            "document_count": 0
        }

        result = folders_collection.insert_one(new_folder)
        new_folder["_id"] = str(result.inserted_id)

        return {
            "success": True,
            "message": "Folder created successfully",
            "data": new_folder
        }

    except Exception as e:
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
        return {
            "success": False,
            "message": f"Error fetching folder documents: {str(e)}",
            "data": []
        }

# ------------------- Search Endpoints -------------------

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

# ------------------- Delete Endpoints -------------------

@documents_router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    try:
        from app.utils.config import documents_collection

        if documents_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")

        document = documents_collection.find_one({"_id": ObjectId(document_id)})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        file_path = Path(document["file_path"])
        if file_path.exists():
            file_path.unlink()

        documents_collection.delete_one({"_id": ObjectId(document_id)})
        return {"success": True, "message": "Document deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@documents_router.delete("/folders/{folder_id}")
async def delete_folder(folder_id: str):
    try:
        from app.utils.config import folders_collection, documents_collection

        if folders_collection is None:
            raise HTTPException(status_code=500, detail="Database not available")

        folder = folders_collection.find_one({"_id": ObjectId(folder_id)})
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")

        if documents_collection is not None:
            documents_collection.update_many(
                {"$or": [
                    {"folder_name": folder["name"]},
                    {"folder_id": folder["name"]}
                ]},
                {"$set": {"folder_name": "General", "folder_id": "General"}}
            )

        folders_collection.delete_one({"_id": ObjectId(folder_id)})

        return {"success": True, "message": "Folder deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

# ------------------- Info Endpoint -------------------

@documents_router.get("/info")
async def service_info():
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
            "search_advanced": "/api/v1/search/advanced",
            "folder_documents": "/api/v1/folders/{folder_name}/documents"
        }
    }
