// components/dashboard/StatsCards.jsx - Fixed Version (40% Reduced Width)
import React from 'react';
import { FileText, Folder, Upload } from 'lucide-react';

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
      bgColor: 'from-blue-500/20 to-blue-600/20',
      onClick: () => onViewModeChange('all-documents')
    },
    {
      icon: Folder,
      value: foldersCount,
      label: 'Folders',
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-purple-600/20',
      onClick: () => onViewModeChange('all-folders')
    },
    {
      icon: Upload,
      value: recentUploadsCount,
      label: 'Recent Uploads',
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-green-600/20',
      onClick: () => onViewModeChange('recent-uploads')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <button 
            key={index}
            onClick={stat.onClick}
            className={`bg-gradient-to-r ${stat.bgColor} backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-105 transition-all duration-200 text-left hover:shadow-lg group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.bgColor.replace('/20', '/30')} rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
              <div className={`text-3xl font-bold ${stat.color} opacity-20 group-hover:opacity-40 transition-opacity`}>
                {stat.value}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StatsCards;