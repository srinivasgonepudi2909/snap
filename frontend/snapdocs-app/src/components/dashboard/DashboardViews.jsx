// components/dashboard/DashboardViews.jsx - COMPLETE UPDATED VERSION
import React from 'react';
import PropTypes from 'prop-types';
import { FileText, Folder, Upload, Plus, Eye, Download, Trash2, AlertCircle } from 'lucide-react';
import StatsCards from './StatsCards';
import FolderGrid from './FolderGrid';
import ActivityPanel from './ActivityPanel';
import FileUploader from './FileUploader';
import FileList from './FileList';
import useFilePreview from '../../hooks/useFilePreview';
import FilePreviewModal from './FilePreviewModal';

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
  onViewModeChange,
  onFolderClick,
  onCreateFolder,
  onRefetch,
  onForceRefresh,
  onFileAction,
  formatFileSize,
  formatDate,
  getFileIcon
}) => {
  // Initialize preview hook
  const {
    isPreviewOpen,
    currentFile,
    currentIndex,
    openPreview,
    closePreview,
    navigatePreview
  } = useFilePreview();

  // Calculate storage usage (mock data for now)
  const totalStorage = 15 * 1024 * 1024 * 1024; // 15GB
  const usedStorage = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);

  // Get files for different contexts
  const getFilesNotInFolders = () => {
    return documents.filter(doc => 
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

  // File action handler with preview support
  const handleFileAction = (action, file) => {
    if (action === 'preview' || action === 'view') {
      // Pass the appropriate file list based on current view
      const fileList = viewMode === 'folder' 
        ? documents.filter(d => (d.folder_name || d.folder_id) === selectedFolder?.name)
        : viewMode === 'recent-uploads'
          ? recentUploads
          : searchQuery && searchResults
            ? searchResults
            : documents;
          
      openPreview(file, fileList);
    } else {
      onFileAction(action, file);
    }
  };

  // Reusable file actions component
  const FileActions = ({ file }) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleFileAction('preview', file)}
        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 
                   rounded-lg transition-colors"
        title="Preview file"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleFileAction('download', file)}
        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 
                   rounded-lg transition-colors"
        title="Download file"
      >
        <Download className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleFileAction('delete', file)}
        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 
                   rounded-lg transition-colors"
        title="Delete file"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  // File row component for consistent display
  const FileRow = ({ doc, showFolder = true, className = "" }) => (
    <div className={`group flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 ${className}`}>
      <div className="text-3xl flex-shrink-0">
        {getFileIcon(doc.name || doc.original_name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3 mb-1">
          <div className="text-white font-medium truncate">
            {doc.name || doc.original_name}
          </div>
          {showFolder && (
            <div className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full flex-shrink-0">
              📁 {doc.folder_name || doc.folder_id || 'General'}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>{formatFileSize(doc.file_size)}</span>
          <span>•</span>
          <span>{formatDate(doc.created_at)}</span>
          {doc.file_type && (
            <>
              <span>•</span>
              <span className="uppercase">{doc.file_type.replace('.', '')}</span>
            </>
          )}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <FileActions file={doc} />
      </div>
    </div>
  );

  switch (viewMode) {
    case 'dashboard':
      return (
        <>
          <StatsCards
            documentsCount={documents.length}
            foldersCount={folders.length}
            recentUploadsCount={recentUploads.length}
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

              {/* Recent Files Section - ADDED */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-green-400" />
                    <span>Recent Files</span>
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
                
                {getRecentFiles().length > 0 ? (
                  <div className="space-y-3">
                    {getRecentFiles().slice(0, 5).map((doc, index) => (
                      <FileRow key={doc._id || index} doc={doc} showFolder={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-white font-semibold mb-2">No files yet</div>
                    <div className="text-gray-400">Upload your first file to see it here</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel */}
            <ActivityPanel
              recentUploads={recentUploads}
              usedStorage={usedStorage}
              totalStorage={totalStorage}
              documents={documents}
              folders={folders}
            />
          </div>

          {/* Preview Modal */}
          <FilePreviewModal
            isOpen={isPreviewOpen}
            onClose={closePreview}
            file={currentFile}
            allFiles={documents}
            currentIndex={currentIndex}
            onNavigate={navigatePreview}
          />
        </>
      );

    case 'all-documents':
      const displayDocuments = searchQuery ? searchResults : documents;
      
      return (
        <>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <FileText className="w-7 h-7 text-blue-400" />
                  <span>
                    {searchQuery 
                      ? `Search Results (${displayDocuments.length})` 
                      : `All Documents (${documents.length})`
                    }
                  </span>
                </h2>
              </div>
              
              {displayDocuments.length > 0 ? (
                <div className="space-y-3">
                  {displayDocuments.map((doc, index) => (
                    <FileRow key={doc._id || index} doc={doc} showFolder={true} />
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-4xl">🔍</div>
                  </div>
                  <div className="text-white font-semibold mb-2 text-xl">No results found</div>
                  <div className="text-gray-400 mb-6">Try adjusting your search terms</div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <div className="text-white font-semibold mb-2 text-xl">No documents yet</div>
                  <div className="text-gray-400 mb-6">Upload your first document to get started</div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Modal */}
          <FilePreviewModal
            isOpen={isPreviewOpen}
            onClose={closePreview}
            file={currentFile}
            allFiles={displayDocuments}
            currentIndex={currentIndex}
            onNavigate={navigatePreview}
          />
        </>
      );

    case 'all-folders':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Folder className="w-7 h-7 text-purple-400" />
              <span>All Folders ({folders.length})</span>
            </h2>
            <button 
              onClick={onCreateFolder}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>New Folder</span>
            </button>
          </div>

          {folders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {folders.map((folder, index) => {
                const folderDocCount = documents.filter(doc => 
                  (doc.folder_name || doc.folder_id) === folder.name
                ).length;
                
                return (
                  <div 
                    key={folder._id || index} 
                    onClick={() => onFolderClick(folder)}
                    className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto"
                        style={{ backgroundColor: folder.color || '#3B82F6' }}
                      >
                        {folder.icon || '📁'}
                      </div>
                      <div className="text-white font-bold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                        {folder.name}
                      </div>
                      <div className="text-gray-400 text-sm font-medium mb-3">
                        {folderDocCount} file{folderDocCount !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500 bg-white/5 rounded-full px-3 py-1 inline-block">
                        Created {new Date(folder.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-16 border border-white/20 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-16 h-16 text-gray-400" />
              </div>
              <div className="text-white font-bold mb-3 text-2xl">No folders yet</div>
              <div className="text-gray-400 mb-8 text-lg">Create your first folder to organize documents</div>
              <button 
                onClick={onCreateFolder}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 font-semibold text-lg shadow-lg"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create Your First Folder
              </button>
            </div>
          )}

          {/* Files Not in Folders - IMPROVED SECTION */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-orange-400" />
              <span>Files Not in Folders ({getFilesNotInFolders().length})</span>
            </h3>
            
            {getFilesNotInFolders().length > 0 ? (
              <div className="space-y-3">
                {getFilesNotInFolders().map((doc, index) => (
                  <FileRow 
                    key={doc._id || index} 
                    doc={doc} 
                    showFolder={false}
                    className="bg-orange-600/10 hover:bg-orange-600/20"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-green-400 text-4xl">✅</div>
                </div>
                <div className="text-white font-semibold mb-2">All files are organized!</div>
                <div className="text-gray-400">Every file is properly placed in a folder</div>
              </div>
            )}
          </div>
        </div>
      );

    case 'recent-uploads':
      return (
        <>
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Upload className="w-7 h-7 text-green-400" />
                <span>Recent Uploads ({recentUploads.length})</span>
              </h2>
              
              {recentUploads.length > 0 ? (
                <div className="space-y-4">
                  {recentUploads.map((doc, index) => (
                    <div key={doc._id || index} className="group flex items-center space-x-4 p-4 bg-green-600/10 rounded-xl hover:bg-green-600/20 transition-all duration-200">
                      <div className="text-3xl">
                        {getFileIcon(doc.name || doc.original_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <div className="text-white font-medium truncate">
                            {doc.name || doc.original_name}
                          </div>
                          <div className="px-2 py-1 bg-green-600/30 text-green-200 text-xs rounded-full">
                            🕒 {new Date(doc.created_at).toLocaleString()}
                          </div>
                          <div className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                            📁 {doc.folder_name || doc.folder_id || 'General'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{formatFileSize(doc.file_size)}</span>
                          {doc.file_type && (
                            <>
                              <span>•</span>
                              <span className="uppercase">{doc.file_type.replace('.', '')}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <FileActions file={doc} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Upload className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <div className="text-white font-semibold mb-2 text-xl">No recent uploads</div>
                  <div className="text-gray-400 mb-6">Upload some files to see them here</div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Modal */}
          <FilePreviewModal
            isOpen={isPreviewOpen}
            onClose={closePreview}
            file={currentFile}
            allFiles={recentUploads}
            currentIndex={currentIndex}
            onNavigate={navigatePreview}
          />
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
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedFolder?.name}</h2>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <span>{folderDocuments.length} files</span>
                      <span>•</span>
                      <span>Created {new Date(selectedFolder?.created_at).toLocaleDateString()}</span>
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

            {/* Files in Folder */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <span>Files in this folder ({folderDocuments.length})</span>
                </h3>
              </div>

              {folderDocuments.length > 0 ? (
                <div className="space-y-3">
                  {folderDocuments.map((doc, index) => (
                    <FileRow 
                      key={doc._id || index} 
                      doc={doc} 
                      showFolder={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="text-white font-semibold mb-2 text-xl">No files in this folder</div>
                  <div className="text-gray-400 mb-6">Upload files to this folder to see them here</div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Modal */}
          <FilePreviewModal
            isOpen={isPreviewOpen}
            onClose={closePreview}
            file={currentFile}
            allFiles={folderDocuments}
            currentIndex={currentIndex}
            onNavigate={navigatePreview}
          />
        </>
      );

    default:
      return null;
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
  onViewModeChange: PropTypes.func.isRequired,
  onFolderClick: PropTypes.func.isRequired,
  onCreateFolder: PropTypes.func.isRequired,
  onRefetch: PropTypes.func.isRequired,
  onForceRefresh: PropTypes.func.isRequired,
  onFileAction: PropTypes.func.isRequired,
  formatFileSize: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getFileIcon: PropTypes.func.isRequired,
};

export default DashboardViews;