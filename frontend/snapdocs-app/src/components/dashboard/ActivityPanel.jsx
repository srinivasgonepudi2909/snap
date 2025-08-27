// components/ActivityPanel.jsx - REAL-TIME STORAGE CALCULATIONS
import React from 'react';
import { Activity, FileText, HardDrive, BarChart3, TrendingUp } from 'lucide-react';

const ActivityPanel = ({ 
  recentUploads, 
  usedStorage, 
  totalStorage, 
  documents,
  folders 
}) => {
  // Calculate REAL storage stats dynamically
  const calculateRealUsedStorage = () => {
    return documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
  };

  // Use real calculated storage or fallback
  const realUsedStorage = calculateRealUsedStorage();
  const actualUsedStorage = realUsedStorage || usedStorage || 0;
  const actualTotalStorage = totalStorage || (15 * 1024 * 1024 * 1024); // 15GB default
  
  // Calculate real storage percentage
  const storagePercentage = actualTotalStorage > 0 ? (actualUsedStorage / actualTotalStorage) * 100 : 0;
  const remainingStorage = actualTotalStorage - actualUsedStorage;
  const remainingPercentage = 100 - storagePercentage;

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

  // Get storage status color based on usage
  const getStorageStatusColor = () => {
    if (storagePercentage >= 90) return 'from-red-500 to-red-600';
    if (storagePercentage >= 75) return 'from-orange-500 to-orange-600';
    if (storagePercentage >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-blue-500 to-purple-600';
  };

  const getStorageStatusText = () => {
    if (storagePercentage >= 95) return 'Storage Almost Full!';
    if (storagePercentage >= 90) return 'Storage Running Low';
    if (storagePercentage >= 75) return 'Storage Getting Full';
    return `${remainingPercentage.toFixed(1)}% Available`;
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

      {/* REAL-TIME Storage Usage */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <HardDrive className="w-5 h-5 text-blue-400" />
          <span>Storage Usage</span>
        </h3>
        <div className="space-y-4">
          {/* Real-time usage stats */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Used Storage</span>
            <span className="text-white font-semibold">
              {formatFileSize(actualUsedStorage)} of {formatFileSize(actualTotalStorage)}
            </span>
          </div>
          
          {/* Dynamic progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden relative">
            <div 
              className={`bg-gradient-to-r ${getStorageStatusColor()} h-full rounded-full transition-all duration-1000 relative`}
              style={{width: `${Math.min(storagePercentage, 100)}%`}}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Storage status */}
          <div className="flex justify-between items-center">
            <div className={`text-xs font-medium ${
              storagePercentage >= 90 ? 'text-red-400' :
              storagePercentage >= 75 ? 'text-orange-400' :
              storagePercentage >= 50 ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {getStorageStatusText()}
            </div>
            <div className="text-xs text-gray-400">
              {formatFileSize(remainingStorage)} remaining
            </div>
          </div>

          {/* Usage breakdown */}
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300">Documents ({documents.length})</span>
              <span className="text-white font-mono">{formatFileSize(actualUsedStorage)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300">Usage Percentage</span>
              <span className="text-white font-mono">{storagePercentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300">Free Space</span>
              <span className="text-green-400 font-mono">{formatFileSize(remainingStorage)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME Quick Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <span>Live Statistics</span>
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Total Files</span>
            </span>
            <span className="text-white font-semibold text-lg tabular-nums">{documents.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <div className="w-4 h-4 text-purple-400">📁</div>
              <span>Total Folders</span>
            </span>
            <span className="text-white font-semibold text-lg tabular-nums">{folders.length}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <div className="w-4 h-4 text-yellow-400">📊</div>
              <span>Avg. File Size</span>
            </span>
            <span className="text-white font-semibold text-lg tabular-nums">
              {getAverageFileSize()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Storage Used</span>
            </span>
            <span className="text-white font-semibold text-lg tabular-nums">
              {storagePercentage.toFixed(1)}%
            </span>
          </div>

          {/* Real-time upload stats */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <div className="w-4 h-4 text-green-400">⬆️</div>
              <span>Recent Uploads</span>
            </span>
            <span className="text-white font-semibold text-lg tabular-nums">
              {recentUploads.length}
            </span>
          </div>
        </div>

        {/* Storage warning */}
        {storagePercentage >= 85 && (
          <div className={`mt-4 p-3 rounded-lg border ${
            storagePercentage >= 95 ? 'bg-red-600/20 border-red-500/50' :
            storagePercentage >= 90 ? 'bg-orange-600/20 border-orange-500/50' :
            'bg-yellow-600/20 border-yellow-500/50'
          }`}>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-4 text-yellow-400">⚠️</div>
              <span className={
                storagePercentage >= 95 ? 'text-red-300' :
                storagePercentage >= 90 ? 'text-orange-300' :
                'text-yellow-300'
              }>
                {storagePercentage >= 95 ? 'Storage almost full! Consider upgrading.' :
                 storagePercentage >= 90 ? 'Storage running low. Clean up files.' :
                 'Storage getting full. Monitor usage.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPanel;