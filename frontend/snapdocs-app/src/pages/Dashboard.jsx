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
  MoreVertical,
  Eye,
  Edit3,
  AlertCircle
} from 'lucide-react';

// Custom hook for documents and folders
const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents`);
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.data || []);
      } else {
        setError('Failed to fetch documents');
        setDocuments([]);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Network error');
      setDocuments([]);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/folders`);
      const data = await response.json();
      
      if (data.success) {
        setFolders(data.data || []);
      } else {
        setFolders([]);
      }
    } catch (err) {
      console.error('Error fetching folders:', err);
      setFolders([]);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchDocuments(), fetchFolders()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { documents, folders, loading, error, refetch: fetchAll };
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

// Folder Creation Modal
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: folderName.trim(),
          color: folderColor,
          icon: folderIcon,
          description: `${folderName.trim()} folder`
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        onFolderCreated && onFolderCreated();
        onClose();
        setFolderName('');
        setFolderColor('#3B82F6');
        setFolderIcon('📁');
        setError('');
      } else {
        setError(result.message || 'Failed to create folder');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFolderName('');
      setFolderColor('#3B82F6');
      setFolderIcon('📁');
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10 animate-scale-in">
        <button 
          onClick={handleClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create New Folder</h2>
          <p className="text-gray-400">Organize your documents with custom folders</p>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Folder Name *</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter folder name"
              required
              maxLength={50}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Choose Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => !loading && setFolderIcon(icon)}
                  disabled={loading}
                  className={`p-3 rounded-xl text-2xl hover:bg-white/10 transition-colors disabled:opacity-50 ${
                    folderIcon === icon ? 'bg-blue-600/30 border border-blue-500' : 'bg-white/5'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Choose Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => !loading && setFolderColor(color)}
                  disabled={loading}
                  className={`w-12 h-12 rounded-xl transition-transform hover:scale-110 disabled:opacity-50 ${
                    folderColor === color ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all"
                style={{ backgroundColor: folderColor }}
              >
                {folderIcon}
              </div>
              <div>
                <div className="text-white font-semibold">{folderName.trim() || 'Folder Name'}</div>
                <div className="text-gray-400 text-sm">Preview</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !folderName.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Creating...</span>
              </div>
            ) : (
              'Create Folder'
            )}
          </button>
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
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
        <div className="text-white font-semibold mb-2 text-xl">No files in this folder</div>
        <div className="text-gray-400">Upload some files to get started</div>
      </div>
    );
  }

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
export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'folder'
  const [notifications, setNotifications] = useState([]);
  const { documents, folders, loading, error, refetch } = useDocuments();

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
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left">
                <FileText className="w-5 h-5" />
                <span>All Files ({documents.length})</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left">
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
                {viewMode === 'folder' && (
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
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-blue-400 mr-4" />
                        <div>
                          <div className="text-2xl font-bold text-white">{documents.length}</div>
                          <div className="text-gray-400">Total Documents</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center">
                        <Folder className="w-8 h-8 text-purple-400 mr-4" />
                        <div>
                          <div className="text-2xl font-bold text-white">{folders.length}</div>
                          <div className="text-gray-400">Folders</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform duration-200">
                      <div className="flex items-center">
                        <Upload className="w-8 h-8 text-green-400 mr-4" />
                        <div>
                          <div className="text-2xl font-bold text-white">{recentUploads.length}</div>
                          <div className="text-gray-400">Recent Uploads</div>
                        </div>
                      </div>
                    </div>
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

                      {/* Folders */}
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                            <FolderOpen className="w-6 h-6 text-yellow-400" />
                            <span>Your Folders</span>
                          </h3>
                          <button 
                            onClick={() => setCreateFolderOpen(true)}
                            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                          >
                            <Plus className="w-4 h-4" />
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
                            <div className="text-red-300">{error}</div>
                            <button 
                              onClick={refetch}
                              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              Try Again
                            </button>
                          </div>
                        ) : folders.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {folders.map((folder, index) => {
                              const folderDocCount = documents.filter(doc => 
                                (doc.folder_name || doc.folder_id) === folder.name
                              ).length;
                              
                              return (
                                <div 
                                  key={folder._id || index} 
                                  onClick={() => handleFolderClick(folder)}
                                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer group hover:scale-105"
                                >
                                  <div 
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-200"
                                    style={{ backgroundColor: folder.color || '#F59E0B' }}
                                  >
                                    {folder.icon || '📁'}
                                  </div>
                                  <div className="text-white font-semibold text-lg mb-1">{folder.name}</div>
                                  <div className="text-gray-400 text-sm">
                                    {folderDocCount} file{folderDocCount !== 1 ? 's' : ''}
                                  </div>
                                  <div className="mt-2 text-xs text-gray-500">
                                    Created {new Date(folder.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
                            <Folder className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                            <div className="text-white font-semibold mb-2 text-xl">No folders yet</div>
                            <div className="text-gray-400 mb-6">Create your first folder to organize documents</div>
                            <button 
                              onClick={() => setCreateFolderOpen(true)}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
                            >
                              Create Folder
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
              ) : (
                /* Folder View */
                <div className="space-y-6">
                  {/* Folder Header */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div 
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
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

      {/* Create Folder Modal */}
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
}