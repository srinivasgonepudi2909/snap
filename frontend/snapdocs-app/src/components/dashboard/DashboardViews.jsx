// components/DashboardViews.jsx
import React from 'react';
import { FileText, Folder, Upload, Plus, Eye, Download, Trash2, AlertCircle } from 'lucide-react';
import StatsCards from './StatsCards';
import FolderGrid from './FolderGrid';
import ActivityPanel from './ActivityPanel';
import FileUploader from './FileUploader';
import FileList from './FileList';

const DashboardViews = ({
  viewMode,
  documents,
  folders,
  selectedFolder,
  loading,
  error,
  recentUploads,
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
  // Calculate storage usage (mock data for now)
  const totalStorage = 15 * 1024 * 1024 * 1024; // 15GB
  const usedStorage = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);

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
        </>
      );

    case 'all-documents':
      return (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <FileText className="w-7 h-7 text-blue-400" />
              <span>All Documents ({documents.length})</span>
            </h2>
            
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div key={doc._id || index} className="group flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <div className="text-3xl">
                      {getFileIcon(doc.name || doc.original_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="text-white font-medium truncate">
                          {doc.name || doc.original_name}
                        </div>
                        <div className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                          📁 {doc.folder_name || doc.folder_id || 'General'}
                        </div>
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
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                      <button 
                        onClick={() => onFileAction('download', doc)}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onFileAction('delete', doc)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
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

          {/* Files Not in Folders */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-orange-400" />
              <span>Files Not in Folders</span>
            </h3>
            
            {(() => {
              const filesNotInFolders = documents.filter(doc => 
                !doc.folder_name || doc.folder_name === 'General' || doc.folder_name === ''
              );
              
              return filesNotInFolders.length > 0 ? (
                <div className="space-y-3">
                  {filesNotInFolders.map((doc, index) => (
                    <div key={doc._id || index} className="group flex items-center space-x-4 p-4 bg-orange-600/10 rounded-xl hover:bg-orange-600/20 transition-all duration-200">
                      <div className="text-3xl">
                        {getFileIcon(doc.name || doc.original_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className="text-white font-medium truncate">
                            {doc.name || doc.original_name}
                          </div>
                          <div className="px-2 py-1 bg-orange-600/30 text-orange-200 text-xs rounded-full">
                            📄 Not in folder
                          </div>
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
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                        <button 
                          onClick={() => onFileAction('view', doc)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onFileAction('download', doc)}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onFileAction('delete', doc)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
              );
            })()}
          </div>
        </div>
      );

    case 'recent-uploads':
      return (
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Upload className="w-7 h-7 text-green-400" />
              <span>Recent Uploads</span>
            </h2>
            
            {recentUploads.length > 0 ? (
              <div className="space-y-4">
                {recentUploads.map((doc, index) => (
                  <div key={doc._id || index} className="group flex items-center space-x-4 p-4 bg-green-600/10 rounded-xl hover:bg-green-600/20 transition-all duration-200">
                    <div className="text-3xl">
                      {getFileIcon(doc.name || doc.original_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
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
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                      <button 
                        onClick={() => onFileAction('view', doc)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onFileAction('download', doc)}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-white/10 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onFileAction('delete', doc)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
      );

    case 'folder':
      const folderDocuments = selectedFolder 
        ? documents.filter(doc => (doc.folder_name || doc.folder_id) === selectedFolder.name)
        : [];

      return (
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
            <FileList 
              files={folderDocuments} 
              folderName={selectedFolder?.name}
              onFileAction={onFileAction}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default DashboardViews;