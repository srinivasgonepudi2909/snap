import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Folder, 
  FileText, 
  Search, 
  User, 
  Settings, 
  LogOut,
  Home,
  Star,
  Trash2,
  Share,
  Plus,
  Activity,
  X,
  FolderOpen,
  ArrowLeft,
  Download,
  Eye,
  Edit3,
  AlertCircle
} from 'lucide-react';

// Custom hook for documents and folders - UPDATED WITH BETTER REFRESH
const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      console.log('🔄 Fetching documents...');
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents`);
      const data = await response.json();
      
      console.log('📄 Documents response:', data);
      
      if (data.success) {
        setDocuments(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} documents`);
      } else {
        setError('Failed to fetch documents');
        setDocuments([]);
      }
    } catch (err) {
      console.error('❌ Error fetching documents:', err);
      setError('Network error while fetching documents');
      setDocuments([]);
    }
  };

  const fetchFolders = async () => {
    try {
      console.log('🔄 Fetching folders...');
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/folders`);
      const data = await response.json();
      
      console.log('📁 Folders response:', data);
      
      if (data.success) {
        setFolders(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} folders`);
      } else {
        console.warn('⚠️ Folders fetch not successful:', data.message);
        setFolders([]);
      }
    } catch (err) {
      console.error('❌ Error fetching folders:', err);
      setError('Network error while fetching folders');
      setFolders([]);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchDocuments(), fetchFolders()]);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Force refresh function
  const forceRefresh = async () => {
    console.log('🔄 Force refreshing data...');
    await fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { 
    documents, 
    folders, 
    loading, 
    error, 
    refetch: fetchAll,
    forceRefresh
  };
};

