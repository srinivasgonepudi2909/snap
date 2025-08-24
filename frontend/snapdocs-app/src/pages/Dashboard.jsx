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
  X
} from 'lucide-react';

// Custom hook for documents
const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, loading, error, refetch: fetchDocuments };
};

// File Upload Component
const FileUploader = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
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
  };

  const handleFiles = async (files) => {
    setUploading(true);
    const token = localStorage.getItem('token');
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder_name', 'General'); // Default folder
      
      try {
        const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });

        if (response.ok) {
          console.log(`Uploaded: ${file.name}`);
        } else {
          console.error('Upload failed:', await response.text());
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setUploading(false);
    onFileUpload && onFileUpload();
  };

  return (
    <div 
      className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
        isDragging 
          ? 'border-blue-400 bg-blue-400/10' 
          : 'border-blue-400/50 hover:border-blue-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="text-center">
        <Upload className={`w-16 h-16 mx-auto mb-4 transition-colors ${
          isDragging ? 'text-blue-300' : 'text-blue-400'
        }`} />
        <h3 className="text-xl font-semibold text-white mb-2">
          {isDragging ? 'Drop files here!' : uploading ? 'Uploading...' : 'Drag & Drop Files Here'}
        </h3>
        <p className="text-gray-400 mb-4">Or click to browse and upload</p>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Choose Files'}
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

  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', 
    '#EF4444', '#6B7280', '#EC4899', '#14B8A6'
  ];

  const icons = ['📁', '📄', '🎓', '🏠', '💼', '🏥', '💰', '✈️', '📱', '🎵', '🎨', '⚡'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: folderName,
          color: folderColor,
          icon: folderIcon,
          description: `${folderName} folder`
        })
      });

      if (response.ok) {
        onFolderCreated && onFolderCreated();
        onClose();
        setFolderName('');
        setFolderColor('#3B82F6');
        setFolderIcon('📁');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create New Folder</h2>
          <p className="text-gray-400">Organize your documents with custom folders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Folder Name</label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter folder name"
              required
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">Choose Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFolderIcon(icon)}
                  className={`p-3 rounded-xl text-2xl hover:bg-white/10 transition-colors ${
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
                  onClick={() => setFolderColor(color)}
                  className={`w-12 h-12 rounded-xl transition-transform hover:scale-110 ${
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
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: folderColor }}
              >
                {folderIcon}
              </div>
              <div>
                <div className="text-white font-semibold">{folderName || 'Folder Name'}</div>
                <div className="text-gray-400 text-sm">Preview</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !folderName.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Folder'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Search Component
const SearchComponent = () => {
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
              <div key={index} className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{result.name}</div>
                    <div className="text-gray-400 text-sm">{result.folder || 'General'}</div>
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

// Main Dashboard Component
export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const { documents, loading, error, refetch } = useDocuments();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  // Extract unique folder names from documents
  const folders = [...new Set(documents.map((doc) => doc.folder_id || 'Uncategorized'))];
  
  // Get recent uploads (last 5)
  const recentUploads = documents
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-white/10">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">SD</span>
              </div>
              <span className="text-2xl font-bold text-white">SnapDocs</span>
            </div>

            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-white bg-blue-600/20 rounded-lg">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <FileText className="w-5 h-5" />
                <span>All Files</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Folder className="w-5 h-5" />
                <span>Folders</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Star className="w-5 h-5" />
                <span>Favorites</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Share className="w-5 h-5" />
                <span>Shared</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
                <span>Trash</span>
              </a>
            </nav>
          </div>

          {/* User Profile at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
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
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-white/10 backdrop-blur-sm border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {username}! 👋
              </h1>
              
              <div className="flex items-center space-x-4">
                <SearchComponent />
                <button className="p-2 text-gray-300 hover:text-white">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6 overflow-y-auto h-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-400 mr-4" />
                  <div>
                    <div className="text-2xl font-bold text-white">{documents.length}</div>
                    <div className="text-gray-400">Total Documents</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center">
                  <Folder className="w-8 h-8 text-purple-400 mr-4" />
                  <div>
                    <div className="text-2xl font-bold text-white">{folders.length}</div>
                    <div className="text-gray-400">Folders</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
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
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
                
                {/* Upload Area */}
                <div className="mb-6">
                  <FileUploader onFileUpload={refetch} />
                </div>

                {/* Folders */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Your Folders</h3>
                  <button 
                    onClick={() => setCreateFolderOpen(true)}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Folder</span>
                  </button>
                </div>

                {loading ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
                    <div className="text-white">Loading folders...</div>
                  </div>
                ) : error ? (
                  <div className="bg-red-600/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/50 text-center">
                    <div className="text-red-300">Error: {error}</div>
                  </div>
                ) : folders.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {folders.map((folder, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                        <Folder className="w-12 h-12 text-yellow-400 mb-3" />
                        <div className="text-white font-semibold">{folder}</div>
                        <div className="text-gray-400 text-sm">
                          {documents.filter(doc => (doc.folder_id || 'Uncategorized') === folder).length} files
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
                    <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-white font-semibold mb-2">No folders yet</div>
                    <div className="text-gray-400">Create your first folder to organize documents</div>
                  </div>
                )}
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
                        <div key={index} className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium truncate">
                              {doc.name}
                            </div>
                            <div className="text-gray-400 text-xs">
                              Uploaded recently
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400">No recent activity</div>
                    </div>
                  )}
                </div>

                {/* Storage Usage */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">Storage Usage</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Used</span>
                      <span className="text-white">2.1 GB of 15 GB</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '14%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Folder Modal */}
      <CreateFolderModal 
        isOpen={createFolderOpen} 
        onClose={() => setCreateFolderOpen(false)}
        onFolderCreated={refetch}
      />
    </div>
  );
}