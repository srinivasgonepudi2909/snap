// pages/Dashboard.jsx (Modularized Version)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import custom hooks
import { useDocuments } from '../hooks/useDocuments';

// Import components
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import DashboardViews from '../components/DashboardViews';
import CreateFolderModal from '../components/CreateFolderModal';
import Notifications from '../components/Notifications';

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

  // Folder creation handler
  const handleFolderCreated = async () => {
    console.log('📁 Folder created, refreshing dashboard...');
    showNotification('Folder created successfully!');
    await forceRefresh();
  };

  // Navigation handlers
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'dashboard') {
      setSelectedFolder(null);
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setViewMode('folder');
  };

  const handleBackToDashboard = () => {
    setSelectedFolder(null);
    setViewMode('dashboard');
  };

  // File action handler
  const handleFileAction = async (action, file) => {
    switch (action) {
      case 'view':
        showNotification(`Viewing ${file.name}`, 'info');
        break;
      case 'download':
        showNotification(`Downloading ${file.name}`, 'info');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Notifications */}
      <Notifications notifications={notifications} />

      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          viewMode={viewMode}
          documentsCount={documents.length}
          foldersCount={folders.length}
          username={username}
          userEmail={userEmail}
          onViewModeChange={handleViewModeChange}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader
            viewMode={viewMode}
            selectedFolder={selectedFolder}
            username={username}
            onBackToDashboard={handleBackToDashboard}
          />

          {/* Dashboard Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <DashboardViews
                viewMode={viewMode}
                documents={documents}
                folders={folders}
                selectedFolder={selectedFolder}
                loading={loading}
                error={error}
                recentUploads={recentUploads}
                onViewModeChange={handleViewModeChange}
                onFolderClick={handleFolderClick}
                onCreateFolder={() => setCreateFolderOpen(true)}
                onRefetch={refetch}
                onForceRefresh={forceRefresh}
                onFileAction={handleFileAction}
                formatFileSize={formatFileSize}
                formatDate={formatDate}
                getFileIcon={getFileIcon}
              />
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
    </div>
  );
};

export default Dashboard;