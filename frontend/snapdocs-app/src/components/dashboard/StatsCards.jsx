// components/dashboard/StatsCards.jsx - REAL-TIME DATA FROM RIGHT SIDE STORAGE
import React, { useEffect, useState } from 'react';
import { FileText, Folder, Upload, TrendingUp, Activity, BarChart3, HardDrive } from 'lucide-react';

const StatsCards = ({ 
  documentsCount, 
  foldersCount, 
  recentUploadsCount,
  documents = [], // Documents array for real-time calculations
  folders = [],   // Folders array for real-time calculations  
  onViewModeChange,
  // NEW: Accept real-time storage data from ActivityPanel
  realTimeStats = null
}) => {
  // State for animated counters
  const [animatedCounts, setAnimatedCounts] = useState({
    documents: 0,
    folders: 0,
    uploads: 0,
    storagePercentage: 0
  });

  // Calculate real-time storage usage (same logic as ActivityPanel)
  const calculateRealTimeStorage = () => {
    const totalBytes = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
    const totalGB = 15; // 15GB limit
    const usedGB = totalBytes / (1024 * 1024 * 1024);
    const percentage = Math.min((usedGB / totalGB) * 100, 100);
    
    return {
      usedBytes: totalBytes,
      usedGB: usedGB,
      totalGB: totalGB,
      percentage: percentage,
      remainingGB: totalGB - usedGB,
      remainingPercentage: Math.max(100 - percentage, 0)
    };
  };

  const realTimeStorage = calculateRealTimeStorage();

  // Calculate recent uploads (last 7 days) in real-time
  const calculateRecentUploads = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return documents.filter(doc => {
      if (!doc.created_at) return false;
      const docDate = new Date(doc.created_at);
      return docDate >= sevenDaysAgo;
    }).length;
  };

  const realTimeRecentUploads = calculateRecentUploads();

  // Animate counters when values change
  useEffect(() => {
    const animateCounter = (target, current, key) => {
      if (target === current) return;
      
      const increment = Math.ceil(Math.abs(target - current) / 20);
      const step = target > current ? increment : -increment;
      
      const timer = setTimeout(() => {
        const newValue = current + step;
        const finalValue = step > 0 ? Math.min(newValue, target) : Math.max(newValue, target);
        
        setAnimatedCounts(prev => ({
          ...prev,
          [key]: finalValue
        }));
      }, 50);
      
      return () => clearTimeout(timer);
    };

    // Use real-time calculated values instead of passed props
    animateCounter(documents.length, animatedCounts.documents, 'documents');
    animateCounter(folders.length, animatedCounts.folders, 'folders');
    animateCounter(realTimeRecentUploads, animatedCounts.uploads, 'uploads');
    animateCounter(Math.round(realTimeStorage.percentage), Math.round(animatedCounts.storagePercentage), 'storagePercentage');
  }, [documents.length, folders.length, realTimeRecentUploads, realTimeStorage.percentage, animatedCounts]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  };

  // Get storage status color
  const getStorageColor = (percentage) => {
    if (percentage >= 90) return 'from-red-500/20 via-red-600/15 to-red-500/20';
    if (percentage >= 75) return 'from-orange-500/20 via-orange-600/15 to-yellow-500/20';
    if (percentage >= 50) return 'from-yellow-500/20 via-yellow-600/15 to-orange-500/20';
    return 'from-blue-500/20 via-blue-600/15 to-cyan-500/20';
  };

  const getStorageTextColor = (percentage) => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-orange-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-blue-400';
  };

  // Calculate trends (mock data - in real app, compare with previous period)
  const getTrend = (current, type) => {
    const trendValue = current > 0 ? Math.floor(Math.random() * 25) + 5 : 0;
    return current > 0 ? `+${trendValue}%` : '0%';
  };

  const statsData = [
    {
      icon: FileText,
      value: animatedCounts.documents,
      actualValue: documents.length, // Use real-time documents count
      label: 'Total Documents',
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 via-blue-600/15 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-blue-500/20',
      trend: getTrend(documents.length, 'documents'),
      trendIcon: TrendingUp,
      onClick: () => onViewModeChange('all-documents'),
      description: 'All your files',
      // NEW: Add real-time storage info
      extraInfo: `Storage: ${formatFileSize(realTimeStorage.usedBytes)}`
    },
    {
      icon: Folder,
      value: animatedCounts.folders,
      actualValue: folders.length, // Use real-time folders count
      label: 'Folders',
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 via-purple-600/15 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      glowColor: 'shadow-purple-500/20',
      trend: getTrend(folders.length, 'folders'),
      trendIcon: BarChart3,
      onClick: () => onViewModeChange('all-folders'),
      description: 'Organized collections',
      // NEW: Show average files per folder
      extraInfo: folders.length > 0 ? `Avg: ${Math.round(documents.length / folders.length)} files/folder` : 'No folders yet'
    },
    {
      icon: Upload,
      value: animatedCounts.uploads,
      actualValue: realTimeRecentUploads, // Use real-time calculated recent uploads
      label: 'Recent Uploads',
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 via-green-600/15 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      glowColor: 'shadow-green-500/20',
      trend: getTrend(realTimeRecentUploads, 'uploads'),
      trendIcon: Activity,
      onClick: () => onViewModeChange('recent-uploads'),
      description: 'Last 7 days',
      // NEW: Show percentage of total uploads
      extraInfo: documents.length > 0 ? `${Math.round((realTimeRecentUploads / documents.length) * 100)}% of total` : 'No uploads yet'
    },
    // NEW: Add storage card with real-time data
    {
      icon: HardDrive,
      value: animatedCounts.storagePercentage,
      actualValue: Math.round(realTimeStorage.percentage),
      label: 'Storage Used',
      color: getStorageTextColor(realTimeStorage.percentage),
      bgGradient: getStorageColor(realTimeStorage.percentage),
      borderColor: realTimeStorage.percentage >= 90 ? 'border-red-500/30' : 
                   realTimeStorage.percentage >= 75 ? 'border-orange-500/30' : 
                   realTimeStorage.percentage >= 50 ? 'border-yellow-500/30' : 'border-blue-500/30',
      glowColor: realTimeStorage.percentage >= 90 ? 'shadow-red-500/20' :
                 realTimeStorage.percentage >= 75 ? 'shadow-orange-500/20' :
                 realTimeStorage.percentage >= 50 ? 'shadow-yellow-500/20' : 'shadow-blue-500/20',
      trend: realTimeStorage.percentage < 100 ? `${realTimeStorage.remainingPercentage.toFixed(1)}% free` : 'Full!',
      trendIcon: HardDrive,
      onClick: () => {}, // No click action for storage
      description: `${realTimeStorage.usedGB.toFixed(1)}GB of ${realTimeStorage.totalGB}GB`,
      extraInfo: `${formatFileSize(realTimeStorage.usedBytes)} used`,
      isPercentage: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendIcon;
        const isAnimating = stat.value !== stat.actualValue;
        
        return (
          <button 
            key={index}
            onClick={stat.onClick}
            disabled={stat.label === 'Storage Used'} // Disable click for storage card
            className={`
              relative group bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md 
              rounded-xl p-5 border ${stat.borderColor} hover:scale-[1.02] 
              transition-all duration-300 text-left shadow-lg ${stat.glowColor} 
              hover:shadow-xl overflow-hidden 
              ${stat.label === 'Storage Used' ? 'cursor-default' : 'active:scale-95 cursor-pointer'}
            `}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              {/* Header with icon and trend */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient.replace('/20', '/30').replace('/15', '/25')} rounded-xl flex items-center justify-center border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                
                {/* Trend indicator */}
                {stat.actualValue > 0 && (
                  <div className="flex items-center space-x-1 text-xs bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                    <TrendIcon className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 font-semibold">{stat.trend}</span>
                  </div>
                )}
              </div>

              {/* Main content */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <div className={`text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300 tabular-nums ${
                    isAnimating ? 'animate-pulse' : ''
                  }`}>
                    {stat.isPercentage ? `${stat.value}%` : stat.value.toLocaleString()}
                  </div>
                  
                  {/* Real-time indicator */}
                  {isAnimating && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                  )}
                </div>
                
                <div className="text-gray-300 text-sm font-medium group-hover:text-gray-200 transition-colors">
                  {stat.label}
                </div>
                
                <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                  {stat.description}
                </div>

                {/* NEW: Extra real-time info */}
                <div className="text-xs text-gray-500 pt-1 border-t border-white/10 group-hover:text-gray-400 transition-colors">
                  {stat.extraInfo}
                </div>
              </div>

              {/* Storage progress bar for storage card */}
              {stat.label === 'Storage Used' && (
                <div className="mt-3 w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${
                      realTimeStorage.percentage >= 90 ? 'from-red-500 to-red-600' :
                      realTimeStorage.percentage >= 75 ? 'from-orange-500 to-orange-600' :
                      realTimeStorage.percentage >= 50 ? 'from-yellow-500 to-yellow-600' :
                      'from-blue-500 to-purple-600'
                    } h-full rounded-full transition-all duration-1000 relative`}
                    style={{ width: `${Math.min(realTimeStorage.percentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              )}

              {/* Hover effect sparkle */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              </div>

              {/* Data freshness indicator */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
            </div>

            {/* Click ripple effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
            
            {/* Active state indicator */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/5 opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
          </button>
        );
      })}

      {/* Real-time update indicator */}
      <div className="col-span-full">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Statistics update in real-time • Last updated: {new Date().toLocaleTimeString('en-US', { 
            timeZone: 'Asia/Kolkata', 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })} IST</span>
          <span className="text-green-400 font-semibold">
            • {documents.length} files • {formatFileSize(realTimeStorage.usedBytes)} used
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;