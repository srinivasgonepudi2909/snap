// components/dashboard/SearchComponent.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchComponent = ({ documents = [], folders = [], onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fileType: '',
    folder: '',
    dateRange: '',
    size: ''
  });

  // Debug: Log when component receives new documents
  useEffect(() => {
    console.log('🔍 SearchComponent received documents:', documents.length);
  }, [documents]);

  // Perform search when query or filters change
  useEffect(() => {
    console.log('🔄 Search triggered - Query:', searchQuery, 'Documents:', documents.length);
    performSearch();
  }, [searchQuery, filters, documents]);

  const performSearch = () => {
    // If no search query and no filters, return empty results
    if (!searchQuery.trim() && !hasActiveFilters()) {
      console.log('❌ No search query or filters, clearing results');
      onSearchResults([]);
      return;
    }

    console.log('🔍 Starting search with query:', searchQuery);
    let results = [...documents];
    console.log('📋 Starting with documents:', results.length);

    // Text search - search in multiple fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      console.log('🔎 Searching for:', query);
      
      results = results.filter(doc => {
        const fileName = (doc.name || doc.original_name || '').toLowerCase();
        const folderName = (doc.folder_name || doc.folder_id || '').toLowerCase();
        
        const matches = fileName.includes(query) || folderName.includes(query);
        
        if (matches) {
          console.log('✅ Match found:', doc.name || doc.original_name);
        }
        
        return matches;
      });
      
      console.log('🎯 Text search results:', results.length);
    }

    // File type filter
    if (filters.fileType) {
      console.log('🗂️ Applying file type filter:', filters.fileType);
      results = results.filter(doc => {
        const fileName = doc.name || doc.original_name || '';
        const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
        
        switch (filters.fileType) {
          case 'pdf': 
            return fileExt === 'pdf';
          case 'doc': 
            return ['doc', 'docx'].includes(fileExt);
          case 'image': 
            return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt);
          case 'excel': 
            return ['xls', 'xlsx'].includes(fileExt);
          case 'powerpoint': 
            return ['ppt', 'pptx'].includes(fileExt);
          default: 
            return true;
        }
      });
      console.log('🗂️ After file type filter:', results.length);
    }

    // Folder filter
    if (filters.folder) {
      console.log('📁 Applying folder filter:', filters.folder);
      results = results.filter(doc => {
        const docFolder = doc.folder_name || doc.folder_id || 'General';
        return docFolder === filters.folder;
      });
      console.log('📁 After folder filter:', results.length);
    }

    // Date range filter
    if (filters.dateRange) {
      console.log('📅 Applying date filter:', filters.dateRange);
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
      console.log('📅 After date filter:', results.length);
    }

    // Size filter
    if (filters.size) {
      console.log('📏 Applying size filter:', filters.size);
      results = results.filter(doc => {
        const size = doc.file_size || 0;
        switch (filters.size) {
          case 'small': 
            return size < 1024 * 1024; // < 1MB
          case 'medium': 
            return size >= 1024 * 1024 && size <= 10 * 1024 * 1024; // 1-10MB
          case 'large': 
            return size > 10 * 1024 * 1024; // > 10MB
          default: 
            return true;
        }
      });
      console.log('📏 After size filter:', results.length);
    }

    console.log('🎯 Final search results:', results.length);
    console.log('📋 Results:', results.map(r => r.name || r.original_name));
    
    // Return results to parent component
    onSearchResults(results);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  const clearSearch = () => {
    console.log('🧹 Clearing search');
    setSearchQuery('');
    setFilters({ fileType: '', folder: '', dateRange: '', size: '' });
    onSearchResults([]);
  };

  const clearFilters = () => {
    console.log('🧹 Clearing filters');
    setFilters({ fileType: '', folder: '', dateRange: '', size: '' });
  };

  // Get unique folder names for filter dropdown
  const uniqueFolders = [...new Set(
    documents
      .map(doc => doc.folder_name || doc.folder_id || 'General')
      .filter(Boolean)
  )];

  console.log('📁 Available folders for filter:', uniqueFolders);

  return (
    <div className="relative">
      {/* Main Search Bar */}
      <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <input
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => {
            console.log('🔤 Search input changed:', e.target.value);
            setSearchQuery(e.target.value);
          }}
          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
        />
        {(searchQuery || hasActiveFilters()) && (
          <button
            onClick={clearSearch}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 border-l border-white/20 transition-colors relative ${
            hasActiveFilters() ? 'text-blue-400 bg-blue-600/20' : 'text-gray-400 hover:text-white'
          }`}
          title="Filters"
        >
          <Filter className="w-4 h-4" />
          {hasActiveFilters() && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 rounded-xl border border-white/20 shadow-2xl p-4 min-w-80 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Search Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* File Type Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">File Type</label>
              <select
                value={filters.fileType}
                onChange={(e) => {
                  console.log('🗂️ File type filter changed:', e.target.value);
                  setFilters(prev => ({ ...prev, fileType: e.target.value }));
                }}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="pdf">PDF Documents</option>
                <option value="doc">Word Documents</option>
                <option value="image">Images</option>
                <option value="excel">Spreadsheets</option>
                <option value="powerpoint">Presentations</option>
              </select>
            </div>

            {/* Folder Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Folder</label>
              <select
                value={filters.folder}
                onChange={(e) => {
                  console.log('📁 Folder filter changed:', e.target.value);
                  setFilters(prev => ({ ...prev, folder: e.target.value }));
                }}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Folders</option>
                {uniqueFolders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => {
                  console.log('📅 Date filter changed:', e.target.value);
                  setFilters(prev => ({ ...prev, dateRange: e.target.value }));
                }}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">File Size</label>
              <select
                value={filters.size}
                onChange={(e) => {
                  console.log('📏 Size filter changed:', e.target.value);
                  setFilters(prev => ({ ...prev, size: e.target.value }));
                }}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Sizes</option>
                <option value="small">Small (&lt; 1MB)</option>
                <option value="medium">Medium (1-10MB)</option>
                <option value="large">Large (&gt; 10MB)</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={clearFilters}
              className="flex-1 px-3 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>

          {/* Active Filters Indicator */}
          {hasActiveFilters() && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-2">Active filters:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <span
                      key={key}
                      className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full flex items-center space-x-1"
                    >
                      <span>{key}: {value}</span>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                        className="hover:text-blue-200"
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

      {/* Search Results Indicator */}
      {(searchQuery || hasActiveFilters()) && (
        <div className="mt-3 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg">
          <div className="text-blue-300 text-sm flex items-center justify-between">
            <span>
              🔍 {searchQuery && `Searching for: "${searchQuery}"`}
              {hasActiveFilters() && (
                <span className="ml-2">({Object.values(filters).filter(v => v).length} filters active)</span>
              )}
            </span>
            <button 
              onClick={clearSearch}
              className="text-blue-400 hover:text-blue-300 underline ml-2"
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