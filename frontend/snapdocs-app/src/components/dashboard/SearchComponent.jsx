// components/dashboard/SearchComponent.jsx - GRAFANA THEMED
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Zap } from 'lucide-react';

const SearchComponent = ({ documents = [], folders = [], onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fileType: '',
    folder: '',
    dateRange: '',
    size: ''
  });

  useEffect(() => {
    console.log('🔍 SearchComponent received documents:', documents.length);
  }, [documents]);

  useEffect(() => {
    console.log('🔄 Search triggered - Query:', searchQuery, 'Documents:', documents.length);
    performSearch();
  }, [searchQuery, filters, documents]);

  const performSearch = () => {
    if (!searchQuery.trim() && !hasActiveFilters()) {
      console.log('❌ No search query or filters, clearing results');
      onSearchResults([]);
      return;
    }

    console.log('🔍 Starting search with query:', searchQuery);
    let results = [...documents];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(doc => {
        const fileName = (doc.name || doc.original_name || '').toLowerCase();
        const folderName = (doc.folder_name || doc.folder_id || '').toLowerCase();
        return fileName.includes(query) || folderName.includes(query);
      });
    }

    // Apply filters
    if (filters.fileType) {
      results = results.filter(doc => {
        const fileName = doc.name || doc.original_name || '';
        const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
        
        switch (filters.fileType) {
          case 'pdf': return fileExt === 'pdf';
          case 'doc': return ['doc', 'docx'].includes(fileExt);
          case 'image': return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt);
          case 'excel': return ['xls', 'xlsx'].includes(fileExt);
          case 'powerpoint': return ['ppt', 'pptx'].includes(fileExt);
          default: return true;
        }
      });
    }

    if (filters.folder) {
      results = results.filter(doc => {
        const docFolder = doc.folder_name || doc.folder_id || 'General';
        return docFolder === filters.folder;
      });
    }

    if (filters.dateRange) {
      const now = new Date();
      let cutoffDate;
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          cutoffDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          cutoffDate = null;
      }

      if (cutoffDate) {
        results = results.filter(doc => {
          if (!doc.created_at) return false;
          const docDate = new Date(doc.created_at);
          return docDate >= cutoffDate;
        });
      }
    }

    if (filters.size) {
      results = results.filter(doc => {
        const size = doc.file_size || 0;
        switch (filters.size) {
          case 'small': return size < 1024 * 1024;
          case 'medium': return size >= 1024 * 1024 && size <= 10 * 1024 * 1024;
          case 'large': return size > 10 * 1024 * 1024;
          default: return true;
        }
      });
    }

    console.log('🎯 Final search results:', results.length);
    onSearchResults(results);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilters({ fileType: '', folder: '', dateRange: '', size: '' });
    onSearchResults([]);
  };

  const clearFilters = () => {
    setFilters({ fileType: '', folder: '', dateRange: '', size: '' });
  };

  const uniqueFolders = [...new Set(
    documents
      .map(doc => doc.folder_name || doc.folder_id || 'General')
      .filter(Boolean)
  )];

  return (
    <div className="relative">
      {/* Grafana-style Main Search Bar */}
      <div className="flex items-center bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700/50 overflow-hidden shadow-xl">
        {/* Search icon with Grafana glow */}
        <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <Search className="w-5 h-5 text-blue-400" />
        </div>
        
        <input
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => {
            console.log('🔤 Search input changed:', e.target.value);
            setSearchQuery(e.target.value);
          }}
          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0"
        />
        
        {/* Quick actions */}
        {(searchQuery || hasActiveFilters()) && (
          <button
            onClick={clearSearch}
            className="p-2 text-gray-400 hover:text-white transition-colors mr-2 hover:bg-red-600/20 rounded-md"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Grafana-style filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 border-l border-gray-700/50 transition-all duration-200 relative ${
            hasActiveFilters() 
              ? 'text-orange-400 bg-orange-600/20' 
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Advanced Filters"
        >
          <Filter className="w-4 h-4" />
          {hasActiveFilters() && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse">
              <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping"></div>
            </div>
          )}
        </button>
      </div>

      {/* Grafana-style Filters Panel */}
      {showFilters && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl p-6 min-w-96 z-50">
          {/* Header with Grafana styling */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <h3 className="text-white font-semibold">Advanced Filters</h3>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* File Type Filter */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                File Type
              </label>
              <select
                value={filters.fileType}
                onChange={(e) => setFilters(prev => ({ ...prev, fileType: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700/80 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              >
                <option value="">All Types</option>
                <option value="pdf">📄 PDF Documents</option>
                <option value="doc">📝 Word Documents</option>
                <option value="image">🖼️ Images</option>
                <option value="excel">📊 Spreadsheets</option>
                <option value="powerpoint">📋 Presentations</option>
              </select>
            </div>

            {/* Folder Filter */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Folder
              </label>
              <select
                value={filters.folder}
                onChange={(e) => setFilters(prev => ({ ...prev, folder: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700/80 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              >
                <option value="">All Folders</option>
                {uniqueFolders.map(folder => (
                  <option key={folder} value={folder}>📁 {folder}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700/80 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              >
                <option value="">All Dates</option>
                <option value="today">📅 Today</option>
                <option value="week">📅 This Week</option>
                <option value="month">📅 This Month</option>
                <option value="year">📅 This Year</option>
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                File Size
              </label>
              <select
                value={filters.size}
                onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700/80 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              >
                <option value="">All Sizes</option>
                <option value="small">📦 Small (&lt; 1MB)</option>
                <option value="medium">📦 Medium (1-10MB)</option>
                <option value="large">📦 Large (&gt; 10MB)</option>
              </select>
            </div>
          </div>

          {/* Filter Actions with Grafana styling */}
          <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-700/50">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-2 text-gray-300 border border-gray-600/50 rounded-lg hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-200"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Apply Filters
            </button>
          </div>

          {/* Active Filters with Grafana styling */}
          {hasActiveFilters() && (
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <div className="text-xs text-gray-400 mb-2">Active filters:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <span
                      key={key}
                      className="px-3 py-1 bg-gradient-to-r from-orange-600/20 to-red-600/20 text-orange-300 text-xs rounded-full flex items-center space-x-2 border border-orange-500/30"
                    >
                      <span>{key}: {value}</span>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                        className="hover:text-orange-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Status Indicator */}
      {(searchQuery || hasActiveFilters()) && (
        <div className="mt-3 px-4 py-3 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-md border border-blue-500/30 rounded-lg">
          <div className="text-blue-200 text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>
                🔍 {searchQuery && `Searching for: "${searchQuery}"`}
                {hasActiveFilters() && (
                  <span className="ml-2 text-orange-300">
                    ({Object.values(filters).filter(v => v).length} filters active)
                  </span>
                )}
              </span>
            </div>
            <button 
              onClick={clearSearch}
              className="text-blue-300 hover:text-blue-200 underline ml-2 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;