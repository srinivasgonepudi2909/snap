// components/dashboard/DashboardViews.jsx - FIXED FILE ACTIONS AND NAVIGATION
import React from 'react';
import PropTypes from 'prop-types';
import { FileText, Folder, Upload, Plus, Eye, Download, Trash2, AlertCircle, Home, ExternalLink } from 'lucide-react';
import StatsCards from './StatsCards';
import FolderGrid from './FolderGrid';
import ActivityPanel from './ActivityPanel';
import FileUploader from './FileUploader';
import FileList from './FileList';
import useFilePreview from '../../hooks/useFilePreview';
import FilePreviewModal from './FilePreviewModal';

// Enhanced FileCard Component with FIXED Actions
const FileCard = ({ doc, onPreview, onDownload, onDelete, formatFileSize, formatDate, getFileIcon }) => {
  
  // FIXED: Separate handlers for each action
  const handlePreviewClick = (e) => {
    e.stopPropagation();
    console.log('👁️ Eye button clicked - Opening file in new tab:', doc.name || doc.original_name);
    
    // Generate file URL for new tab
    const baseUrl = process.env.REACT_APP_DOCUMENT_API || 'http://localhost:8001';
    let fileUrl;
    
    if (doc.unique_name) {
      fileUrl = `${baseUrl}/files/${doc.unique_name}`;
    } else if (doc._id) {
      fileUrl = `${baseUrl}/api/v1/documents/${doc._id}/download`;
    } else {
      console.error('❌ No file URL available for preview');
      return;
    }
    
    // Open file in new tab
    const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow) {
      console.error('❌ Failed to open new tab - popup blocked?');
      alert('Please allow popups for this site to preview files');
    } else {
      console.log('✅ File opened in new tab successfully');
    }
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    console.log('📥 Download button clicked:', doc.name || doc.original_name);
    onDownload(doc);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    console.log('🗑️ Delete button clicked:', doc.name || doc.original_name);
    onDelete(doc);
  };

  const handleCardClick = (e) => {
    // FIXED: Card click now does nothing or shows info, not preview
    console.log('📄 File card clicked (no action):', doc.name || doc.original_name);
  };

  return (
    <div className="group relative bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden hover:transform hover:scale-[1.02] hover:shadow-2xl">
      {/* Main clickable area - FIXED: Now just for selection/info */}
      <div 
        className="aspect-square p-4 cursor-pointer flex flex-col items-center justify-center text-center relative"
        onClick={handleCardClick}
      >
        {/* File Icon */}
        <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {getFileIcon(doc.name || doc.original_name)}
        </div>
        
        {/* File Name */}
        <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-blue-300 transition-colors leading-tight">
          {doc.name || doc.original_name}
        </h3>
        
        {/* File Info */}
        <div className="text-xs text-gray-400 mt-2 space-y-1">
          <div>📦 {formatFileSize(doc.file_size)}</div>
          <div>🕒 {formatDate(doc.created_at)}</div>
        </div>
      </div>
      
      {/* FIXED: Action Buttons with Proper Event Handlers */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1">
        {/* FIXED: Eye button opens new tab */}
        <button
          onClick={handlePreviewClick}
          className="p-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg"
          title="Open in New Tab"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        
        {/* FIXED: Download button downloads file */}
        <button
          onClick={handleDownloadClick}
          className="p-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg transition-colors shadow-lg"
          title="Download File"
        >
          <Download className="w-4 h-4" />
        </button>
        
        {/* Delete button */}
        <button
          onClick={handleDeleteClick}
          className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
          title="Delete File"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Folder Badge */}
      {doc.folder_name && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
          📁 {doc.folder_name}
        </div>
      )}
      
      {/* File Status Indicators */}
      <div className="absolute bottom-2 right-2 flex space-x-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Preview available"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full" title="Download available"></div>
      </div>
    </div>
  );
};

