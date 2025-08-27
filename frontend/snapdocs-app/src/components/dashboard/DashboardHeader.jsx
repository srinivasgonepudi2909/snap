// components/dashboard/DashboardHeader.jsx - GRAFANA THEMED
import React from 'react';
import { ArrowLeft, Settings, Menu, X, Bell } from 'lucide-react';

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
    <header className="sticky top-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 p-4 md:p-6 flex-shrink-0 z-40 shadow-lg">
      {/* Grafana-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10"></div>
      
      <div className="flex items-center justify-between w-full relative z-10">
        
        {/* Left Side: Menu + Back Button + Title */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 flex-shrink-0"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {showBackButton && (
            <button 
              onClick={onBackToDashboard}
              className="p-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 flex-shrink-0 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            </button>
          )}

          {/* Grafana-style title with gradient */}
          <div className="flex items-center space-x-3">
            <h1 className="text-lg md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 truncate">
              {getHeaderTitle()}
            </h1>
            
            {/* Status indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Online</span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Notifications */}
          <button className="relative p-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 group">
            <Bell className="w-5 h-5 group-hover:animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
          </button>

          {/* Settings with Grafana-style tooltip */}
          <div className="relative group">
            <button className="p-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200">
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-800/90 backdrop-blur-md text-white text-sm rounded-lg border border-gray-700/50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Dashboard Settings
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 rotate-45 border-l border-t border-gray-700/50"></div>
            </div>
          </div>

          {/* Time display - Grafana style */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-800/60 backdrop-blur-md rounded-lg border border-gray-700/50">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300 font-mono">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Grafana-style bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </header>
  );
};

export default DashboardHeader;