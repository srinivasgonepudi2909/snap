// components/ActivityPanel.jsx - UNIFIED STORAGE INTEGRATION
import React from 'react';
import { Activity, FileText, HardDrive, BarChart3, TrendingUp } from 'lucide-react';
import { useStorageCalculator } from '../../utils/storageUtils';

const ActivityPanel = ({ 
  recentUploads, 
  documents,
  folders 
}) => {
  // Use unified storage calculator - same logic as other components
  const storageStats = useStorageCalculator(documents, 15); // 15GB total storage

  // Log for debugging
  React.useEffect(() => {
    console.log('📊 ActivityPanel unified storage stats:', {
      totalFiles: storageStats.totalFiles,
      usedStorage: storageStats.usedFormatted,
      usagePercentage: storageStats.usagePercentage.toFixed(1) + '%',
      recentUploads: storageStats.recentUploadsCount
    });
  }, [storageStats]);

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

      {/* UNIFIED Storage Usage */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <HardDrive className="w-5 h-5 text-blue-400" />
          <span>Storage Usage</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </h3>
        <div className="space-y-4">
          {/* Real-time usage stats */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Used Storage</span>
            <span className="text-white font-semibold font-mono">
              {storageStats.usedFormatted} of {storageStats.totalFormatted}
            </span>
          </div>
          
          {/* Dynamic progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden relative">
            <div 
              className={`bg-gradient-to-r ${storageStats.colors.progress} h-full rounded-full transition-all duration-1000 relative`}
              style={{width: `${Math.min(storageStats.usagePercentage, 100)}%`}}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          {/* Storage status */}
          <div className="flex justify-between items-center">
            <div className={`text-xs font-medium ${storageStats.colors.text}`}>
              {storageStats.statusText}
            </div>
            <div className="text-xs text-gray-400">
              {storageStats.remainingFormatted} remaining
            </div>
          </div>

          {/* Usage breakdown */}
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300">Documents ({storageStats.totalFiles})</span>
              <span className="text-white font-mono">{storageStats.usedFormatted}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300">Usage Percentage</span>
              <span className={`font-mono font-semibold ${storageStats.colors.text}`}>
                {storageStats.usagePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-300">Free Space</span>
              <span className="text-green-400 font-mono">{storageStats.remainingFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* UNIFIED Quick Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-green-400" />
          <span>Live Statistics</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Total Files</span>
            </span>
            <span className="text-white font-semibold text-lg tabular-nums">{storageStats.totalFiles}</span>
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
              {storageStats.averageFileSizeFormatted}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Storage Used</span>
            </span>
            <span className={`font-semibold text-lg tabular-nums ${storageStats.colors.text}`}>
              {storageStats.usagePercentage.toFixed(1)}%
            </span>
          </div>

          {/* Real-time upload stats */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center space-x-2">
              <div className="w-4 h-4 text-green-400">⬆️</div>
              <span>Recent Uploads</span>
            </span>
            <span className="text-white font-semibold text-lg tabular-nums">
              {storageStats.recentUploadsCount}
            </span>
          </div>
        </div>

        {/* Storage warning */}
        {storageStats.warningLevel !== 'low' && (
          <div className={`mt-4 p-3 rounded-lg border ${
            storageStats.warningLevel === 'critical' ? 'bg-red-600/20 border-red-500/50' :
            storageStats.warningLevel === 'high' ? 'bg-orange-600/20 border-orange-500/50' :
            'bg-yellow-600/20 border-yellow-500/50'
          }`}>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-4 h-4 text-yellow-400">⚠️</div>
              <span className={
                storageStats.warningLevel === 'critical' ? 'text-red-300' :
                storageStats.warningLevel === 'high' ? 'text-orange-300' :
                'text-yellow-300'
              }>
                {storageStats.warningLevel === 'critical' ? 'Storage almost full! Consider upgrading.' :
                 storageStats.warningLevel === 'high' ? 'Storage running low. Clean up files.' :
                 'Storage getting full. Monitor usage.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Real-time indicator */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Data updates in real-time</span>
          <span>•</span>
          <span className="font-mono">
            {new Date().toLocaleTimeString('en-US', { 
              timeZone: 'Asia/Kolkata', 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })} IST
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;