// Enhanced FileGrid Component with FIXED Actions
const FileGrid = ({ documents, onFileAction, formatFileSize, formatDate, getFileIcon, title = "Files", showCreateHint = false }) => {
  
  // FIXED: Separate handlers for different actions
  const handlePreview = (file) => {
    console.log('🔍 FileGrid preview action:', file.name || file.original_name);
    // This will open file in new tab
    onFileAction('preview', file);
  };
  
  const handleDownload = (file) => {
    console.log('📥 FileGrid download action:', file.name || file.original_name);
    // This will download the file
    onFileAction('download', file);
  };
  
  const handleDelete = (file) => {
    console.log('🗑️ FileGrid delete action:', file.name || file.original_name);
    // This will show delete confirmation
    onFileAction('delete', file);
  };

  if (documents.length === 0 && showCreateHint) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
        <div className="text-white font-semibold mb-2 text-xl">No files yet</div>
        <div className="text-gray-400 mb-6">Upload your first file to see it here</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <span>{title} ({documents.length})</span>
            {documents.length > 0 && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Click eye icon to preview files"></div>
            )}
          </h3>
        </div>
      )}
      
      {/* Grid Layout for Files */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {documents.map((doc, index) => (
          <FileCard
            key={doc._id || index}
            doc={doc}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onDelete={handleDelete}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
            getFileIcon={getFileIcon}
          />
        ))}
      </div>
      
      {/* Usage Instructions */}
      {documents.length > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center space-x-2 text-sm text-blue-200">
            <ExternalLink className="w-4 h-4" />
            <span>Click the eye icon (🔗) to open files in new tab • Use download (📥) and delete (🗑️) buttons for respective actions</span>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardViews = ({
  viewMode,
  documents,
  folders,
  selectedFolder,
  loading,
  error,
  recentUploads,
  searchQuery,
  searchResults,
  stats = {},
  onViewModeChange,
  onFolderClick,
  onCreateFolder,
  onRefetch,
  onForceRefresh,
  onFileAction,
  onBackToDashboard,
  formatFileSize,
  formatDate,
  getFileIcon
}) => {
  // Initialize preview hook (not used for new tab approach, but kept for compatibility)
  const {
    isPreviewOpen,
    currentFile,
    currentIndex,
    openPreview,
    closePreview,
    navigatePreview
  } = useFilePreview();

  // Check if we're showing search results
  const isSearchActive = searchQuery === 'search-active';
  
  // FIXED: Enhanced file action handler
  const handleFileAction = async (action, file) => {
    console.log('🎬 DashboardViews file action:', action, 'for file:', file.name || file.original_name);
    
    if (action === 'preview' || action === 'view') {
      // FIXED: Open file in new tab instead of modal
      console.log('🔗 Opening file in new tab:', file.name || file.original_name);
      
      const baseUrl = process.env.REACT_APP_DOCUMENT_API || 'http://localhost:8001';
      let fileUrl;
      
      if (file.unique_name) {
        fileUrl = `${baseUrl}/files/${file.unique_name}`;
      } else if (file._id) {
        fileUrl = `${baseUrl}/api/v1/documents/${file._id}/download`;
      } else {
        console.error('❌ No file URL available');
        return;
      }
      
      console.log('🌐 Opening URL:', fileUrl);
      
      // Open in new tab
      const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        console.error('❌ Failed to open new tab - popup blocked?');
        alert('Please allow popups for this site to preview files in new tabs');
      } else {
        console.log('✅ File opened in new tab successfully');
      }
      
    } else {
      // Pass other actions (like download, delete) to the parent handler
      onFileAction(action, file);
    }
  };

  // Handle back to dashboard from preview (still needed for compatibility)
  const handleBackToDashboardFromPreview = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      onViewModeChange('dashboard');
    }
  };

  // Handle delete from preview modal (still needed for compatibility)
  const handleDeleteFromPreview = (file) => {
    closePreview(); // Close preview first
    setTimeout(() => {
      onFileAction('delete', file);
    }, 100);
  };

  // Get files for different contexts
  const getFilesNotInFolders = () => {
    const originalDocuments = searchResults.length > 0 ? searchResults : documents;
    return originalDocuments.filter(doc => 
      !doc.folder_name || 
      doc.folder_name === 'General' || 
      doc.folder_name === '' ||
      doc.folder_name === null
    );
  };

  const getRecentFiles = () => {
    return [...documents]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 10);
  };

  switch (viewMode) {
    case 'dashboard':
      return (
        <>
          {/* Show search results if active */}
          {isSearchActive ? (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Search Results ({documents.length})</span>
                </h2>
                
                <FileGrid
                  documents={documents}
                  onFileAction={handleFileAction}
                  formatFileSize={formatFileSize}
                  formatDate={formatDate}
                  getFileIcon={getFileIcon}
                  title=""
                  showCreateHint={false}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Normal dashboard view with UNIFIED STATS */}
              <StatsCards
                documents={documents}        
                folders={folders}           
                onViewModeChange={onViewModeChange}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded"></div>
                    <span>Quick Actions</span>
                  </h2>
                  
                  <FileUploader onFileUpload={onRefetch} selectedFolder={selectedFolder?.name} />
                  
                  <FolderGrid
                    folders={folders}
                    documents={documents}
                    loading={loading}
                    error={error}
                    onFolderClick={onFolderClick}
                    onCreateFolder={onCreateFolder}
                    onForceRefresh={onForceRefresh}
                  />

                  {/* Recent Files Section with Enhanced Grid */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <FileText className="w-6 h-6 text-green-400" />
                        <span>Recent Files</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Click eye icon to preview files"></div>
                      </h3>
                      {documents.length > 5 && (
                        <button
                          onClick={() => onViewModeChange('all-documents')}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          View All →
                        </button>
                      )}
                    </div>
                    
                    <FileGrid
                      documents={getRecentFiles().slice(0, 6)}
                      onFileAction={handleFileAction}
                      formatFileSize={formatFileSize}
                      formatDate={formatDate}
                      getFileIcon={getFileIcon}
                      title=""
                      showCreateHint={true}
                    />
                  </div>
                </div>

                {/* Right Panel with UNIFIED Storage Stats */}
                <ActivityPanel
                  recentUploads={recentUploads}
                  documents={documents}              
                  folders={folders}                  
                />
              </div>
            </>
          )}
        </>
      );

    case 'all-documents':
      const displayDocuments = documents;
      
      return (
        <>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <FileText className="w-7 h-7 text-blue-400" />
                  <span>
                    {isSearchActive 
                      ? `Search Results (${displayDocuments.length})` 
                      : `All Documents (${displayDocuments.length})`
                    }
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Click eye icon to preview files"></div>
                </h2>
              </div>
              
              <FileGrid
                documents={displayDocuments}
                onFileAction={handleFileAction}
                formatFileSize={formatFileSize}
                formatDate={formatDate}
                getFileIcon={getFileIcon}
                title=""
                showCreateHint={true}
              />
            </div>
          </div>
        </>
      );

    case 'recent-uploads':
      return (
        <>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Upload className="w-7 h-7 text-green-400" />
                <span>Recent Uploads ({recentUploads.length})</span>
                {recentUploads.length > 0 && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Click eye icon to preview files"></div>
                )}
              </h2>
              
              <FileGrid
                documents={recentUploads}
                onFileAction={handleFileAction}
                formatFileSize={formatFileSize}
                formatDate={formatDate}
                getFileIcon={getFileIcon}
                title=""
                showCreateHint={true}
              />
            </div>
          </div>
        </>
      );

    case 'all-folders':
      return (
        <>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Folder className="w-7 h-7 text-purple-400" />
                  <span>All Folders ({folders.length})</span>
                </h2>
                <button
                  onClick={onCreateFolder}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Folder</span>
                </button>
              </div>
              
              {folders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Folder className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="text-white font-semibold mb-2 text-xl">No folders yet</div>
                  <div className="text-gray-400 mb-6">Create your first folder to organize documents</div>
                  <button
                    onClick={onCreateFolder}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Create First Folder
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {folders.map((folder, index) => {
                    const folderDocCount = documents.filter(doc => 
                      (doc.folder_name || doc.folder_id) === folder.name
                    ).length;
                    
                    return (
                      <div 
                        key={folder._id || index} 
                        onClick={() => onFolderClick(folder)}
                        className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 cursor-pointer group hover:scale-105 hover:shadow-2xl transition-all duration-300 hover:bg-white/15 hover:border-white/40"
                      >
                        <div className="text-center">
                          <div 
                            className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto"
                            style={{ backgroundColor: folder.color || '#3B82F6' }}
                          >
                            {folder.icon || '📁'}
                          </div>
                          
                          <div className="text-white font-bold text-xl mb-2 group-hover:text-blue-300 transition-colors">
                            {folder.name}
                          </div>
                          
                          <div className="text-gray-400 text-sm font-medium mb-3">
                            {folderDocCount} file{folderDocCount !== 1 ? 's' : ''}
                          </div>
                          
                          <div className="text-sm text-gray-300 bg-white/10 border border-white/20 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                            <span>📅</span>
                            <span>{new Date(folder.created_at).toLocaleDateString('en-US', { 
                              timeZone: 'Asia/Kolkata',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      );

    case 'folder':
      const folderDocuments = selectedFolder 
        ? documents.filter(doc => (doc.folder_name || doc.folder_id) === selectedFolder.name)
        : [];

      return (
        <>
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
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center space-x-2">
                      <span>{selectedFolder?.name}</span>
                      {folderDocuments.length > 0 && (
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Click eye icon to preview files"></div>
                      )}
                    </h2>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <span>📄 {folderDocuments.length} files</span>
                      <span>•</span>
                      <span>🕒 Created {new Date(selectedFolder?.created_at).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}</span>
                      {folderDocuments.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-green-400">🔗 Click eye icon to preview</span>
                        </>
                      )}
                    </div>
                    {selectedFolder?.description && (
                      <p className="text-gray-300 mt-2">{selectedFolder.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Area for Folder */}
            <FileUploader onFileUpload={onRefetch} selectedFolder={selectedFolder?.name} />

            {/* Files in Folder with Enhanced Grid */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <span>Files in this folder ({folderDocuments.length})</span>
                  {folderDocuments.length > 0 && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Click eye icon to preview files"></div>
                  )}
                </h3>
              </div>

              <FileGrid
                documents={folderDocuments}
                onFileAction={handleFileAction}
                formatFileSize={formatFileSize}
                formatDate={formatDate}
                getFileIcon={getFileIcon}
                title=""
                showCreateHint={true}
              />
            </div>
          </div>
        </>
      );

    default:
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <div className="text-white font-semibold mb-2 text-xl">Unknown View</div>
          <div className="text-gray-400 mb-6">The requested view mode is not recognized</div>
          <button
            onClick={() => onViewModeChange('dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <Home className="w-5 h-5 inline mr-2" />
            Back to Dashboard
          </button>
        </div>
      );
  }
};

DashboardViews.propTypes = {
  viewMode: PropTypes.string.isRequired,
  documents: PropTypes.array.isRequired,
  folders: PropTypes.array.isRequired,
  selectedFolder: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  recentUploads: PropTypes.array.isRequired,
  searchQuery: PropTypes.string,
  searchResults: PropTypes.array,
  stats: PropTypes.object,
  onViewModeChange: PropTypes.func.isRequired,
  onFolderClick: PropTypes.func.isRequired,
  onCreateFolder: PropTypes.func.isRequired,
  onRefetch: PropTypes.func.isRequired,
  onForceRefresh: PropTypes.func.isRequired,
  onFileAction: PropTypes.func.isRequired,
  onBackToDashboard: PropTypes.func,
  formatFileSize: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getFileIcon: PropTypes.func.isRequired,
};

export default DashboardViews;