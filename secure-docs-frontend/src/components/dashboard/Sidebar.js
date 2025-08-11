import React from 'react';
import { Shield, Home, Folder, Upload, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: Folder, label: 'My Files', path: '/files' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">SecureDocs</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Storage Info */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-sm text-gray-400 mb-2">Storage Used</div>
        <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
          <div className="bg-red-600 h-2 rounded-full" style={{ width: '45%' }}></div>
        </div>
        <div className="text-xs text-gray-400">4.5 GB of 10 GB used</div>
      </div>
    </div>
  );
};

export default Sidebar;
