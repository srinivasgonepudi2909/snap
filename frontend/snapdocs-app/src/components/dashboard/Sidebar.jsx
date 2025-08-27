// components/dashboard/Sidebar.jsx - GRAFANA THEMED
import React from 'react';
import { Home, FileText, Folder, Star, Share, Trash2, User, LogOut, TrendingUp } from 'lucide-react';

const Sidebar = ({ 
  viewMode, 
  documentsCount, 
  foldersCount, 
  username, 
  userEmail, 
  onViewModeChange, 
  onLogout,
  isMobile,
  sidebarOpen,
  setSidebarOpen
}) => {
  const SnapDocsLogo = () => (
    <div className="flex items-center space-x-3 mb-8 px-2">
      {/* Grafana-style logo with gradient */}
      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden">
        {/* Grafana spiral pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-transparent"></div>
        <div className="text-white font-bold text-base z-10 transform rotate-12">SD</div>
        <div className="absolute top-0 right-0 w-3 h-3 bg-white/20 rounded-full"></div>
      </div>
      <div>
        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
          SnapDocs
        </span>
        <div className="text-xs text-gray-400 -mt-1">Document Portal</div>
      </div>
    </div>
  );

  const handleNavClick = (callback) => {
    callback();
    if (isMobile) setSidebarOpen(false);
  };

  const navItems = [
    {
      id: 'dashboard',
      icon: Home,
      label: 'Dashboard',
      count: null,
      color: 'text-blue-400',
      onClick: () => handleNavClick(() => onViewModeChange('dashboard'))
    },
    {
      id: 'all-documents',
      icon: FileText,
      label: 'Files',
      count: documentsCount,
      color: 'text-green-400',
      onClick: () => handleNavClick(() => onViewModeChange('all-documents'))
    },
    {
      id: 'all-folders',
      icon: Folder,
      label: 'Folders',
      count: foldersCount,
      color: 'text-purple-400',
      onClick: () => handleNavClick(() => onViewModeChange('all-folders'))
    },
    {
      id: 'favorites',
      icon: Star,
      label: 'Starred',
      count: null,
      color: 'text-yellow-400',
      onClick: () => handleNavClick(() => console.log('Favorites clicked'))
    },
    {
      id: 'shared',
      icon: Share,
      label: 'Shared',
      count: null,
      color: 'text-cyan-400',
      onClick: () => handleNavClick(() => console.log('Shared clicked'))
    },
    {
      id: 'trash',
      icon: Trash2,
      label: 'Trash',
      count: null,
      color: 'text-red-400',
      onClick: () => handleNavClick(() => console.log('Trash clicked'))
    }
  ];

  return (
    <aside className="h-full flex flex-col relative">
      {/* Background with Grafana-style gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/95 to-gray-800/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
      
      <div className="relative z-10 p-6 flex-1 overflow-y-auto">
        <SnapDocsLogo />

        {/* Navigation with Grafana styling */}
        <nav className="space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
            Navigation
          </div>
          
          {navItems.map(({ id, icon: Icon, label, count, color, onClick }) => {
            const isActive = viewMode === id;
            return (
              <button 
                key={id}
                onClick={onClick}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'text-white bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-blue-500/30 shadow-lg' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full"></div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? color : ''} group-hover:scale-110 transition-transform duration-200`} />
                  <span className="font-medium">{label}</span>
                </div>
                
                {count !== null && (
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-white'
                  }`}>
                    {count}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Analytics Section - Grafana style */}
        <div className="mt-8 p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-gray-300">Quick Stats</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Storage Used</span>
              <span className="text-xs text-white font-mono">45%</span>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-1000" style={{width: '45%'}}>
                <div className="h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-2">
              2.1 GB of 5.0 GB used
            </div>
          </div>
        </div>
      </div>

      {/* User Profile - Grafana style */}
      <div className="relative z-10 p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold truncate">{username}</div>
            <div className="text-gray-400 text-sm truncate">{userEmail}</div>
          </div>
        </div>
        
        <button
          onClick={() => {
            onLogout();
            if (isMobile) setSidebarOpen(false);
          }}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors w-full p-3 rounded-lg hover:bg-red-600/20 hover:border-red-500/30 border border-transparent group"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          <span>Sign Out</span>
        </button>
      </div>
      
      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
    </aside>
  );
};

export default Sidebar;