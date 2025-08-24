# app/models/document.py

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class DocumentType(str, Enum):
    """Document type enumeration"""
    PDF = "pdf"
    IMAGE = "image"
    DOCUMENT = "document"
    SPREADSHEET = "spreadsheet"
    PRESENTATION = "presentation"
    ARCHIVE = "archive"
    TEXT = "text"
    OTHER = "other"


class DocumentStatus(str, Enum):
    """Document status enumeration"""
    UPLOADING = "uploading"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"


class DocumentBase(BaseModel):
    """Base document model"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    folder_id: Optional[str] = Field(None, description="Parent folder ID")
    tags: List[str] = Field(default_factory=list)


class DocumentCreate(DocumentBase):
    """Document creation model"""
    pass


class DocumentUpdate(BaseModel):
    """Document update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    folder_id: Optional[str] = None
    tags: Optional[List[str]] = None


class DocumentInDB(DocumentBase):
    """Document model as stored in database"""
    id: str = Field(alias="_id")
    user_id: str
    file_path: str
    file_size: int
    file_type: str
    mime_type: str
    document_type: DocumentType
    status: DocumentStatus = DocumentStatus.COMPLETED
    created_at: datetime
    updated_at: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        allow_population_by_field_name = True


class Document(DocumentInDB):
    """Document response model"""
    file_url: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True


class DocumentResponse(BaseModel):
    """Document API response"""
    success: bool = True
    message: str
    data: Optional[Document] = None


class DocumentListResponse(BaseModel):
    """Document list API response"""
    success: bool = True
    message: str
    data: List[Document] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    per_page: int = 20


# app/models/folder.py

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class FolderBase(BaseModel):
    """Base folder model"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    parent_id: Optional[str] = Field(None, description="Parent folder ID")
    color: Optional[str] = Field("#3B82F6", description="Folder color hex code")
    icon: Optional[str] = Field("📁", description="Folder emoji icon")


class FolderCreate(FolderBase):
    """Folder creation model"""
    pass


class FolderUpdate(BaseModel):
    """Folder update model"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    parent_id: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None


class FolderInDB(FolderBase):
    """Folder model as stored in database"""
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime
    updated_at: datetime
    document_count: int = 0
    subfolder_count: int = 0

    class Config:
        allow_population_by_field_name = True


class Folder(FolderInDB):
    """Folder response model"""
    path: List[str] = Field(default_factory=list, description="Folder path breadcrumbs")
    
    class Config:
        allow_population_by_field_name = True


class FolderResponse(BaseModel):
    """Folder API response"""
    success: bool = True
    message: str
    data: Optional[Folder] = None


class FolderListResponse(BaseModel):
    """Folder list API response"""
    success: bool = True
    message: str
    data: List[Folder] = Field(default_factory=list)
    total: int = 0


class FolderContentsResponse(BaseModel):
    """Folder contents API response"""
    success: bool = True
    message: str
    folders: List[Folder] = Field(default_factory=list)
    documents: List[Document] = Field(default_factory=list)
    breadcrumbs: List[Dict[str, str]] = Field(default_factory=list)