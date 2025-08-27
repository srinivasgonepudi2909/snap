// components/FolderGrid.jsx - UPDATED WITH GENERAL FOLDER SUPPORT
import React, { useEffect } from 'react';
import { Folder, Plus, FolderOpen, Home } from 'lucide-react';

const FolderGrid = ({ 
  folders, 
  documents, 
  loading, 
  error, 
  onFolderClick, 
  onCreateFolder,
  onForceRefresh 
}) => {
  
  // Ensure General folder exists on component mount
  useEffect(() => {
    const createGeneralFolderIfNeeded = async () => {
      try {
        console.log('🔍 Checking if General folder exists...');
        
        const hasGeneralFolder = folders.some(folder => folder.name === 'General');
        
        if (!hasGeneralFolder && folders.length >= 0) {
          console.log('📁 Creating General folder...');
          
          const response = await fetch(`${process.env.REACT_APP_DOCUMENT_API}/api/v1/folders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'General',
              description: 'Default folder for documents uploaded directly to dashboard',
              color: '#6B7280',
              icon: '📂'
            })
          });

          if (response.ok) {
            console.log('✅ General folder created successfully');
            onForceRefresh && onForceRefresh();
          } else {
            console.warn('⚠️ Failed to create General folder');
          }
        } else if (hasGeneralFolder) {
          console.log('✅ General folder already exists');
        }
      } catch (error) {
        console.error('❌ Error checking/creating General folder:', error);
      }
    };

    // Only run if we have loaded folders data
    if (!loading && folders !== undefined) {
      createGeneralFolderIfNeeded();
    }
  }, [folders, loading, onForceRefresh]);
  
  // Helper function to format date in IST
  const formatDateIST = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      
      // Convert to IST (UTC+5:30)
      const istDate = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
      
      // Format the date
      return istDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

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

  // Sort folders to show General first, then alphabetically
  const sortedFolders = [...folders].sort((a, b) => {
    if (a.name === 'General') return -1;
    if (b.name === 'General') return 1;
    return a.name.localeCompare(b.name);
  });

  if (!sortedFolders || sortedFolders.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Folder className="w-16 h-16 text-gray-400" />
        </div>
        <div className="text-white font-bold mb-3 text-2xl">Setting up your folders</div>
        <div className="text-gray-400 mb-8 text-lg">Creating default General folder...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
          <FolderOpen className="w-7 h-7 text-yellow-400" />
          <span>Your Folders ({sortedFolders.length})</span>
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
        {sortedFolders.map((folder, index) => {
          const folderDocCount = documents.filter(doc => 
            (doc.folder_name || doc.folder_id) === folder.name
          ).length;
          
          const isGeneralFolder = folder.name === 'General';
          const isDefaultFolder = folder.is_default || isGeneralFolder;
          
          return (
            <div 
              key={folder._id || index} 
              onClick={() => onFolderClick(folder)}
              className={`
                bg-white/10 backdrop-blur-sm rounded-3xl p-8 border transition-all duration-300 
                cursor-pointer group hover:scale-105 hover:shadow-2xl relative
                ${isDefaultFolder 
                  ? 'border-blue-400/50 hover:bg-blue-400/15 hover:border-blue-400' 
                  : 'border-white/20 hover:bg-white/15 hover:border-white/40'
                }
              `}
            >
              {/* Default folder badge */}
              {isDefaultFolder && (
                <div className="absolute top-3 right-3 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30 flex items-center space-x-1">
                  <Home className="w-3 h-3" />
                  <span>Default</span>
                </div>
              )}

              <div className="text-center mb-6">
                <div 
                  className={`
                    w-24 h-24 rounded-3xl flex items-center justify-center text-6xl mb-4 
                    group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto
                    ${isDefaultFolder ? 'ring-2 ring-blue-400/30' : ''}
                  `}
                  style={{ backgroundColor: folder.color || '#3B82F6' }}
                >
                  {folder.icon || '📁'}
                </div>
                
                <div className={`
                  font-bold text-xl mb-2 transition-colors
                  ${isDefaultFolder 
                    ? 'text-blue-200 group-hover:text-blue-100' 
                    : 'text-white group-hover:text-blue-300'
                  }
                `}>
                  {folder.name}
                  {isDefaultFolder && (
                    <div className="text-xs text-blue-400 mt-1 opacity-75">
                      Files uploaded here by default
                    </div>
                  )}
                </div>
                
                <div className="text-gray-400 text-sm font-medium mb-3">
                  {folderDocCount} file{folderDocCount !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="text-center">
                <div className={`
                  text-sm text-gray-300 border rounded-lg px-3 py-2 
                  inline-flex items-center gap-2 transition-all duration-300
                  ${isDefaultFolder 
                    ? 'bg-blue-500/10 border-blue-500/30 group-hover:bg-blue-500/20' 
                    : 'bg-white/10 border-white/20 group-hover:bg-white/20'
                  }
                `}>
                  <span>📅</span>
                  <span title={`Created: ${new Date(folder.created_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST`}>
                    {formatDateIST(folder.created_at)}
                  </span>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className={`
                absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${isDefaultFolder 
                  ? 'bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10' 
                  : 'bg-gradient-to-br from-white/5 via-transparent to-white/5'
                }
              `} />
            </div>
          );
        })}
      </div>

      {/* General folder info */}
      <div className="mt-6 p-4 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm text-blue-200">
            <span className="font-semibold">General Folder:</span> Files uploaded directly to dashboard will be automatically organized in the General folder.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderGrid;