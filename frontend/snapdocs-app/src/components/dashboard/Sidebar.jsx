// components/Sidebar.jsx
import React from 'react';
import { Home, FileText, Folder, Star, Share, Trash2, User, LogOut } from 'lucide-react';

const Sidebar = ({ 
  viewMode, 
  documentsCount, 
  foldersCount, 
  username, 
  userEmail, 
  onViewModeChange, 
  onLogout 
}) => {
  const SnapDocsLogo = () => (
    <div className="flex items-center space-x-3 mb-8">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-base">SD</span>
      </div>
      <span className="text-2xl font-bold text-white">SnapDocs</span>
    </div>
  );

  const navItems = [
    {
      id: 'dashboard',
      icon: Home,
      label: 'Dashboard',
      onClick: () => onViewModeChange('dashboard')
    },
    {
      id: 'all-documents',
      icon: FileText,
      label: `All Files (${documentsCount})`,
      onClick: () => onViewModeChange('all-documents')
    },
    {
      id: 'all-folders',
      icon: Folder,
      label: `Folders (${foldersCount})`,
      onClick: () => onViewModeChange('all-folders')
    },
    {
      id: 'favorites',
      icon: Star,
      label: 'Favorites',
      onClick: () => console.log('Favorites clicked')
    },
    {
      id: 'shared',
      icon: Share,
      label: 'Shared',
      onClick: () => console.log('Shared clicked')
    },
    {
      id: 'trash',
      icon: Trash2,
      label: 'Trash',
      onClick: () => console.log('Trash clicked')
    }
  ];

  return (
    <aside className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-white/10 flex flex-col">
      <div className="p-6 flex-1">
        <SnapDocsLogo />

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = viewMode === item.id;
            
            return (
              <button 
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'text-white bg-blue-600/20' : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile at bottom */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold truncate">{username}</div>
            <div className="text-gray-400 text-sm truncate">{userEmail}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;