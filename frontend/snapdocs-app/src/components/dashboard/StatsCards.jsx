// components/dashboard/StatsCards.jsx - DYNAMIC UPDATES & REAL-TIME STATS
import React, { useEffect, useState } from 'react';
import { FileText, Folder, Upload, TrendingUp, Activity, BarChart3 } from 'lucide-react';

const StatsCards = ({ 
  documentsCount, 
  foldersCount, 
  recentUploadsCount,
  documents = [], // Add documents for real-time calculations
  onViewModeChange 
}) => {
  // State for animated counters
  const [animatedCounts, setAnimatedCounts] = useState({
    documents: 0,
    folders: 0,
    uploads: 0
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

    animateCounter(documentsCount, animatedCounts.documents, 'documents');
    animateCounter(foldersCount, animatedCounts.folders, 'folders');
    animateCounter(recentUploadsCount, animatedCounts.uploads, 'uploads');
  }, [documentsCount, foldersCount, recentUploadsCount, animatedCounts]);

  // Calculate real-time storage usage
  const calculateStorageUsage = () => {
    const totalBytes = documents.reduce((sum, doc) => sum + (doc.file_size || 0), 0);
    const totalGB = 15; // 15GB limit
    const usedGB = totalBytes / (1024 * 1024 * 1024);
    const percentage = (usedGB / totalGB) * 100;
    return {
      used: usedGB,
      total: totalGB,
      percentage: Math.min(percentage, 100)
    };
  };

  const storage = calculateStorageUsage();

  // Calculate trends (mock data - in real app, compare with previous period)
  const getTrend = (current, type) => {
    // Mock trend calculation - in real app, compare with previous week/month
    const trendValue = current > 0 ? Math.floor(Math.random() * 25) + 5 : 0;
    return current > 0 ? `+${trendValue}%` : '0%';
  };

  const statsData = [
    {
      icon: FileText,
      value: animatedCounts.documents,
      actualValue: documentsCount,
      label: 'Total Documents',
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 via-blue-600/15 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-blue-500/20',
      trend: getTrend(documentsCount, 'documents'),
      trendIcon: TrendingUp,
      onClick: () => onViewModeChange('all-documents'),
      description: 'All your files'
    },
    {
      icon: Folder,
      value: animatedCounts.folders,
      actualValue: foldersCount,
      label: 'Folders',
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 via-purple-600/15 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      glowColor: 'shadow-purple-500/20',
      trend: getTrend(foldersCount, 'folders'),
      trendIcon: BarChart3,
      onClick: () => onViewModeChange('all-folders'),
      description: 'Organized collections'
    },
    {
      icon: Upload,
      value: animatedCounts.uploads,
      actualValue: recentUploadsCount,
      label: 'Recent Uploads',
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 via-green-600/15 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      glowColor: 'shadow-green-500/20',
      trend: getTrend(recentUploadsCount, 'uploads'),
      trendIcon: Activity,
      onClick: () => onViewModeChange('recent-uploads'),
      description: 'Last 7 days'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendIcon;
        const isAnimating = stat.value !== stat.actualValue;
        
        return (
          <button 
            key={index}
            onClick={stat.onClick}
            className={`
              relative group bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md 
              rounded-xl p-5 border ${stat.borderColor} hover:scale-[1.02] 
              transition-all duration-300 text-left shadow-lg ${stat.glowColor} 
              hover:shadow-xl overflow-hidden active:scale-95
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
                
                {/* Trend indicator - only show if there's actual data */}
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
                    {stat.value.toLocaleString()}
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

                {/* Additional info for storage stats */}
                {index === 0 && documents.length > 0 && (
                  <div className="text-xs text-gray-400 pt-1 border-t border-white/10">
                    Storage: {storage.used.toFixed(1)}GB / {storage.total}GB ({storage.percentage.toFixed(1)}%)
                  </div>
                )}
              </div>

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
        </div>
      </div>
    </div>
  );
};

export default StatsCards;