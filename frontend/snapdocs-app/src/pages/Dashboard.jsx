// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { useDocuments } from '../hooks/useDocuments';
import useMobile from '../hooks/useMobile';

import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardViews from '../components/dashboard/DashboardViews';
import CreateFolderModal from '../components/dashboard/CreateFolderModal';
import Notifications from '../components/dashboard/Notifications';
import AdvancedSearch from '../components/dashboard/AdvancedSearch';

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
  const [searchResults, setSearchResults] = useState(null);

  const { documents, folders, loading, error, refetch, forceRefresh } = useDocuments();

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
    setViewMode(mode);
    if (mode === 'dashboard') setSelectedFolder(null);
    if (isMobile) setSidebarOpen(false);
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setViewMode('folder');
    if (isMobile) setSidebarOpen(false);
  };

  const handleBackToDashboard = () => {
    setSelectedFolder(null);
    setViewMode('dashboard');
  };

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
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
              showNotification(`${file.name} deleted`);
              refetch();
            } else {
              showNotification(`Failed to delete ${file.name}`, 'error');
            }
          } catch {
            showNotification('Error deleting file', 'error');
          }
        }
        break;
    }
  };

  const recentUploads = documents
    .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()))
    .slice(0, 5);

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
      <Notifications notifications={notifications} />

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen relative">
        <div
          className={`
            fixed z-40 inset-y-0 left-0 transform bg-gray-900 w-64
            transition-transform duration-300 ease-in-out
            ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'relative translate-x-0'}
          `}
        >
          <Sidebar
            viewMode={viewMode}
            documentsCount={documents.length}
            foldersCount={folders.length}
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
            <div className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-md">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <span className="text-lg font-semibold">Welcome, {username}</span>
              <div className="w-6" />
            </div>
          )}

          {!isMobile && (
            <DashboardHeader
              viewMode={viewMode}
              selectedFolder={selectedFolder}
              username={username}
              onBackToDashboard={handleBackToDashboard}
              isMobile={isMobile}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          )}

          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <AdvancedSearch
                documents={documents}
                folders={folders}
                onSearchResults={(res) => setSearchResults(res)}
              />

              <DashboardViews
                viewMode={viewMode}
                documents={searchResults || documents}
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

      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onFolderCreated={handleFolderCreated}
      />
    </div>
  );
};

export default Dashboard;