// components/dashboard/StatsCards.jsx - UNIFIED REAL-TIME STORAGE DATA
import React, { useEffect, useState } from 'react';
import { FileText, Folder, Upload, TrendingUp, Activity, BarChart3, HardDrive } from 'lucide-react';
import { useStorageCalculator } from '../../utils/storageUtils';

const StatsCards = ({ 
  documents = [], // Use documents array for real-time calculations
  folders = [],   // Use folders array for real-time calculations  
  onViewModeChange
}) => {
  // Get unified storage calculations
  const storageStats = useStorageCalculator(documents, 15); // 15GB total storage

  // State for animated counters
  const [animatedCounts, setAnimatedCounts] = useState({
    documents: 0,
    folders: 0,
    uploads: 0,
    storagePercentage: 0
  });

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

    // Use real-time calculated values
    animateCounter(storageStats.totalFiles, animatedCounts.documents, 'documents');
    animateCounter(folders.length, animatedCounts.folders, 'folders');
    animateCounter(storageStats.recentUploadsCount, animatedCounts.uploads, 'uploads');
    animateCounter(Math.round(storageStats.usagePercentage), Math.round(animatedCounts.storagePercentage), 'storagePercentage');
  }, [storageStats.totalFiles, folders.length, storageStats.recentUploadsCount, storageStats.usagePercentage, animatedCounts]);

  // Calculate trends (mock data - in real app, compare with previous period)
  const getTrend = (current, type) => {
    const trendValue = current > 0 ? Math.floor(Math.random() * 25) + 5 : 0;
    return current > 0 ? `+${trendValue}%` : '0%';
  };

  // Console log for debugging
  useEffect(() => {
    console.log('📊 StatsCards updated with:', {
      totalFiles: storageStats.totalFiles,
      totalFolders: folders.length,
      recentUploads: storageStats.recentUploadsCount,
      storageUsed: storageStats.usedFormatted,
      storagePercentage: storageStats.usagePercentage.toFixed(1) + '%'
    });
  }, [storageStats, folders]);

  const statsData = [
    {
      icon: FileText,
      value: animatedCounts.documents,
      actualValue: storageStats.totalFiles,
      label: 'Total Documents',
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 via-blue-600/15 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-blue-500/20',
      trend: getTrend(storageStats.totalFiles, 'documents'),
      trendIcon: TrendingUp,
      onClick: () => onViewModeChange('all-documents'),
      description: 'All your files',
      extraInfo: `Storage: ${storageStats.usedFormatted}`
    },
    {
      icon: Folder,
      value: animatedCounts.folders,
      actualValue: folders.length,
      label: 'Folders',
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 via-purple-600/15 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      glowColor: 'shadow-purple-500/20',
      trend: getTrend(folders.length, 'folders'),
      trendIcon: BarChart3,
      onClick: () => onViewModeChange('all-folders'),
      description: 'Organized collections',
      extraInfo: folders.length > 0 
        ? `Avg: ${Math.round(storageStats.totalFiles / folders.length)} files/folder` 
        : 'No folders yet'
    },
    {
      icon: Upload,
      value: animatedCounts.uploads,
      actualValue: storageStats.recentUploadsCount,
      label: 'Recent Uploads',
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 via-green-600/15 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      glowColor: 'shadow-green-500/20',
      trend: getTrend(storageStats.recentUploadsCount, 'uploads'),
      trendIcon: Activity,
      onClick: () => onViewModeChange('recent-uploads'),
      description: 'Last 7 days',
      extraInfo: storageStats.totalFiles > 0 
        ? `${Math.round((storageStats.recentUploadsCount / storageStats.totalFiles) * 100)}% of total` 
        : 'No uploads yet'
    },
    {
      icon: HardDrive,
      value: animatedCounts.storagePercentage,
      actualValue: Math.round(storageStats.usagePercentage),
      label: 'Storage Used',
      color: storageStats.colors.text,
      bgGradient: storageStats.colors.gradient,
      borderColor: storageStats.colors.border,
      glowColor: storageStats.colors.text.replace('text-', 'shadow-').replace('400', '500/20'),
      trend: storageStats.usagePercentage < 100 
        ? `${storageStats.remainingPercentage.toFixed(1)}% free` 
        : 'Full!',
      trendIcon: HardDrive,
      onClick: () => {}, // No click action for storage
      description: `${storageStats.usagePercentage.toFixed(1)}% of ${storageStats.totalFormatted}`,
      extraInfo: `${storageStats.remainingFormatted} remaining`,
      isPercentage: true,
      // Add storage-specific data
      storageData: {
        usedBytes: storageStats.usedBytes,
        totalBytes: storageStats.totalBytes,
        usagePercentage: storageStats.usagePercentage,
        progressClass: storageStats.colors.progress
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendIcon;
        const isAnimating = stat.value !== stat.actualValue;
        const isStorageCard = stat.label === 'Storage Used';
        
        return (
          <button 
            key={index}
            onClick={stat.onClick}
            disabled={isStorageCard} // Disable click for storage card
            className={`
              relative group bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md 
              rounded-xl p-5 border ${stat.borderColor} hover:scale-[1.02] 
              transition-all duration-300 text-left shadow-lg ${stat.glowColor} 
              hover:shadow-xl overflow-hidden 
              ${isStorageCard ? 'cursor-default' : 'active:scale-95 cursor-pointer'}
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

                {/* Extra real-time info */}
                <div className="text-xs text-gray-500 pt-1 border-t border-white/10 group-hover:text-gray-400 transition-colors">
                  {stat.extraInfo}
                </div>
              </div>

              {/* Storage progress bar for storage card */}
              {isStorageCard && stat.storageData && (
                <div className="mt-3 w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r ${stat.storageData.progressClass} h-full rounded-full transition-all duration-1000 relative`}
                    style={{ width: `${Math.min(stat.storageData.usagePercentage, 100)}%` }}
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
            • {storageStats.totalFiles} files • {storageStats.usedFormatted} used
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;