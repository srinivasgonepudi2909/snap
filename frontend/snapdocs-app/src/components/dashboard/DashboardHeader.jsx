// components/DashboardHeader.jsx
import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import SearchComponent from './SearchComponent';

const DashboardHeader = ({ 
  viewMode, 
  selectedFolder, 
  username, 
  onBackToDashboard 
}) => {
  const getHeaderTitle = () => {
    if (viewMode === 'folder' && selectedFolder) {
      return `${selectedFolder.icon} ${selectedFolder.name}`;
    }
    
    switch (viewMode) {
      case 'all-documents':
        return '📄 All Documents';
      case 'all-folders':
        return '📁 All Folders';
      case 'recent-uploads':
        return '📤 Recent Uploads';
      default:
        return `Welcome back, ${username}! 👋`;
    }
  };

  const showBackButton = viewMode === 'folder' || viewMode !== 'dashboard';

  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-white/10 p-6 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button 
              onClick={onBackToDashboard}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-white">
            {getHeaderTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <SearchComponent />
          <button className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;