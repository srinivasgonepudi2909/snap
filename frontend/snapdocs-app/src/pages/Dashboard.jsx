// pages/Dashboard.jsx - COMPLETE FIX FOR DOWNLOAD & NAVIGATION ISSUES
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { useDocuments } from '../hooks/useDocuments';
import useMobile from '../hooks/useMobile';
import { useStorageCalculator } from '../utils/storageUtils';
import { formatDateIST, formatDateByContext, getCurrentDateIST } from '../utils/dateUtils';

import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardViews from '../components/dashboard/DashboardViews';
import CreateFolderModal from '../components/dashboard/CreateFolderModal';
import DeleteConfirmationModal from '../components/dashboard/DeleteConfirmationModal';
import Notifications from '../components/dashboard/Notifications';
import SearchComponent from '../components/dashboard/SearchComponent';
import PopupModal from '../components/dashboard/PopupModal';

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

  // Popup states for operations
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({});

  // Delete confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const { documents, folders, loading, error, refetch, forceRefresh } = useDocuments();
  const storageStats = useStorageCalculator(documents, 15);

  // Show popup notification
  const showOperationPopup = (type, title, message, details = null, autoClose = false, autoCloseDelay = 4000) => {
    setPopupConfig({
      type,
      title,
      message,
      details,
      autoClose,
      autoCloseDelay
    });
    setShowPopup(true);
  };

  // Log unified storage stats for debugging
  useEffect(() => {
    console.log('📊 Dashboard unified storage stats:', {
      totalFiles: storageStats.totalFiles,
      totalFolders: folders.length,
      recentUploads: storageStats.recentUploadsCount,
      usedStorage: storageStats.usedFormatted,
      usagePercentage: storageStats.usagePercentage.toFixed(1) + '%',
      statusText: storageStats.statusText,
      warningLevel: storageStats.warningLevel
    });
  }, [storageStats, folders.length]);

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
    showOperationPopup(
      'success',
      'Folder Created! 📁',
      'Your new folder has been created successfully and is ready to organize your documents.',
      null,
      true
    );
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

  // UPDATED: Enhanced file action handler with download success/error handling
  const handleFileAction = async (action, file) => {
  switch (action) {
    case 'view':
      showNotification(`Viewing ${file.name || file.original_name}`, 'info');
      break;
    case 'download':
      showNotification(`Starting download: ${file.name || file.original_name}`, 'info');
      break;
    case 'download-success':
      // NEW: Show success notification for successful downloads
      const fileName = file.name || file.original_name;
      showOperationPopup(
        'success',
        'Download Successful! 📥',
        `"${fileName}" has been saved to your Downloads folder.`,
        [
          `📄 File: ${fileName}`,
          `📦 Size: ${formatFileSize(file.file_size || file.size || 0)}`,
          `📁 From: ${file.folder_name || file.folder_id || 'General'} folder`,
          `💾 Location: Downloads folder`,
          `🕒 Downloaded: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST`
        ],
        true, // auto-close
        3000
      );
      break;
    case 'download-error':
      // NEW: Show error notification for failed downloads
      const errorFileName = file.name || file.original_name;
      showOperationPopup(
        'error',
        'Download Failed! ❌',
        `Unable to download "${errorFileName}". Please try again or contact support.`,
        [
          `📄 File: ${errorFileName}`,
          `❌ Reason: Network error or file not accessible`,
          `🔄 Try: Refresh the page and try again`,
          `📞 Support: Contact support if problem persists`,
          `🕒 Attempted: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST`
        ]
      );
      break;
    case 'delete':
      // Open custom delete confirmation modal instead of window.confirm
      setFileToDelete(file);
      setDeleteModalOpen(true);
      break;
    default:
      break;
  }
};

  // Handle the actual delete operation
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;

    const fileName = fileToDelete.name || fileToDelete.original_name;
    const fileSize = formatFileSize(fileToDelete.file_size || fileToDelete.size || 0);
    
    try {
      console.log(`🗑️ Attempting to delete file: ${fileName} (ID: ${fileToDelete._id})`);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents/${fileToDelete._id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log(`📊 Delete response status: ${response.status}`);
      const result = await response.json();
      console.log(`📦 Delete response:`, result);

      if (response.ok) {
        // Show success popup
        showOperationPopup(
          'delete',
          'File Deleted Successfully! 🗑️',
          `"${fileName}" has been permanently deleted from your SnapDocs vault.`,
          [
            `📄 File: ${fileName}`,
            `📦 Size: ${fileSize}`,
            `📁 Folder: ${fileToDelete.folder_name || fileToDelete.folder_id || 'General'}`,
            `🕒 Deleted: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST`
          ]
        );
        
        // Refresh data after popup
        setTimeout(() => {
          refetch();
        }, 1000);
        
        console.log(`✅ File deleted successfully: ${fileName}`);
      } else {
        // Show error popup
        showOperationPopup(
          'error',
          'Delete Failed! ❌',
          `Failed to delete "${fileName}". Please try again.`,
          [
            `📄 File: ${fileName}`,
            `❌ Error: ${result.message || result.detail || 'Unknown error'}`,
            `📊 Status: ${response.status}`,
            `🕒 Attempted: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST`
          ]
        );
        console.error(`❌ Delete failed: ${result.message || result.detail}`);
      }
    } catch (error) {
      // Show network error popup
      showOperationPopup(
        'error',
        'Network Error! 🌐',
        `Unable to delete "${fileName}" due to a network error. Please check your connection and try again.`,
        [
          `📄 File: ${fileName}`,
          `🌐 Error: ${error.message}`,
          `🕒 Attempted: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST`
        ]
      );
      console.error(`❌ Network error deleting file:`, error);
    } finally {
      // Reset delete modal state
      setFileToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setFileToDelete(null);
  };

  // Calculate recent uploads using unified calculator
  const recentUploads = storageStats.recentUploads.slice(0, 5);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Updated formatDate function to use IST timezone
  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    
    try {
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
            documentsCount={storageStats.totalFiles}
            foldersCount={folders.length}
            documents={documents}
            folders={folders}
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
              {/* Search Component */}
              <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl relative z-50">
                <SearchComponent
                  documents={documents}
                  folders={folders}
                  onSearchResults={handleSearchResults}
                />
              </div>

              {/* Search Results Indicator */}
              {isSearchActive && (
                <div className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-xl p-4 shadow-lg relative z-40">
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

              {/* Storage Status Banner */}
              {storageStats.warningLevel !== 'low' && (
                <div className={`p-4 rounded-xl border backdrop-blur-md ${
                  storageStats.warningLevel === 'critical'
                    ? 'bg-red-600/20 border-red-500/50 text-red-300'
                    : storageStats.warningLevel === 'high'
                    ? 'bg-orange-600/20 border-orange-500/50 text-orange-300'
                    : 'bg-yellow-600/20 border-yellow-500/50 text-yellow-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {storageStats.warningLevel === 'critical' ? '🚨' : 
                         storageStats.warningLevel === 'high' ? '⚠️' : '📊'}
                      </div>
                      <div>
                        <div className="font-semibold">{storageStats.statusText}</div>
                        <div className="text-sm opacity-90">
                          {storageStats.usedFormatted} of {storageStats.totalFormatted} used 
                          • {storageStats.remainingFormatted} remaining
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {storageStats.usagePercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs opacity-75">Storage Used</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content - Fixed with proper file actions */}
              <div className="space-y-6 relative z-30">
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
                  onFileAction={handleFileAction} // This now handles download-success and download-error
                  formatFileSize={formatFileSize}
                  formatDate={formatDate}
                  getFileIcon={getFileIcon}
                  stats={storageStats}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onFolderCreated={handleFolderCreated}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        file={fileToDelete}
        formatFileSize={formatFileSize}
      />

      {/* Operation Popup Modal - Enhanced with auto-close support */}
      <PopupModal
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        type={popupConfig.type}
        title={popupConfig.title}
        message={popupConfig.message}
        details={popupConfig.details}
        showOkButton={true}
        autoClose={popupConfig.autoClose || false}
        autoCloseDelay={popupConfig.autoCloseDelay || 4000}
      />
    </div>
  );
};

export default Dashboard;