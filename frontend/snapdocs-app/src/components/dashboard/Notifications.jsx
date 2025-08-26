// components/Notifications.jsx
import React from 'react';
import { AlertCircle, Eye } from 'lucide-react';

const Notifications = ({ notifications }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`px-6 py-3 rounded-xl shadow-2xl border backdrop-blur-sm transition-all duration-300 animate-slide-up ${
            notification.type === 'error' 
              ? 'bg-red-600/20 border-red-500/50 text-red-300' 
              : notification.type === 'info'
              ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
              : 'bg-green-600/20 border-green-500/50 text-green-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : notification.type === 'info' ? (
              <Eye className="w-5 h-5" />
            ) : (
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;