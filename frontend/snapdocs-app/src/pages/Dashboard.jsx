// pages/Dashboard.jsx - UPDATED WITH DYNAMIC STATS INTEGRATION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { useDocuments } from '../hooks/useDocuments';
import useMobile from '../hooks/useMobile';

// Import IST date utilities
import { formatDateIST, formatDateByContext, getCurrentDateIST } from '../utils/dateUtils';

import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardViews from '../components/dashboard/DashboardViews';
import CreateFolderModal from '../components/dashboard/CreateFolderModal';
import Notifications from '../components/dashboard/Notifications';
import SearchComponent from '../components/dashboard/SearchComponent';

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  
  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const { documents, folders, loading, error, refetch, forceRefresh } = useDocuments();

  // Calculate dynamic stats
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalFolders: 0,
    recentUploads: 0,
    totalStorage: 0,
    usedStorage: 0,
    averageFileSize: 0
  });

  // Update stats whenever documents or folders change
  useEffect(() => {
    const calculateStats = () => {
      // Calculate total storage used
      const usedStorage = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
      
      // Calculate recent uploads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentUploads = documents.filter(doc => {
        if (!doc.created_at) return false;
        const docDate = new Date(doc.created_at);
        return docDate >= sevenDaysAgo;
      }).length;

      // Calculate average file size
      const averageFileSize = documents.length > 0 ? usedStorage / documents.length : 0;

      setStats({
        totalDocuments: documents.length,
        totalFolders: folders.length,
        recentUploads: recentUploads,
        totalStorage: 15 * 1024 * 1024 * 1024, // 15GB
        usedStorage: usedStorage,
        averageFileSize: averageFileSize
      });

      console.log('📊 Updated stats:', {
        documents: documents.length,
        folders: folders.length,
        recentUploads,
        usedStorage: `${(usedStorage / 1024 / 1024).toFixed(1)} MB`,
        averageFileSize: `${(averageFileSize / 1024).toFixed(1)} KB`
      });
    };

    calculateStats();
  }, [documents, folders]);

  useEffect(() => {
    console.log('📊 Dashboard documents updated:', documents.length);
    documents.forEach(doc => {
      console.log('📄 Document:', doc.name || doc.original_name, 'Size:', doc.file_size, 'Folder:', doc.folder_name || doc.folder_id);
    });
  }, [documents]);

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

  const handleSearchResults = (results) => {
    console.log('🔍 Dashboard received search results:', results.length);
    setSearchResults(results);
    setIsSearchActive(results.length > 0);
    
    if (results.length > 0 && viewMode === 'dashboard') {
      console.log('✅ Search results available, showing search results');
    } else if (results.length === 0) {
      setIsSearchActive(false);
      console.log('❌ No search results, clearing search state');
    }
  };

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleFolderCreated = async () => {
    showNotification('Folder created successfully!');
    await forceRefresh();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleViewModeChange = (mode) => {
    console.log('🔄 Changing view mode to:', mode);
    setViewMode(mode);
    setSearchResults([]);
    setIsSearchActive(false);
    if (mode === 'dashboard') setSelectedFolder(null);
    if (isMobile) setSidebarOpen(false);
  };

  const handleFolderClick = (folder) => {
    console.log('📁 Opening folder:', folder.name);
    setSelectedFolder(folder);
    setViewMode('folder');
    setSearchResults([]);
    setIsSearchActive(false);
    if (isMobile) setSidebarOpen(false);
  };

  const handleBackToDashboard = () => {
    console.log('🏠 Going back to dashboard');
    setSelectedFolder(null);
    setViewMode('dashboard');
    setSearchResults([]);
    setIsSearchActive(false);
  };

  const handleFileAction = async (action, file) => {
    switch (action) {
      case 'view':
        showNotification(`Viewing ${file.name || file.original_name}`, 'info');
        break;
      case 'download':
        showNotification(`Downloading ${file.name || file.original_name}`, 'info');
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${file.name || file.original_name}?`)) {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents/${file._id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
              showNotification(`${file.name || file.original_name} deleted`);
              refetch();
            } else {
              showNotification(`Failed to delete ${file.name || file.original_name}`, 'error');
            }
          } catch {
            showNotification('Error deleting file', 'error');
          }
        }
        break;
    }
  };

  // Calculate recent uploads dynamically
  const recentUploads = documents
    .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()))
    .slice(0, 5);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  };

  // Updated formatDate function to use IST timezone
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    
    try {
      // Convert to IST and format
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Kolkata'
      });
    } catch (error) {
      console.error('Error formatting date to IST:', error);
      return 'Invalid date';
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📋';
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'webp': case 'svg': return '🖼️';
      case 'zip': case 'rar': return '🗜️';
      case 'txt': return '📃';
      case 'mp3': case 'wav': case 'flac': return '🎵';
      case 'mp4': case 'avi': case 'mkv': return '🎬';
      default: return '📄';
    }
  };

  const getCurrentDocuments = () => {
    console.log('🔍 getCurrentDocuments - isSearchActive:', isSearchActive, 'searchResults:', searchResults.length, 'total documents:', documents.length);
    
    if (isSearchActive && searchResults.length > 0) {
      console.log('✅ Returning search results');
      return searchResults;
    }
    
    console.log('✅ Returning all documents');
    return documents;
  };

  const getSearchQuery = () => {
    return isSearchActive ? 'search-active' : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Grafana-style background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
      
      <Notifications notifications={notifications} />

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen relative z-10">
        <div
          className={`
            fixed z-40 inset-y-0 left-0 transform 
            bg-gray-900/80 backdrop-blur-md border-r border-gray-700/50 w-64
            transition-transform duration-300 ease-in-out
            ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'relative translate-x-0'}
          `}
        >
          <Sidebar
            viewMode={viewMode}
            documentsCount={stats.totalDocuments}
            foldersCount={stats.totalFolders}
            username={username}
            userEmail={userEmail}
            onViewModeChange={handleViewModeChange}
            onLogout={handleLogout}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          {isMobile && (
            <div className="p-4 flex items-center justify-between bg-gray-900/80 backdrop-blur-md text-white shadow-xl border-b border-gray-700/50">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <span className="text-lg font-semibold">Welcome, {username}</span>
              <div className="w-6" />
            </div>
          )}

          <DashboardHeader
            viewMode={viewMode}
            selectedFolder={selectedFolder}
            username={username}
            onBackToDashboard={handleBackToDashboard}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Grafana-style Search Component */}
              <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl">
                <SearchComponent
                  documents={documents}
                  folders={folders}
                  onSearchResults={handleSearchResults}
                />
              </div>

              {/* Search Results Indicator with IST timestamp */}
              {isSearchActive && (
                <div className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-blue-200 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>🔍 Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
                      <span className="text-xs text-blue-300">
                        ({new Date().toLocaleTimeString('en-US', { 
                          timeZone: 'Asia/Kolkata', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} IST)
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSearchResults([]);
                        setIsSearchActive(false);
                      }}
                      className="text-blue-300 hover:text-blue-200 underline transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}

              {/* Main Content with Grafana styling */}
              <div className="space-y-6">
                <DashboardViews
                  viewMode={viewMode}
                  documents={getCurrentDocuments()}
                  folders={folders}
                  selectedFolder={selectedFolder}
                  loading={loading}
                  error={error}
                  recentUploads={recentUploads}
                  searchQuery={getSearchQuery()}
                  searchResults={searchResults}
                  onViewModeChange={handleViewModeChange}
                  onFolderClick={handleFolderClick}
                  onCreateFolder={() => setCreateFolderOpen(true)}
                  onRefetch={refetch}
                  onForceRefresh={forceRefresh}
                  onFileAction={handleFileAction}
                  formatFileSize={formatFileSize}
                  formatDate={formatDate}
                  getFileIcon={getFileIcon}
                  // Pass dynamic stats
                  stats={stats}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onFolderCreated={handleFolderCreated}
      />
    </div>
  );
};

export default Dashboard;