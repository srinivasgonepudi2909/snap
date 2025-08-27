// components/ActivityPanel.jsx - FIXED WITH DYNAMIC STATS
import React from 'react';
import { Activity, FileText, HardDrive, BarChart3 } from 'lucide-react';

const ActivityPanel = ({ 
  recentUploads, 
  usedStorage, 
  totalStorage, 
  documents,
  folders 
}) => {
  // Calculate dynamic storage stats
  const calculatedUsedStorage = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
  const actualUsedStorage = usedStorage || calculatedUsedStorage;
  const actualTotalStorage = totalStorage || (15 * 1024 * 1024 * 1024); // 15GB default
  const storagePercentage = actualTotalStorage > 0 ? (actualUsedStorage / actualTotalStorage) * 100 : 0;

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  };

  // Calculate average file size
  const getAverageFileSize = () => {
    if (documents.length === 0) return '0 B';
    const totalSize = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
    return formatFileSize(totalSize / documents.length);
  };

  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
        </div>
        
        {recentUploads && recentUploads.length > 0 ? (
          <div className="space-y-3">
            {recentUploads.slice(0, 5).map((doc, index) => (
              <div key={doc._id || index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {doc.name || doc.original_name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {doc.folder_name || 'General'} • {new Date(doc.created_at).toLocaleDateString('en-US', {
                      timeZone: 'Asia/Kolkata',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
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

      {/* Storage Usage - Dynamic */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <HardDrive className="w-5 h-5 text-blue-400" />
          <span>Storage Usage</span>
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Used</span>
            <span className="text-white font-semibold">
              {formatFileSize(actualUsedStorage)} of {formatFileSize(actualTotalStorage)}
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
            {storagePercentage >= 100 ? 'Storage Full' : `${(100 - storagePercentage).toFixed(1)}% available`}
          </div>
        </div>
      </div>

      {/* Quick Stats - Dynamic */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <span>Quick Stats</span>
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Total Files</span>
            </span>
            <span className="text-white font-semibold text-lg">{documents.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <div className="w-4 h-4 text-purple-400">📁</div>
              <span>Total Folders</span>
            </span>
            <span className="text-white font-semibold text-lg">{folders.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <div className="w-4 h-4 text-yellow-400">📊</div>
              <span>Avg. File Size</span>
            </span>
            <span className="text-white font-semibold text-lg">
              {getAverageFileSize()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <div className="w-4 h-4 text-green-400">📈</div>
              <span>Storage Used</span>
            </span>
            <span className="text-white font-semibold text-lg">
              {storagePercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;