// components/dashboard/DashboardViews.jsx - ENHANCED WITH BETTER VISIBILITY AND FIXED ACTIONS
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

// ENHANCED FileCard Component with MAXIMUM VISIBILITY and FIXED Actions
const FileCard = ({ doc, onPreview, onDownload, onDelete, formatFileSize, formatDate, getFileIcon }) => {
  
  // ENHANCED: Separate handlers for each action - crystal clear logging
  const handlePreviewClick = (e) => {
    e.stopPropagation();
    console.log('👁️ ENHANCED Preview button clicked - Opening file in NEW TAB:', doc.name || doc.original_name);
    onPreview(doc);
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    console.log('📥 ENHANCED Download button clicked - FORCING file download:', doc.name || doc.original_name);
    onDownload(doc);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    console.log('🗑️ ENHANCED Delete button clicked:', doc.name || doc.original_name);
    onDelete(doc);
  };

  const handleCardClick = (e) => {
    // ENHANCED: Card click does nothing to avoid confusion - only buttons work
    console.log('📄 ENHANCED File card clicked (no action, use buttons):', doc.name || doc.original_name);
  };

  return (
    <div className="enhanced-file-card group relative bg-gradient-to-br from-slate-800/90 via-blue-900/20 to-slate-900/90 rounded-2xl border-2 border-blue-500/20 hover:border-blue-400/60 transition-all duration-300 overflow-hidden hover:transform hover:scale-105 hover:shadow-2xl backdrop-blur-md">
      {/* ENHANCED: Gradient overlay for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* ENHANCED: Card container with better spacing */}
      <div 
        className="enhanced-file-card-container relative z-10 p-6 cursor-pointer h-full flex flex-col"
        onClick={handleCardClick}
      >
        {/* ENHANCED: Icon container with glow effect */}
        <div className="enhanced-file-card-icon-container flex-shrink-0 mb-4">
          <div className="enhanced-file-card-icon text-5xl group-hover:scale-110 transition-all duration-300 filter drop-shadow-lg group-hover:drop-shadow-xl text-center">
            {getFileIcon(doc.name || doc.original_name)}
          </div>
        </div>
        
        {/* ENHANCED: Text container with better spacing and readability */}
        <div className="enhanced-file-card-text-container flex-grow flex flex-col justify-between min-h-0">
          {/* ENHANCED: File Name with better contrast and truncation */}
          <h3 className="enhanced-file-card-name text-white font-semibold text-lg mb-3 group-hover:text-blue-300 transition-colors line-clamp-2 text-center leading-tight">
            {doc.name || doc.original_name}
          </h3>
          
          {/* ENHANCED: File Info with better visibility and icons */}
          <div className="enhanced-file-card-info space-y-2 text-sm text-blue-100/80 mb-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-400">📦</span>
              <span className="font-medium">{formatFileSize(doc.file_size)}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-blue-400">🕒</span>
              <span className="font-medium">{formatDate(doc.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* ENHANCED: Action Buttons with MAXIMUM VISIBILITY - positioned for easy access */}
      <div className="enhanced-file-card-actions absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-20">
        {/* ENHANCED: Preview button with clear icon and better contrast */}
        <button
          onClick={handlePreviewClick}
          className="enhanced-action-btn bg-blue-600/95 hover:bg-blue-500 border-2 border-blue-400/50 hover:border-blue-300 text-white shadow-lg hover:shadow-blue-500/50 backdrop-blur-sm"
          title="🔗 Open in New Tab"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        
        {/* ENHANCED: Download button with clear icon and better contrast */}
        <button
          onClick={handleDownloadClick}
          className="enhanced-action-btn bg-green-600/95 hover:bg-green-500 border-2 border-green-400/50 hover:border-green-300 text-white shadow-lg hover:shadow-green-500/50 backdrop-blur-sm"
          title="📥 Download File"
        >
          <Download className="w-4 h-4" />
        </button>
        
        {/* ENHANCED: Delete button with clear icon and better contrast */}
        <button
          onClick={handleDeleteClick}
          className="enhanced-action-btn bg-red-600/95 hover:bg-red-500 border-2 border-red-400/50 hover:border-red-300 text-white shadow-lg hover:shadow-red-500/50 backdrop-blur-sm"
          title="🗑️ Delete File"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* ENHANCED: Folder Badge with better positioning and visibility */}
      {doc.folder_name && (
        <div className="enhanced-folder-badge absolute bottom-4 left-4 bg-purple-600/90 border border-purple-400/50 text-purple-100 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg backdrop-blur-sm">
          <span>📁</span>
          <span className="max-w-20 truncate">{doc.folder_name}</span>
        </div>
      )}
      
      {/* ENHANCED: Status Indicators with better visibility */}
      <div className="enhanced-status-indicators absolute bottom-4 right-4 flex gap-1">
        <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm animate-pulse" title="Preview available"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full shadow-sm animate-pulse" title="Download available"></div>
      </div>
    </div>
  );
};

