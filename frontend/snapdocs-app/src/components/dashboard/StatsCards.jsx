// components/dashboard/StatsCards.jsx - FIXED: SMALLER BUTTONS, NO PROGRESS BAR, DYNAMIC STATS
import React from 'react';
import { FileText, Folder, Upload, TrendingUp, Activity, BarChart3 } from 'lucide-react';

const StatsCards = ({ 
  documentsCount, 
  foldersCount, 
  recentUploadsCount, 
  onViewModeChange 
}) => {
  const statsData = [
    {
      icon: FileText,
      value: documentsCount,
      label: 'Total Documents',
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 via-blue-600/15 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-blue-500/20',
      trend: documentsCount > 0 ? '+12%' : '0%',
      trendIcon: TrendingUp,
      onClick: () => onViewModeChange('all-documents')
    },
    {
      icon: Folder,
      value: foldersCount,
      label: 'Folders',
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 via-purple-600/15 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      glowColor: 'shadow-purple-500/20',
      trend: foldersCount > 0 ? '+8%' : '0%',
      trendIcon: BarChart3,
      onClick: () => onViewModeChange('all-folders')
    },
    {
      icon: Upload,
      value: recentUploadsCount,
      label: 'Recent Uploads',
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 via-green-600/15 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      glowColor: 'shadow-green-500/20',
      trend: recentUploadsCount > 0 ? '+24%' : '0%',
      trendIcon: Activity,
      onClick: () => onViewModeChange('recent-uploads')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendIcon;
        
        return (
          <button 
            key={index}
            onClick={stat.onClick}
            className={`
              relative group bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md 
              rounded-lg p-4 border ${stat.borderColor} hover:scale-105 
              transition-all duration-300 text-left shadow-lg ${stat.glowColor} 
              hover:shadow-xl overflow-hidden
            `}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              {/* Header with icon and trend */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.bgGradient.replace('/20', '/30').replace('/15', '/25')} rounded-lg flex items-center justify-center border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                
                {/* Trend indicator - only show if there's actual data */}
                {stat.value > 0 && (
                  <div className="flex items-center space-x-1 text-xs">
                    <TrendIcon className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 font-semibold">{stat.trend}</span>
                  </div>
                )}
              </div>

              {/* Main content */}
              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <div className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {stat.value.toLocaleString()}
                  </div>
                  
                  {/* Animated counter effect - only show when hovering and there's data */}
                  {stat.value > 0 && (
                    <div className={`text-xs ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      items
                    </div>
                  )}
                </div>
                
                <div className="text-gray-300 text-sm font-medium group-hover:text-gray-200 transition-colors">
                  {stat.label}
                </div>
              </div>

              {/* Hover effect sparkle */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Click ripple effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
          </button>
        );
      })}
    </div>
  );
};

export default StatsCards;