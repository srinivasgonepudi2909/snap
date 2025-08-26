// components/FolderGrid.jsx
import React from 'react';
import { Folder, Plus, FolderOpen } from 'lucide-react';

const FolderGrid = ({ 
  folders, 
  documents, 
  loading, 
  error, 
  onFolderClick, 
  onCreateFolder,
  onForceRefresh 
}) => {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <div className="text-white">Loading folders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/50 text-center">
        <div className="w-16 h-16 text-red-400 mx-auto mb-4">⚠️</div>
        <div className="text-red-300 text-lg font-semibold mb-2">Error Loading Data</div>
        <div className="text-red-300 mb-4">{error}</div>
        <button 
          onClick={onForceRefresh}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!folders || folders.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Folder className="w-16 h-16 text-gray-400" />
        </div>
        <div className="text-white font-bold mb-3 text-2xl">No folders yet</div>
        <div className="text-gray-400 mb-8 text-lg">Create your first folder to organize documents</div>
        <button 
          onClick={onCreateFolder}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 font-semibold text-lg shadow-lg"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Create Your First Folder
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
          <FolderOpen className="w-7 h-7 text-yellow-400" />
          <span>Your Folders ({folders.length})</span>
        </h3>
        <button 
          onClick={onCreateFolder}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Folder</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {folders.map((folder, index) => {
          const folderDocCount = documents.filter(doc => 
            (doc.folder_name || doc.folder_id) === folder.name
          ).length;
          
          return (
            <div 
              key={folder._id || index} 
              onClick={() => onFolderClick(folder)}
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-center mb-6">
                <div 
                  className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto"
                  style={{ backgroundColor: folder.color || '#3B82F6' }}
                >
                  {folder.icon || '📁'}
                </div>
                <div className="text-white font-bold text-xl mb-2 group-hover:text-blue-300 transition-colors">
                  {folder.name}
                </div>
                <div className="text-gray-400 text-sm font-medium">
                  {folderDocCount} file{folderDocCount !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-500 bg-white/5 rounded-full px-3 py-1 inline-block">
                  Created {new Date(folder.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FolderGrid;