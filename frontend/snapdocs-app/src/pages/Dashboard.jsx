// pages/Dashboard.jsx - FIXED WITH ENHANCED DOWNLOAD FUNCTIONALITY
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Download, AlertCircle, CheckCircle } from 'lucide-react';

import { useDocuments } from '../hooks/useDocuments';
import useMobile from '../hooks/useMobile';
import { useStorageCalculator } from '../utils/storageUtils';

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

  // Download states
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());

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

  // Initialize user session
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

  // ENHANCED DOWNLOAD HANDLER - Multiple methods for maximum compatibility
  const handleDownloadFile = async (file) => {
  const fileName = file.name || file.original_name;
  const fileId = file._id;
  
  if (downloadingFiles.has(fileId)) {
    console.log('⏳ Download already in progress for:', fileName);
    return;
  }

  console.log('📥 Starting ENHANCED download for:', fileName);
  setDownloadingFiles(prev => new Set([...prev, fileId]));
  
  try {
    const token = localStorage.getItem('token');
    const baseUrl = process.env.REACT_APP_DOCUMENT_API || 'http://localhost:8001';
    
    // ENHANCED: Multiple download methods for maximum compatibility
    const downloadMethods = [
      {
        name: 'API Download Endpoint',
        url: `${baseUrl}/api/v1/documents/${file._id}/download`,
        requiresAuth: true,
        method: 'blob'
      },
      {
        name: 'Direct File Download',
        url: `${baseUrl}/api/v1/files/${file.unique_name}/download`,
        requiresAuth: false,
        method: 'blob'
      },
      {
        name: 'Static File Forced Download',
        url: `${baseUrl}/files/${file.unique_name}`,
        requiresAuth: false,
        method: 'link'
      }
    ].filter(method => method.url.includes('undefined') === false);

    console.log(`🔗 Available download methods: ${downloadMethods.length}`);
    
    let downloadSuccess = false;
    let lastError = null;

    // Try each download method
    for (let i = 0; i < downloadMethods.length; i++) {
      const method = downloadMethods[i];
      console.log(`🔄 Attempting method ${i + 1}: ${method.name}`);

      try {
        if (method.method === 'blob') {
          // Method A: Blob download with forced headers
          const fetchOptions = {
            method: 'GET',
            headers: {
              'Accept': 'application/octet-stream', // Force binary
              'Cache-Control': 'no-cache'
            }
          };

          if (method.requiresAuth && token) {
            fetchOptions.headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(method.url, fetchOptions);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          // Check if response is actually a file (not an error page)
          const contentType = response.headers.get('content-type') || '';
          const contentLength = response.headers.get('content-length');
          
          console.log(`📦 Response: ${contentType}, Length: ${contentLength}`);
          
          // Get the blob
          const blob = await response.blob();
          
          if (blob.size === 0) {
            throw new Error('Received empty file');
          }

          // CRITICAL: Create download with forced filename
          const blobUrl = URL.createObjectURL(blob);
          
          // Create invisible download link
          const downloadLink = document.createElement('a');
          downloadLink.style.display = 'none';
          downloadLink.href = blobUrl;
          downloadLink.download = fileName; // Force download with correct filename
          downloadLink.setAttribute('download', fileName); // Extra enforcement
          
          // Add to DOM and trigger download
          document.body.appendChild(downloadLink);
          downloadLink.click();
          
          // Cleanup
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(blobUrl);
          
          console.log(`✅ Blob download successful via ${method.name}`);
          downloadSuccess = true;
          break;
          
        } else if (method.method === 'link') {
          // Method B: Direct link download
          const downloadLink = document.createElement('a');
          downloadLink.style.display = 'none';
          downloadLink.href = method.url;
          downloadLink.download = fileName;
          downloadLink.setAttribute('download', fileName);
          downloadLink.target = '_blank';
          downloadLink.rel = 'noopener noreferrer';
          
          // Force download by setting special attributes
          downloadLink.type = 'application/octet-stream';
          
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          console.log(`✅ Link download initiated via ${method.name}`);
          downloadSuccess = true;
          break;
        }

      } catch (methodError) {
        console.warn(`❌ Method ${method.name} failed:`, methodError.message);
        lastError = methodError;
        continue;
      }
    }

    if (downloadSuccess) {
      // Show success notification
      showOperationPopup(
        'success',
        'Download Started! 📥',
        `"${fileName}" is being downloaded to your computer.`,
        [
          `📄 File: ${fileName}`,
          `📦 Size: ${formatFileSize(file.file_size || file.size || 0)}`,
          `📁 From: ${file.folder_name || file.folder_id || 'General'} folder`,
          `💾 Check your browser's Downloads folder`,
          `🕒 Downloaded: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST`
        ],
        true,
        4000
      );

      showNotification(`Download started: ${fileName}`, 'success');
      
    } else {
      // All methods failed - show comprehensive error
      throw new Error(`All download methods failed. Last error: ${lastError?.message || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('❌ Download completely failed:', error);
    
    // Show error with alternative solutions
    showOperationPopup(
      'error',
      'Download Failed! ❌',
      `Unable to download "${fileName}". Try these alternatives:`,
      [
        `📄 File: ${fileName}`,
        `❌ Error: ${error.message}`,
        ``,
        `🔧 Alternative Solutions:`,
        `1. Right-click the file → "Save link as..."`,
        `2. Try opening file in new tab, then Ctrl+S`,
        `3. Check browser's download settings`,
        `4. Disable popup blockers for this site`,
        `5. Try using a different browser`,
        ``,
        `💡 File URLs for manual download:`,
        file.unique_name ? `• ${process.env.REACT_APP_DOCUMENT_API}/files/${file.unique_name}` : '',
        file._id ? `• ${process.env.REACT_APP_DOCUMENT_API}/api/v1/documents/${file._id}/download` : ''
      ].filter(Boolean)
    );

    showNotification(`Download failed: ${fileName}`, 'error');
    
  } finally {
    // Remove from downloading set
    setDownloadingFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
  }
};

  // Handle search results
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
    console.log('🏠 Navigating back to dashboard home');
    setSelectedFolder(null);
    setViewMode('dashboard');
    setSearchResults([]);
    setIsSearchActive(false);
    if (isMobile) {
      setSidebarOpen(false);
    }
    console.log('✅ Successfully navigated back to dashboard home');
  };

  // ENHANCED FILE ACTION HANDLER with improved download integration
  const handleFileAction = async (action, file) => {
  console.log('🎬 File action triggered:', action, 'for file:', file.name || file.original_name);
  
  switch (action) {
    case 'preview':
    case 'view':
      // FIXED: Preview opens file in new tab for viewing
      console.log('👁️ Opening file in new tab for preview:', file.name || file.original_name);
      
      const baseUrl = process.env.REACT_APP_DOCUMENT_API || 'http://localhost:8001';
      let previewUrl;
      
      if (file.unique_name) {
        previewUrl = `${baseUrl}/files/${file.unique_name}`;
      } else if (file._id) {
        previewUrl = `${baseUrl}/api/v1/documents/${file._id}/stream`;
      }
      
      if (previewUrl) {
        console.log('🔗 Preview URL:', previewUrl);
        
        const newWindow = window.open(previewUrl, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          showNotification('Please allow popups to preview files in new tabs', 'error');
        } else {
          showNotification(`Opened ${file.name || file.original_name} in new tab`, 'info');
        }
      } else {
        showNotification('Preview not available for this file', 'error');
      }
      break;
        
    case 'download':
      // FIXED: Download forces file download to browser's download folder
      console.log('📥 FORCING file download:', file.name || file.original_name);
      await handleDownloadFile(file);
      break;
        
    case 'delete':
      // Open delete confirmation modal
      console.log('🗑️ Opening delete confirmation for:', file.name || file.original_name);
      setFileToDelete(file);
      setDeleteModalOpen(true);
      break;
        
    default:
      console.warn('❓ Unknown file action:', action);
      showNotification(`Unknown action: ${action}`, 'error');
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
      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
      
      <Notifications notifications={notifications} />

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
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
            onFolderClick={handleFolderClick}
          />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
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

              {/* ENHANCED DOWNLOAD INFO BANNER */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-400/30 rounded-xl p-4 shadow-lg relative z-40">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Download className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-green-200 font-semibold mb-1">Enhanced Download System Enabled!</div>
                    <div className="text-green-300 text-sm">
                      🔗 Click any file to open in new tab • 📥 Use download button for direct downloads with multiple fallback methods • 
                      Files will be saved to your default downloads folder
                    </div>
                  </div>
                  <div className="text-green-400 animate-pulse">📥</div>
                </div>
                
                {/* Active Downloads Indicator */}
                {downloadingFiles.size > 0 && (
                  <div className="mt-3 p-2 bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-200 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
                      <span>
                        {downloadingFiles.size} download{downloadingFiles.size > 1 ? 's' : ''} in progress...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content with enhanced download support */}
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
                  onFileAction={handleFileAction}
                  onBackToDashboard={handleBackToDashboard}
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

      {/* Modals */}
      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onFolderCreated={handleFolderCreated}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        file={fileToDelete}
        formatFileSize={formatFileSize}
      />

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