// ENHANCED: FileGrid Component with better layout and visibility
const FileGrid = ({ documents, onFileAction, formatFileSize, formatDate, getFileIcon, title = "Files", showCreateHint = false }) => {
  
  // ENHANCED: Action handlers with detailed logging
  const handlePreview = (file) => {
    console.log('🔍 ENHANCED FileGrid preview action:', file.name || file.original_name);
    onFileAction('preview', file);
  };
  
  const handleDownload = (file) => {
    console.log('📥 ENHANCED FileGrid download action - FORCING DOWNLOAD:', file.name || file.original_name);
    onFileAction('download', file);
  };
  
  const handleDelete = (file) => {
    console.log('🗑️ ENHANCED FileGrid delete action:', file.name || file.original_name);
    onFileAction('delete', file);
  };

  if (documents.length === 0 && showCreateHint) {
    return (
      <div className="enhanced-empty-state text-center py-20 bg-gradient-to-br from-slate-800/50 to-blue-900/20 rounded-2xl border-2 border-dashed border-blue-500/30">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/30">
          <FileText className="w-16 h-16 text-blue-400" />
        </div>
        <div className="text-white font-bold mb-3 text-2xl">No files yet</div>
        <div className="text-blue-200 mb-8 text-lg">Upload your first file to see it here</div>
        <div className="text-blue-300 text-sm bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2 inline-block">
          💡 Use the upload area above or drag & drop files
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-file-grid-container space-y-6">
      {title && (
        <div className="enhanced-file-grid-header flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
            <FileText className="w-7 h-7 text-blue-400" />
            <span>{title} ({documents.length})</span>
            {documents.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Files ready for interaction"></div>
                <span className="text-sm text-green-300 font-medium">Click buttons to interact</span>
              </div>
            )}
          </h3>
        </div>
      )}
      
      {/* ENHANCED: Grid Layout with perfect responsive behavior */}
      <div className="enhanced-file-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      
      {/* ENHANCED: Usage instructions with better visibility */}
      {documents.length > 0 && (
        <div className="enhanced-usage-instructions mt-6 p-4 bg-gradient-to-r from-blue-500/15 via-green-500/10 to-blue-500/15 rounded-xl border border-blue-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4 text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-blue-400" />
              <span className="font-medium">Hover over files to see action buttons</span>
            </div>
            <span className="text-blue-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🔗</span>
              <span>Preview</span>
            </div>
            <span className="text-blue-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-green-400">📥</span>
              <span>Download</span>
            </div>
            <span className="text-blue-400">•</span>
            <div className="flex items-center gap-2">
              <span className="text-red-400">🗑️</span>
              <span>Delete</span>
            </div>
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
  // Initialize preview hook (maintained for compatibility)
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
  
  // ENHANCED: File action handler with improved new tab opening and force download
  const handleFileAction = async (action, file) => {
    console.log('🎬 ENHANCED DashboardViews file action:', action, 'for file:', file.name || file.original_name);
    
    if (action === 'preview' || action === 'view') {
      // ENHANCED: Improved new tab opening with better error handling
      console.log('🔗 ENHANCED: Opening file in new tab with better handling:', file.name || file.original_name);
      
      const baseUrl = process.env.REACT_APP_DOCUMENT_API || 'http://localhost:8001';
      let fileUrl;
      
      if (file.unique_name) {
        fileUrl = `${baseUrl}/files/${file.unique_name}`;
      } else if (file._id) {
        fileUrl = `${baseUrl}/api/v1/documents/${file._id}/download`;
      } else {
        console.error('❌ ENHANCED: No file URL available');
        alert('⚠️ Unable to preview file - no URL available');
        return;
      }
      
      console.log('🌐 ENHANCED: Opening URL in new tab:', fileUrl);
      
      // ENHANCED: Better new tab handling with fallback
      try {
        const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer,width=1200,height=800');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          console.warn('⚠️ ENHANCED: Popup blocked, trying alternative method');
          // Fallback: create a temporary link
          const link = document.createElement('a');
          link.href = fileUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.log('✅ ENHANCED: File opened in new tab successfully');
        }
      } catch (error) {
        console.error('❌ ENHANCED: Error opening new tab:', error);
        alert('⚠️ Error opening file preview. Please check your browser settings.');
      }
      
    } else if (action === 'download') {
      // ENHANCED: Improved force download implementation
      console.log('📥 ENHANCED: Force downloading file:', file.name || file.original_name);
      
      const baseUrl = process.env.REACT_APP_DOCUMENT_API || 'http://localhost:8001';
      let downloadUrl;
      
      if (file.unique_name) {
        downloadUrl = `${baseUrl}/files/${file.unique_name}?download=true`;
      } else if (file._id) {
        downloadUrl = `${baseUrl}/api/v1/documents/${file._id}/download?force=true`;
      } else {
        console.error('❌ ENHANCED: No download URL available');
        alert('⚠️ Unable to download file - no URL available');
        return;
      }
      
      try {
        // ENHANCED: Force download with proper headers
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name || file.original_name || 'download';
        link.style.display = 'none';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ ENHANCED: File download initiated successfully');
      } catch (error) {
        console.error('❌ ENHANCED: Error downloading file:', error);
        alert('⚠️ Error downloading file. Please try again.');
      }
      
    } else {
      // Pass other actions (like delete) to the parent handler
      console.log('🔄 ENHANCED: Passing action to parent handler:', action);
      onFileAction(action, file);
    }
  };

  // Handle back to dashboard from preview (maintained for compatibility)
  const handleBackToDashboardFromPreview = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      onViewModeChange('dashboard');
    }
  };

  // Handle delete from preview modal (maintained for compatibility)
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
              <div className="enhanced-search-results bg-gradient-to-br from-slate-800/90 to-blue-900/30 backdrop-blur-md rounded-3xl p-8 border-2 border-blue-500/30">
                <h2 className="text-3xl font-bold text-white mb-8 flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Search Results ({documents.length})</span>
                  {documents.length > 0 && (
                    <div className="text-sm text-blue-300 font-medium bg-blue-500/20 px-3 py-1 rounded-full">
                      Click buttons to interact with files
                    </div>
                  )}
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
              {/* ENHANCED: Normal dashboard view with better styling */}
              <StatsCards
                documents={documents}        
                folders={folders}           
                onViewModeChange={onViewModeChange}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ENHANCED: Quick Actions with better styling */}
                <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                    <div className="w-2 h-10 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
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

                  {/* ENHANCED: Recent Files Section with better styling */}
                  <div className="enhanced-recent-files bg-gradient-to-br from-slate-800/90 to-green-900/20 backdrop-blur-md rounded-3xl p-8 border-2 border-green-500/20">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                        <FileText className="w-7 h-7 text-green-400" />
                        <span>Recent Files</span>
                        <div className="text-sm text-green-300 font-medium bg-green-500/20 px-3 py-1 rounded-full">
                          Hover to see buttons
                        </div>
                      </h3>
                      {documents.length > 5 && (
                        <button
                          onClick={() => onViewModeChange('all-documents')}
                          className="enhanced-view-all-btn text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-lg border border-blue-500/30"
                        >
                          View All Files →
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

                {/* Right Panel maintained as is */}
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
            <div className="enhanced-all-documents bg-gradient-to-br from-slate-800/90 to-blue-900/20 backdrop-blur-md rounded-3xl p-8 border-2 border-blue-500/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <span>
                    {isSearchActive 
                      ? `Search Results (${displayDocuments.length})` 
                      : `All Documents (${displayDocuments.length})`
                    }
                  </span>
                  {displayDocuments.length > 0 && (
                    <div className="text-sm text-blue-300 font-medium bg-blue-500/20 px-3 py-1 rounded-full">
                      Hover files to see actions
                    </div>
                  )}
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
            <div className="enhanced-recent-uploads bg-gradient-to-br from-slate-800/90 to-green-900/20 backdrop-blur-md rounded-3xl p-8 border-2 border-green-500/20">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center space-x-3">
                <Upload className="w-8 h-8 text-green-400" />
                <span>Recent Uploads ({recentUploads.length})</span>
                {recentUploads.length > 0 && (
                  <div className="text-sm text-green-300 font-medium bg-green-500/20 px-3 py-1 rounded-full">
                    Hover files to interact
                  </div>
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
            <div className="enhanced-all-folders bg-gradient-to-br from-slate-800/90 to-purple-900/20 backdrop-blur-md rounded-3xl p-8 border-2 border-purple-500/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
                  <Folder className="w-8 h-8 text-purple-400" />
                  <span>All Folders ({folders.length})</span>
                </h2>
                <button
                  onClick={onCreateFolder}
                  className="enhanced-create-folder-btn flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg border border-purple-500/50"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Folder</span>
                </button>
              </div>
              
              {folders.length === 0 ? (
                <div className="enhanced-no-folders text-center py-20">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-600/20 to-purple-600/40 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500/30">
                    <Folder className="w-16 h-16 text-purple-400" />
                  </div>
                  <div className="text-white font-bold mb-3 text-2xl">No folders yet</div>
                  <div className="text-purple-200 mb-8 text-lg">Create your first folder to organize documents</div>
                  <button
                    onClick={onCreateFolder}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg border border-purple-500/50"
                  >
                    <Plus className="w-6 h-6 inline mr-2" />
                    Create First Folder
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {folders.map((folder, index) => {
                    const folderDocCount = documents.filter(doc => 
                      (doc.folder_name || doc.folder_id) === folder.name
                    ).length;
                    
                    return (
                      <div 
                        key={folder._id || index} 
                        onClick={() => onFolderClick(folder)}
                        className="enhanced-folder-card bg-gradient-to-br from-slate-800/90 to-purple-900/20 backdrop-blur-md rounded-3xl p-8 border-2 border-purple-500/20 cursor-pointer group hover:scale-105 hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-700/90 hover:to-purple-800/30 hover:border-purple-400/40"
                      >
                        <div className="text-center">
                          <div 
                            className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl mx-auto border-2 border-white/10"
                            style={{ backgroundColor: folder.color || '#8B5CF6' }}
                          >
                            {folder.icon || '📁'}
                          </div>
                          
                          <div className="text-white font-bold text-xl mb-3 group-hover:text-purple-300 transition-colors">
                            {folder.name}
                          </div>
                          
                          <div className="text-purple-300 text-sm font-semibold mb-4 bg-purple-500/20 px-3 py-1 rounded-full inline-block">
                            {folderDocCount} file{folderDocCount !== 1 ? 's' : ''}
                          </div>
                          
                          <div className="text-sm text-gray-300 bg-white/10 border border-white/20 rounded-lg px-4 py-2 inline-flex items-center gap-2">
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
          <div className="space-y-8">
            {/* ENHANCED: Folder Header with better styling */}
            <div className="enhanced-folder-header bg-gradient-to-br from-slate-800/90 to-purple-900/20 backdrop-blur-md rounded-3xl p-10 border-2 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <div 
                    className="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl shadow-2xl border-4 border-white/20"
                    style={{ backgroundColor: selectedFolder?.color || '#8B5CF6' }}
                  >
                    {selectedFolder?.icon || '📁'}
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-4 flex items-center space-x-3">
                      <span>{selectedFolder?.name}</span>
                      {folderDocuments.length > 0 && (
                        <div className="text-lg text-purple-300 font-medium bg-purple-500/20 px-4 py-2 rounded-full">
                          Hover files to interact
                        </div>
                      )}
                    </h2>
                    <div className="flex items-center space-x-6 text-purple-200 text-lg">
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <span className="font-semibold">{folderDocuments.length} files</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <span>🕒</span>
                        <span>Created {new Date(selectedFolder?.created_at).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}</span>
                      </div>
                      {folderDocuments.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-2 text-green-400 font-medium">
                            <span>🔗</span>
                            <span>Actions available on hover</span>
                          </div>
                        </>
                      )}
                    </div>
                    {selectedFolder?.description && (
                      <p className="text-purple-100 mt-4 text-lg bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                        {selectedFolder.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ENHANCED: Upload Area for Folder */}
            <FileUploader onFileUpload={onRefetch} selectedFolder={selectedFolder?.name} />

            {/* ENHANCED: Files in Folder with better styling */}
            <div className="enhanced-folder-files bg-gradient-to-br from-slate-800/90 to-blue-900/20 backdrop-blur-md rounded-3xl p-8 border-2 border-blue-500/20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <FileText className="w-7 h-7 text-blue-400" />
                  <span>Files in this folder ({folderDocuments.length})</span>
                  {folderDocuments.length > 0 && (
                    <div className="text-sm text-blue-300 font-medium bg-blue-500/20 px-3 py-1 rounded-full">
                      Hover to see action buttons
                    </div>
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
        <div className="enhanced-unknown-view text-center py-24 bg-gradient-to-br from-slate-800/90 to-red-900/20 backdrop-blur-md rounded-3xl border-2 border-red-500/30">
          <div className="w-32 h-32 bg-gradient-to-br from-red-600/20 to-red-600/40 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-red-500/30">
            <AlertCircle className="w-16 h-16 text-red-400" />
          </div>
          <div className="text-white font-bold mb-4 text-3xl">Unknown View</div>
          <div className="text-red-200 mb-10 text-lg">The requested view mode is not recognized</div>
          <button
            onClick={() => onViewModeChange('dashboard')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg border border-blue-500/50"
          >
            <Home className="w-6 h-6 inline mr-2" />
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