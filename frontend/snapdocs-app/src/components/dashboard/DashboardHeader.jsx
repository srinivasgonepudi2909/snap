// components/dashboard/DashboardHeader.jsx
import React from 'react';
import { ArrowLeft, Settings, Menu, X } from 'lucide-react';
import SearchComponent from './SearchComponent';

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
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'} w-full`}>
        
        {/* Top Row: Mobile Menu + Title + Back Button */}
        <div className="flex items-center justify-between w-full space-x-4">
          <div className="flex items-center space-x-3">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {showBackButton && (
              <button 
                onClick={onBackToDashboard}
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <h1 className="text-xl md:text-3xl font-bold text-white truncate">
              {getHeaderTitle()}
            </h1>
          </div>

          {!isMobile && (
            <div className="flex items-center space-x-4">
              <SearchComponent />
              <button className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Row for Mobile: Search and Settings */}
        {isMobile && (
          <div className="flex items-center justify-between w-full">
            {/* Optional: Uncomment to enable mobile search */}
            {/* <div className="flex-1">
              <SearchComponent />
            </div> */}
            <button className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
