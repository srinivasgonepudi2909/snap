// src/components/common/SnapDocsLogo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SnapDocsLogo = ({ linkTo = "/", className = "", textSize = "text-2xl" }) => {
  return (
    <Link to={linkTo} className={`flex items-center space-x-3 group cursor-pointer ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300">
        <div className="absolute top-0 right-0 w-7 h-7 bg-gradient-to-bl from-cyan-400 to-cyan-600 transform rotate-45 translate-x-2 -translate-y-2"></div>
        <div className="text-white font-bold text-base z-10">SD</div>
        <div className="absolute bottom-1 right-1 w-4 h-2 bg-white rounded-sm opacity-80"></div>
      </div>
      <span className={`${textSize} font-bold text-white group-hover:scale-110 transition-all duration-300`}>
        SnapDocs
      </span>
    </Link>
  );
};

export default SnapDocsLogo;