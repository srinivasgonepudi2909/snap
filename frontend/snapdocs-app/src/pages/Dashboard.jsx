// pages/Dashboard.jsx - EMERGENCY FIX - BASIC VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, FileText, Folder, Upload, Settings, Home, Star, Share, Trash2, User, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    // Fetch data
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch documents
      const documentsResponse = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents`);
      const documentsData = await documentsResponse.json();
      
      if (documentsData.success) {
        setDocuments(documentsData.data || []);
      }

      // Fetch folders
      const foldersResponse = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/folders`);
      const foldersData = await foldersResponse.json();
      
      if (foldersData.success) {
        setFolders(foldersData.data || []);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString();
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    const ext = fileName.split('.').pop()?.toLowerCase();
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-xl">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl mb-4">Error: {error}</div>
          <button 
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          className={`
            bg-gray-900/50 backdrop-blur-sm border-r border-white/10 flex flex-col w-64
            fixed lg:relative z-40 inset-y-0 left-0 transform transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6 flex-1 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">SD</span>
              </div>
              <span className="text-2xl font-bold text-white">SnapDocs</span>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white bg-blue-600/20">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                <FileText className="w-5 h-5" />
                <span>All Files ({documents.length})</span>
              </div>
              <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                <Folder className="w-5 h-5" />
                <span>Folders ({folders.length})</span>
              </div>
              <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                <Star className="w-5 h-5" />
                <span>Favorites</span>
              </div>
            </nav>
          </div>

          {/* User Profile */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">{username}</div>
                <div className="text-gray-400 text-sm">User</div>
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
          <header className="bg-white/10 backdrop-blur-sm border-b border-white/10 p-4 lg:p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors lg:hidden"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  Welcome back, {username}! 👋
                </h1>
              </div>
              <button className="p-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{documents.length}</div>
                    <div className="text-gray-400 text-sm">Total Documents</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center mr-4">
                    <Folder className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{folders.length}</div>
                    <div className="text-gray-400 text-sm">Folders</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center mr-4">
                    <Upload className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {documents.slice(0, 5).length}
                    </div>
                    <div className="text-gray-400 text-sm">Recent Uploads</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Files */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <FileText className="w-7 h-7 text-green-400" />
                <span>Recent Files</span>
              </h2>
              
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.slice(0, 10).map((doc, index) => (
                    <div key={doc._id || index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                      <div className="text-3xl flex-shrink-0">
                        {getFileIcon(doc.name || doc.original_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate mb-1">
                          {doc.name || doc.original_name}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.created_at)}</span>
                          <span>•</span>
                          <span>📁 {doc.folder_name || 'General'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <div className="text-white font-semibold mb-2 text-xl">No files yet</div>
                  <div className="text-gray-400">Upload your first file to get started</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;