// components/StatsCards.jsx
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
      onClick: () => onViewModeChange('all-documents')
    },
    {
      icon: Folder,
      value: foldersCount,
      label: 'Folders',
      color: 'text-purple-400',
      onClick: () => onViewModeChange('all-folders')
    },
    {
      icon: Upload,
      value: recentUploadsCount,
      label: 'Recent Uploads',
      color: 'text-green-400',
      onClick: () => onViewModeChange('recent-uploads')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <button 
            key={index}
            onClick={stat.onClick}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-105 transition-transform duration-200 text-left hover:bg-white/15"
          >
            <div className="flex items-center">
              <Icon className={`w-6 h-6 ${stat.color} mr-3`} />
              <div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StatsCards;