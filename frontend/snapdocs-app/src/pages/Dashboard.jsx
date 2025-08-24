import React, { useState, useEffect } from 'react';
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
  Activity
} from 'lucide-react';

// Custom hook for documents
const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchDocuments();
  }, []);

  return { documents, loading, error };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { documents, loading, error } = useDocuments();

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
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
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
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-6 border-dashed border-blue-400/50 hover:border-blue-400 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Drag & Drop Files Here</h3>
                    <p className="text-gray-400 mb-4">Or click to browse and upload</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                      Choose Files
                    </button>
                  </div>
                </div>

                {/* Folders */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Your Folders</h3>
                  <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
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
    </div>
  );
}