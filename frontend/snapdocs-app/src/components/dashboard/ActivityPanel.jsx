// components/ActivityPanel.jsx
import React from 'react';
import { Activity, FileText } from 'lucide-react';

const ActivityPanel = ({ 
  recentUploads, 
  usedStorage, 
  totalStorage, 
  documents,
  folders 
}) => {
  const storagePercentage = (usedStorage / totalStorage) * 100;

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 GB';
    const gb = bytes / 1024 / 1024 / 1024;
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
        </div>
        
        {recentUploads.length > 0 ? (
          <div className="space-y-3">
            {recentUploads.map((doc, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {doc.name || doc.original_name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {doc.folder_name || 'General'} • {new Date(doc.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-gray-400">No recent activity</div>
          </div>
        )}
      </div>

      {/* Storage Usage */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <span>Storage Usage</span>
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Used</span>
            <span className="text-white font-semibold">
              {formatFileSize(usedStorage)} of {formatFileSize(totalStorage)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-1000 relative"
              style={{width: `${Math.min(storagePercentage, 100)}%`}}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {(100 - storagePercentage).toFixed(1)}% available
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total Files</span>
            <span className="text-white font-semibold">{documents.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total Folders</span>
            <span className="text-white font-semibold">{folders.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Avg. File Size</span>
            <span className="text-white font-semibold">
              {documents.length > 0 
                ? `${(usedStorage / documents.length / 1024 / 1024).toFixed(1)} MB`
                : '0 MB'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;