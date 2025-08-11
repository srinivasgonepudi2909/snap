import React from 'react';
import { Shield, Home, Folder, Upload, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative shadow-lg">
            {/* Document Icon */}
            <div className="absolute inset-1 bg-white/20 rounded-lg"></div>
            <div className="absolute top-2 left-2 w-6 h-4 bg-white rounded-sm"></div>
            <div className="absolute top-3 left-3 w-4 h-0.5 bg-blue-600"></div>
            <div className="absolute top-4 left-3 w-3 h-0.5 bg-blue-600"></div>
            <div className="absolute bottom-2 right-1 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded transform rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-wide">SnapDocs</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white">
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