// File Upload Component
const FileUploader = ({ onFileUpload, selectedFolder }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = ''; // Reset input
  };

  const handleFiles = async (files) => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('Starting upload...');
    
    const token = localStorage.getItem('token');
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder_name', selectedFolder || 'General');
      
      try {
        setUploadStatus(`Uploading ${file.name}...`);
        
        const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });

        if (response.ok) {
          successCount++;
          console.log(`✅ Uploaded: ${file.name}`);
        } else {
          failCount++;
          console.error(`❌ Failed to upload: ${file.name}`);
        }
      } catch (error) {
        failCount++;
        console.error(`❌ Upload error for ${file.name}:`, error);
      }
      
      setUploadProgress(((i + 1) / files.length) * 100);
    }
    
    setUploading(false);
    setUploadProgress(0);
    setUploadStatus('');
    
    // Show results
    if (successCount > 0) {
      setUploadStatus(`✅ Uploaded ${successCount} file${successCount > 1 ? 's' : ''} successfully!`);
      setTimeout(() => setUploadStatus(''), 3000);
      onFileUpload && onFileUpload();
    }
    
    if (failCount > 0) {
      console.warn(`❌ Failed to upload ${failCount} file${failCount > 1 ? 's' : ''}`);
    }
  };

  return (
    <div 
      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
        isDragging 
          ? 'border-blue-400 bg-blue-400/10 scale-105' 
          : 'border-blue-400/50 hover:border-blue-400'
      } ${uploading ? 'pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      <div className="text-center">
        <Upload className={`w-16 h-16 mx-auto mb-4 transition-all duration-300 ${
          isDragging ? 'text-blue-300 scale-110' : uploading ? 'text-green-400 animate-bounce' : 'text-blue-400'
        }`} />
        
        <h3 className="text-xl font-semibold text-white mb-2">
          {isDragging 
            ? 'Drop files here!' 
            : uploading 
            ? `Uploading... ${Math.round(uploadProgress)}%` 
            : 'Drag & Drop Files Here'}
        </h3>
        
        <p className="text-gray-400 mb-4">
          {uploadStatus || (selectedFolder ? `Upload to: ${selectedFolder}` : 'Or click to browse and upload')}
        </p>
        
        {uploading && (
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300 relative" 
              style={{width: `${uploadProgress}%`}}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        )}
        
        <button 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            uploading 
              ? 'bg-green-600 text-white cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
          }`}
          disabled={uploading}
        >
          {uploading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            'Choose Files'
          )}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
        />
      </div>
    </div>
  );
};

// UPDATED CreateFolderModal Component
const CreateFolderModal = ({ isOpen, onClose, onFolderCreated }) => {
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('#3B82F6');
  const [folderIcon, setFolderIcon] = useState('📁');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', 
    '#EF4444', '#6B7280', '#EC4899', '#14B8A6'
  ];

  const icons = ['📁', '📄', '🎓', '🏠', '💼', '🏥', '💰', '✈️', '📱', '🎵', '🎨', '⚡'];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFolderName('');
      setFolderColor('#3B82F6');
      setFolderIcon('📁');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🚀 Creating folder:', folderName); // Debug log
      
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName.trim(),
          color: folderColor,
          icon: folderIcon,
          description: `${folderName.trim()} folder`
        })
      });

      console.log('📊 Response status:', response.status); // Debug log
      
      const result = await response.json();
      console.log('📦 Response data:', result); // Debug log
      
      if (response.ok && result.success) {
        console.log('✅ Folder created successfully');
        handleClose();
        
        // Call the callback with a small delay to ensure server has processed
        setTimeout(() => {
          onFolderCreated && onFolderCreated();
        }, 500);
      } else {
        console.error('❌ Folder creation failed:', result);
        if (response.status === 400 && result.detail) {
          setError(result.detail);
        } else if (response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(result.message || result.detail || `Failed to create folder (${response.status})`);
        }
      }
    } catch (error) {
      console.error('🔥 Network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      setFolderName('');
      setFolderColor('#3B82F6');
      setFolderIcon('📁');
      setLoading(false);
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 w-full max-w-md relative shadow-2xl border border-white/10 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 z-10"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create New Folder</h2>
          <p className="text-gray-400 text-sm">Organize your documents with custom folders</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
            <button 
              onClick={() => setError('')}
              className="text-red-300 hover:text-red-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Folder Name */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Folder Name *
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter folder name"
              required
              maxLength={50}
              disabled={loading}
              autoFocus
            />
            <div className="text-xs text-gray-400 mt-1">
              {folderName.length}/50 characters
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Choose Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => !loading && setFolderIcon(icon)}
                  disabled={loading}
                  className={`p-2 rounded-lg text-xl hover:bg-white/10 transition-colors disabled:opacity-50 ${
                    folderIcon === icon 
                      ? 'bg-blue-600/30 border border-blue-500' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Choose Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => !loading && setFolderColor(color)}
                  disabled={loading}
                  className={`w-10 h-10 rounded-lg transition-all hover:scale-110 disabled:opacity-50 ${
                    folderColor === color ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all"
                style={{ backgroundColor: folderColor }}
              >
                {folderIcon}
              </div>
              <div>
                <div className="text-white font-semibold">
                  {folderName.trim() || 'Folder Name'}
                </div>
                <div className="text-gray-400 text-sm">Preview</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl text-gray-300 border border-gray-600 hover:bg-gray-600/20 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !folderName.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Folder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Search Component
const SearchComponent = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_DOCUMENT_API}/api/v1/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setShowResults(true);
        onSearchResults && onSearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleResultClick = (result) => {
    setShowResults(false);
    // Handle result click - could navigate to file or folder
    console.log('Selected result:', result);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Search documents..."
          className="pl-10 pr-4 py-2 w-64 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:w-80 transition-all duration-300"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {showResults && searchQuery && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-gray-800 rounded-xl border border-white/20 shadow-2xl max-h-64 overflow-y-auto z-50">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div 
                key={index} 
                onClick={() => handleResultClick(result)}
                className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{result.name || result.original_name}</div>
                    <div className="text-gray-400 text-sm">{result.folder_name || 'General'}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-400 text-center">
              No documents found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// File List Component
const FileList = ({ files, folderName, onFileAction }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📋';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
      case 'zip': case 'rar': return '🗜️';
      case 'txt': return '📃';
      default: return '📄';
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
        <div className="text-white font-semibold mb-2 text-xl">No files in this folder</div>
        <div className="text-gray-400">Upload some files to get started</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Files in {folderName} ({files.length})
        </h3>
        <div className="text-sm text-gray-400">
          Total size: {formatFileSize(files.reduce((sum, file) => sum + (file.file_size || 0), 0))}
        </div>
      </div>
      
      <div className="space-y-3">
        {files.map((file, index) => (
          <div key={file._id || index} className="group flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
            {/* File Icon */}
            <div className="text-3xl">
              {getFileIcon(file.name || file.original_name)}
            </div>
            
            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <div className="text-white font-medium truncate">
                  {file.name || file.original_name}
                </div>
                {file.status === 'completed' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{formatFileSize(file.file_size)}</span>
                <span>•</span>
                <span>{formatDate(file.created_at)}</span>
                {file.file_type && (
                  <>
                    <span>•</span>
                    <span className="uppercase">{file.file_type.replace('.', '')}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
              <button 
                onClick={() => onFileAction && onFileAction('view', file)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onFileAction && onFileAction('download', file)}
                className="p-2 text-gray-400 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onFileAction && onFileAction('delete', file)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const { documents, folders, loading, error, refetch, forceRefresh } = useDocuments();

  // Initialize user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (!token) {
      navigate('/');
      return;
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Fetch user info
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserEmail(userData.email);
          if (userData.username) {
            setUsername(userData.username);
            localStorage.setItem('username', userData.username);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // UPDATED folder creation handler
  const handleFolderCreated = async () => {
    console.log('📁 Folder created, refreshing dashboard...');
    
    // Show immediate feedback
    showNotification('Folder created successfully!');
    
    // Force refresh data
    await forceRefresh();
    
    // Additional debug
    console.log('🔍 Current folders after refresh:', folders);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setViewMode('folder');
  };

  const handleBackToDashboard = () => {
    setSelectedFolder(null);
    setViewMode('dashboard');
  };

  const handleFileAction = async (action, file) => {
    switch (action) {
      case 'view':
        showNotification(`Viewing ${file.name}`, 'info');
        // Implement file preview
        break;
      case 'download':
        showNotification(`Downloading ${file.name}`, 'info');
        // Implement file download
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents/${file._id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            if (response.ok) {
              showNotification(`${file.name} deleted successfully`);
              refetch();
            } else {
              showNotification(`Failed to delete ${file.name}`, 'error');
            }
          } catch (error) {
            showNotification('Error deleting file', 'error');
          }
        }
        break;
    }
  };

  // Get documents for selected folder
  const folderDocuments = selectedFolder 
    ? documents.filter(doc => (doc.folder_name || doc.folder_id) === selectedFolder.name)
    : [];

  // Get recent uploads (last 5)
  const recentUploads = documents
    .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()))
    .slice(0, 5);

  // Utility functions
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📋';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
      case 'zip': case 'rar': return '🗜️';
      case 'txt': return '📃';
      default: return '📄';
    }
  };

  // Calculate storage usage (mock data for now)
  const totalStorage = 15 * 1024 * 1024 * 1024; // 15GB
  const usedStorage = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
  const storagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-6 py-3 rounded-xl shadow-2xl border backdrop-blur-sm transition-all duration-300 animate-slide-up ${
              notification.type === 'error' 
                ? 'bg-red-600/20 border-red-500/50 text-red-300' 
                : notification.type === 'info'
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                : 'bg-green-600/20 border-green-500/50 text-green-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : notification.type === 'info' ? (
                <Eye className="w-5 h-5" />
              ) : (
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-white/10 flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">SD</span>
              </div>
              <span className="text-2xl font-bold text-white">SnapDocs</span>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={handleBackToDashboard}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  viewMode === 'dashboard' ? 'text-white bg-blue-600/20' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => setViewMode('all-documents')}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  viewMode === 'all-documents' ? 'text-white bg-blue-600/20' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>All Files ({documents.length})</span>
              </button>
              <button 
                onClick={() => setViewMode('all-folders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  viewMode === 'all-folders' ? 'text-white bg-blue-600/20' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Folder className="w-5 h-5" />
                <span>Folders ({folders.length})</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left">
                <Star className="w-5 h-5" />
                <span>Favorites</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left">
                <Share className="w-5 h-5" />
                <span>Shared</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left">
                <Trash2 className="w-5 h-5" />
                <span>Trash</span>
              </button>
            </nav>
          </div>

          {/* User Profile at bottom */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">{username}</div>
                <div className="text-gray-400 text-sm truncate">{userEmail}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white/10 backdrop-blur-sm border-b border-white/10 p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {(viewMode === 'folder' || viewMode !== 'dashboard') && (
                  <button 
                    onClick={handleBackToDashboard}
                    className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h1 className="text-3xl font-bold text-white">
                  {viewMode === 'folder' && selectedFolder 
                    ? `${selectedFolder.icon} ${selectedFolder.name}`
                    : viewMode === 'all-documents'
                    ? '📄 All Documents'
                    : viewMode === 'all-folders'
                    ? '📁 All Folders'
                    : viewMode === 'recent-uploads'
                    ? '📤 Recent Uploads'
                    : `Welcome back, ${username}! 👋`
                  }
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <SearchComponent />
                <button className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {viewMode === 'dashboard' ? (
                <>
                  {/* Stats Cards - Reduced Size & Clickable */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button 
                      onClick={() => setViewMode('all-documents')}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-105 transition-transform duration-200 text-left hover:bg-white/15"
                    >
                      <div className="flex items-center">
                        <FileText className="w-6 h-6 text-blue-400 mr-3" />
                        <div>
                          <div className="text-xl font-bold text-white">{documents.length}</div>
                          <div className="text-gray-400 text-sm">Total Documents</div>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setViewMode('all-folders')}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-105 transition-transform duration-200 text-left hover:bg-white/15"
                    >
                      <div className="flex items-center">
                        <Folder className="w-6 h-6 text-purple-400 mr-3" />
                        <div>
                          <div className="text-xl font-bold text-white">{folders.length}</div>
                          <div className="text-gray-400 text-sm">Folders</div>
                        </div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setViewMode('recent-uploads')}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-105 transition-transform duration-200 text-left hover:bg-white/15"
                    >
                      <div className="flex items-center">
                        <Upload className="w-6 h-6 text-green-400 mr-3" />
                        <div>
                          <div className="text-xl font-bold text-white">{recentUploads.length}</div>
                          <div className="text-gray-400 text-sm">Recent Uploads</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="lg:col-span-2 space-y-6">
                      <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded"></div>
                        <span>Quick Actions</span>
                      </h2>
                      
                      {/* Upload Area */}
                      <FileUploader onFileUpload={refetch} selectedFolder={selectedFolder?.name} />

                      {/* Folders - IMPROVED UI WITH LARGER ICONS */}
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                            <FolderOpen className="w-7 h-7 text-yellow-400" />
                            <span>Your Folders ({folders.length})</span>
                          </h3>
                          <button 
                            onClick={() => setCreateFolderOpen(true)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                          >
                            <Plus className="w-5 h-5" />
                            <span>New Folder</span>
                          </button>
                        </div>

                        {loading ? (
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                            <div className="text-white">Loading folders...</div>
                          </div>
                        ) : error ? (
                          <div className="bg-red-600/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/50 text-center">
                            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <div className="text-red-300 text-lg font-semibold mb-2">Error Loading Data</div>
                            <div className="text-red-300 mb-4">{error}</div>
                            <button 
                              onClick={forceRefresh}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              Try Again
                            </button>
                          </div>
                        ) : folders && folders.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {folders.map((folder, index) => {
                              const folderDocCount = documents.filter(doc => 
                                (doc.folder_name || doc.folder_id) === folder.name
                              ).length;
                              
                              return (
                                <div 
                                  key={folder._id || index} 
                                  onClick={() => handleFolderClick(folder)}
                                  className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
                                >
                                  {/* LARGE PROMINENT FOLDER ICON */}
                                  <div className="text-center mb-6">
                                    <div 
                                      className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto"
                                      style={{ backgroundColor: folder.color || '#3B82F6' }}
                                    >
                                      {folder.icon || '📁'}
                                    </div>
                                    <div className="text-white font-bold text-xl mb-2 group-hover:text-blue-300 transition-colors">
                                      {folder.name}
                                    </div>
                                    <div className="text-gray-400 text-sm font-medium">
                                      {folderDocCount} file{folderDocCount !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                  
                                  <div className="text-center">
                                    <div className="text-xs text-gray-500 bg-white/5 rounded-full px-3 py-1 inline-block">
                                      Created {new Date(folder.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Folder className="w-16 h-16 text-gray-400" />
                            </div>
                            <div className="text-white font-bold mb-3 text-2xl">No folders yet</div>
                            <div className="text-gray-400 mb-8 text-lg">Create your first folder to organize documents</div>
                            <button 
                              onClick={() => setCreateFolderOpen(true)}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 font-semibold text-lg shadow-lg"
                            >
                              <Plus className="w-5 h-5 inline mr-2" />
                              Create Your First Folder
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-6">
                      {/* Recent Activity */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center space-x-2 mb-4">
                          <Activity className="w-5 h-5 text-green-400" />
                          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                        </div>
                        
                        {recentUploads.length > 0 ? (
                          <div className="space-y-3">
                            {recentUploads.map((doc, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white text-sm font-medium truncate">
                                    {doc.name || doc.original_name}
                                  </div>
                                  <div className="text-gray-400 text-xs">
                                    {doc.folder_name || 'General'} • {new Date(doc.created_at).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Activity className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-gray-400">No recent activity</div>
                          </div>
                        )}
                      </div>

                      {/* Storage Usage */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                          <span>Storage Usage</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Used</span>
                            <span className="text-white font-semibold">
                              {(usedStorage / 1024 / 1024 / 1024).toFixed(1)} GB of 15 GB
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-1000 relative"
                              style={{width: `${Math.min(storagePercentage, 100)}%`}}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {(100 - storagePercentage).toFixed(1)}% available
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Files</span>
                            <span className="text-white font-semibold">{documents.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Folders</span>
                            <span className="text-white font-semibold">{folders.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Avg. File Size</span>
                            <span className="text-white font-semibold">
                              {documents.length > 0 
                                ? `${(usedStorage / documents.length / 1024 / 1024).toFixed(1)} MB`
                                : '0 MB'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : viewMode === 'all-documents' ? (
                /* All Documents View */
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                      <FileText className="w-7 h-7 text-blue-400" />
                      <span>All Documents ({documents.length})</span>
                    </h2>
                    
                    {documents.length > 0 ? (
                      <div className="space-y-3">
                        {documents.map((doc, index) => (
                          <div key={doc._id || index} className="group flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                            <div className="text-3xl">
                              {getFileIcon(doc.name || doc.original_name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3">
                                <div className="text-white font-medium truncate">
                                  {doc.name || doc.original_name}
                                </div>
                                <div className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                                  📁 {doc.folder_name || doc.folder_id || 'General'}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>{formatFileSize(doc.file_size)}</span>
                                <span>•</span>
                                <span>{formatDate(doc.created_at)}</span>
                                {doc.file_type && (
                                  <>
                                    <span>•</span>
                                    <span className="uppercase">{doc.file_type.replace('.', '')}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                              <button 
                                onClick={() => handleFileAction('download', doc)}
                                className="p-2 text-gray-400 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleFileAction('delete', doc)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <div className="text-white font-semibold mb-2 text-xl">No documents yet</div>
                        <div className="text-gray-400 mb-6">Upload your first document to get started</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : viewMode === 'all-folders' ? (
                /* All Folders View */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <Folder className="w-7 h-7 text-purple-400" />
                      <span>All Folders ({folders.length})</span>
                    </h2>
                    <button 
                      onClick={() => setCreateFolderOpen(true)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      <span>New Folder</span>
                    </button>
                  </div>

                  {folders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {folders.map((folder, index) => {
                        const folderDocCount = documents.filter(doc => 
                          (doc.folder_name || doc.folder_id) === folder.name
                        ).length;
                        
                        return (
                          <div 
                            key={folder._id || index} 
                            onClick={() => handleFolderClick(folder)}
                            className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
                          >
                            <div className="text-center">
                              <div 
                                className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto"
                                style={{ backgroundColor: folder.color || '#3B82F6' }}
                              >
                                {folder.icon || '📁'}
                              </div>
                              <div className="text-white font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                                {folder.name}
                              </div>
                              <div className="text-gray-400 text-sm font-medium mb-3">
                                {folderDocCount} file{folderDocCount !== 1 ? 's' : ''}
                              </div>
                              <div className="text-xs text-gray-500 bg-white/5 rounded-full px-3 py-1 inline-block">
                                Created {new Date(folder.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-16 border border-white/20 text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Folder className="w-16 h-16 text-gray-400" />
                      </div>
                      <div className="text-white font-bold mb-3 text-2xl">No folders yet</div>
                      <div className="text-gray-400 mb-8 text-lg">Create your first folder to organize documents</div>
                      <button 
                        onClick={() => setCreateFolderOpen(true)}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 font-semibold text-lg shadow-lg"
                      >
                        <Plus className="w-5 h-5 inline mr-2" />
                        Create Your First Folder
                      </button>
                    </div>
                  )}

                  {/* Files Not in Folders */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                      <FileText className="w-6 h-6 text-orange-400" />
                      <span>Files Not in Folders</span>
                    </h3>
                    
                    {(() => {
                      const filesNotInFolders = documents.filter(doc => 
                        !doc.folder_name || doc.folder_name === 'General' || doc.folder_name === ''
                      );
                      
                      return filesNotInFolders.length > 0 ? (
                        <div className="space-y-3">
                          {filesNotInFolders.map((doc, index) => (
                            <div key={doc._id || index} className="group flex items-center space-x-4 p-4 bg-orange-600/10 rounded-xl hover:bg-orange-600/20 transition-all duration-200">
                              <div className="text-3xl">
                                {getFileIcon(doc.name || doc.original_name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3">
                                  <div className="text-white font-medium truncate">
                                    {doc.name || doc.original_name}
                                  </div>
                                  <div className="px-2 py-1 bg-orange-600/30 text-orange-200 text-xs rounded-full">
                                    📄 Not in folder
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                  <span>{formatFileSize(doc.file_size)}</span>
                                  <span>•</span>
                                  <span>{formatDate(doc.created_at)}</span>
                                  {doc.file_type && (
                                    <>
                                      <span>•</span>
                                      <span className="uppercase">{doc.file_type.replace('.', '')}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                                <button 
                                  onClick={() => handleFileAction('view', doc)}
                                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                                  title="View"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleFileAction('download', doc)}
                                  className="p-2 text-gray-400 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleFileAction('delete', doc)}
                                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="text-green-400 text-4xl">✅</div>
                          </div>
                          <div className="text-white font-semibold mb-2">All files are organized!</div>
                          <div className="text-gray-400">Every file is properly placed in a folder</div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : viewMode === 'recent-uploads' ? (
                /* Recent Uploads View */
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                      <Upload className="w-7 h-7 text-green-400" />
                      <span>Recent Uploads</span>
                    </h2>
                    
                    {recentUploads.length > 0 ? (
                      <div className="space-y-4">
                        {recentUploads.map((doc, index) => (
                          <div key={doc._id || index} className="group flex items-center space-x-4 p-4 bg-green-600/10 rounded-xl hover:bg-green-600/20 transition-all duration-200">
                            <div className="text-3xl">
                              {getFileIcon(doc.name || doc.original_name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3">
                                <div className="text-white font-medium truncate">
                                  {doc.name || doc.original_name}
                                </div>
                                <div className="px-2 py-1 bg-green-600/30 text-green-200 text-xs rounded-full">
                                  🕒 {new Date(doc.created_at).toLocaleString()}
                                </div>
                                <div className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                                  📁 {doc.folder_name || doc.folder_id || 'General'}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span>{formatFileSize(doc.file_size)}</span>
                                {doc.file_type && (
                                  <>
                                    <span>•</span>
                                    <span className="uppercase">{doc.file_type.replace('.', '')}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                              <button 
                                onClick={() => handleFileAction('view', doc)}
                                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleFileAction('download', doc)}
                                className="p-2 text-gray-400 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleFileAction('delete', doc)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Upload className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <div className="text-white font-semibold mb-2 text-xl">No recent uploads</div>
                        <div className="text-gray-400 mb-6">Upload some files to see them here</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Folder View */
                <div className="space-y-6">
                  {/* Folder Header */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div 
                          className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg"
                          style={{ backgroundColor: selectedFolder?.color || '#3B82F6' }}
                        >
                          {selectedFolder?.icon || '📁'}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">{selectedFolder?.name}</h2>
                          <div className="flex items-center space-x-4 text-gray-400">
                            <span>{folderDocuments.length} files</span>
                            <span>•</span>
                            <span>Created {new Date(selectedFolder?.created_at).toLocaleDateString()}</span>
                          </div>
                          {selectedFolder?.description && (
                            <p className="text-gray-300 mt-2">{selectedFolder.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                          <Share className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-xl transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Upload Area for Folder */}
                  <FileUploader onFileUpload={refetch} selectedFolder={selectedFolder?.name} />

                  {/* Files in Folder */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <FileList 
                      files={folderDocuments} 
                      folderName={selectedFolder?.name}
                      onFileAction={handleFileAction}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Folder Modal - UPDATED CALLBACK */}
      <CreateFolderModal 
        isOpen={createFolderOpen} 
        onClose={() => setCreateFolderOpen(false)}
        onFolderCreated={() => {
          refetch();
          showNotification('Folder created successfully!');
        }}
      />
    </div>
  );
};

export default Dashboard;