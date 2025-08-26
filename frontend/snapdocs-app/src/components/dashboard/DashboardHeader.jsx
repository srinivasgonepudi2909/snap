// components/dashboard/DashboardHeader.jsx - SIMPLIFIED WITHOUT SEARCH
import React from 'react';
import { ArrowLeft, Settings, Menu, X } from 'lucide-react';

const DashboardHeader = ({ 
  viewMode, 
  selectedFolder, 
  username, 
  onBackToDashboard,
  isMobile,
  sidebarOpen,
  setSidebarOpen
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
    <header className="sticky top-0 bg-white/10 backdrop-blur-sm border-b border-white/10 p-4 md:p-6 flex-shrink-0 z-40">
      <div className="flex items-center justify-between w-full">
        
        {/* Left Side: Menu + Back Button + Title */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {showBackButton && (
            <button 
              onClick={onBackToDashboard}
              className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <h1 className="text-lg md:text-3xl font-bold text-white truncate">
            {getHeaderTitle()}
          </h1>
        </div>

        {/* Right Side: Settings */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <button className="p-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;