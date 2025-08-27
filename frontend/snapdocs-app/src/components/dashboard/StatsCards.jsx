// components/dashboard/StatsCards.jsx - GRAFANA THEMED
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
      trend: '+12%',
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
      trend: '+8%',
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
      trend: '+24%',
      trendIcon: Activity,
      onClick: () => onViewModeChange('recent-uploads')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendIcon;
        
        return (
          <button 
            key={index}
            onClick={stat.onClick}
            className={`relative group bg-gradient-to-br ${stat.bgGradient} backdrop-blur-md rounded-xl p-6 border ${stat.borderColor} hover:scale-105 transition-all duration-300 text-left shadow-xl ${stat.glowColor} hover:shadow-2xl overflow-hidden`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Grafana-style grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            <div className="relative z-10">
              {/* Header with icon and trend */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient.replace('/20', '/30').replace('/15', '/25')} rounded-xl flex items-center justify-center border ${stat.borderColor} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                
                {/* Trend indicator */}
                <div className="flex items-center space-x-1 text-xs">
                  <TrendIcon className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 font-semibold">{stat.trend}</span>
                </div>
              </div>

              {/* Main content */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {stat.value.toLocaleString()}
                  </div>
                  
                  {/* Animated counter effect */}
                  <div className={`text-sm ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    items
                  </div>
                </div>
                
                <div className="text-gray-300 text-sm font-medium group-hover:text-gray-200 transition-colors">
                  {stat.label}
                </div>
              </div>

              {/* Bottom progress bar */}
              <div className="mt-4 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.bgGradient.replace('/20', '/60').replace('/15', '/50')} rounded-full transition-all duration-1000 group-hover:animate-pulse`}
                  style={{ width: `${Math.min(85, (stat.value / Math.max(...statsData.map(s => s.value))) * 100)}%` }}
                ></div>
              </div>

              {/* Hover effect sparkle */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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