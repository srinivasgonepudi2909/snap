// components/dashboard/SearchComponent.jsx - FIXED WITH COMPLETE FOLDER FILTER
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
    console.log('🔍 SearchComponent received:', {
      documents: documents.length,
      folders: folders.length,
      folderNames: folders.map(f => f.name)
    });
  }, [documents, folders]);

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

    console.log('🔍 Starting search with query:', searchQuery, 'Filters:', filters);
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
          case 'archive': return ['zip', 'rar', '7z'].includes(fileExt);
          case 'text': return ['txt', 'md', 'csv'].includes(fileExt);
          default: return true;
        }
      });
      console.log('📄 After file type filter:', results.length);
    }

    // FIXED: Folder filter - now properly handles all folders
    if (filters.folder) {
      results = results.filter(doc => {
        const docFolder = doc.folder_name || doc.folder_id || 'General';
        const match = docFolder === filters.folder;
        console.log(`📁 Checking folder: doc folder="${docFolder}", filter="${filters.folder}", match=${match}`);
        return match;
      });
      console.log('📁 After folder filter:', results.length);
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
      console.log('📅 After date filter:', results.length);
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
      console.log('📦 After size filter:', results.length);
    }

    console.log('🎯 Final search results:', results.length);
    onSearchResults(results);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const getActiveFiltersText = () => {
    const activeFilters = [];
    if (filters.fileType) activeFilters.push(`Type: ${filters.fileType}`);
    if (filters.folder) activeFilters.push(`Folder: ${filters.folder}`);
    if (filters.dateRange) activeFilters.push(`Date: ${filters.dateRange}`);
    if (filters.size) activeFilters.push(`Size: ${filters.size}`);
    return activeFilters.join(' | ');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilters({ fileType: '', folder: '', dateRange: '', size: '' });
    onSearchResults([]);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ fileType: '', folder: '', dateRange: '', size: '' });
  };

  // FIXED: Get all unique folders from both sources
  const getAllFolders = () => {
    const folderSet = new Set();
    
    // Add folders from documents (files that are in folders)
    documents.forEach(doc => {
      const folderName = doc.folder_name || doc.folder_id;
      if (folderName && folderName !== 'General') {
        folderSet.add(folderName);
      }
    });
    
    // Add folders from the folders array (all created folders)
    folders.forEach(folder => {
      if (folder.name && folder.name !== 'General') {
        folderSet.add(folder.name);
      }
    });
    
    // Always include General folder
    folderSet.add('General');
    
    const uniqueFolders = Array.from(folderSet).sort();
    console.log('📁 All available folders:', uniqueFolders);
    return uniqueFolders;
  };

  // Get all unique file types from documents
  const getAllFileTypes = () => {
    const fileTypeSet = new Set();
    documents.forEach(doc => {
      const fileName = doc.name || doc.original_name || '';
      const fileExt = fileName.split('.').pop()?.toLowerCase();
      if (fileExt) {
        fileTypeSet.add(fileExt);
      }
    });
    return Array.from(fileTypeSet).sort();
  };

  // Get document count by file type for display
  const getFileTypeCount = (type) => {
    return documents.filter(doc => {
      const fileName = doc.name || doc.original_name || '';
      const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
      
      switch (type) {
        case 'pdf': return fileExt === 'pdf';
        case 'doc': return ['doc', 'docx'].includes(fileExt);
        case 'image': return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt);
        case 'excel': return ['xls', 'xlsx'].includes(fileExt);
        case 'powerpoint': return ['ppt', 'pptx'].includes(fileExt);
        case 'archive': return ['zip', 'rar', '7z'].includes(fileExt);
        case 'text': return ['txt', 'md', 'csv'].includes(fileExt);
        default: return false;
      }
    }).length;
  };

  // Get document count by folder for display
  const getFolderCount = (folderName) => {
    return documents.filter(doc => {
      const docFolder = doc.folder_name || doc.folder_id || 'General';
      return docFolder === folderName;
    }).length;
  };

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && !event.target.closest('.search-container')) {
        setShowFilters(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && showFilters) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showFilters]);

  const uniqueFolders = getAllFolders();
  const uniqueFileTypes = getAllFileTypes();

  return (
    <div className="relative search-container">
      {/* Main Search Bar */}
      <div className="flex items-center bg-gray-800 rounded-lg border border-gray-600 overflow-hidden shadow-xl">
        {/* Search icon */}
        <div className="p-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30">
          <Search className="w-4 h-4 text-blue-400" />
        </div>
        
        <input
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => {
            console.log('🔤 Search input changed:', e.target.value);
            setSearchQuery(e.target.value);
          }}
          className="flex-1 px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0 text-sm"
        />
        
        {/* Clear search button */}
        {(searchQuery || hasActiveFilters()) && (
          <button
            onClick={clearSearch}
            className="p-1.5 text-gray-400 hover:text-white transition-colors mr-2 hover:bg-red-600/30 rounded-md"
            title="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
        
        {/* Filter button with active filters indicator */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative p-2 border-l border-gray-600 transition-all duration-200 text-sm ${
            hasActiveFilters() 
              ? 'text-orange-300 bg-orange-600/30 border-orange-500/50' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title="Advanced Filters"
        >
          <Filter className="w-3 h-3" />
          {hasActiveFilters() && (
            <div className="absolute -top-1 -right-1 min-w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center px-1">
              {getActiveFiltersCount()}
            </div>
          )}
        </button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-2 mb-1 px-3 py-2 bg-gray-700 rounded-lg border border-orange-500/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-3 h-3 text-orange-400" />
              <span className="text-orange-200 text-sm font-medium">Active Filters:</span>
              <span className="text-orange-300 text-sm">{getActiveFiltersText()}</span>
            </div>
            <button
              onClick={clearFilters}
              className="text-orange-400 hover:text-orange-300 text-sm underline transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Filters Panel - SOLID BACKGROUND */}
      {showFilters && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/30 z-[100] md:hidden"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Filter Panel - COMPLETELY SOLID */}
          <div className="absolute top-full mt-2 right-0 w-80 md:w-96 bg-gray-800 rounded-xl border border-gray-600 shadow-2xl p-4 z-[9999]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <h3 className="text-white font-semibold text-sm">Advanced Filters</h3>
                <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  {documents.length} total files
                </div>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            {/* Filters Grid */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* File Type Filter - UPDATED WITH COUNTS */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">
                  File Type ({uniqueFileTypes.length} types available)
                </label>
                <select
                  value={filters.fileType}
                  onChange={(e) => {
                    console.log('📄 File type filter changed to:', e.target.value);
                    setFilters(prev => ({ ...prev, fileType: e.target.value }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="">All Types</option>
                  <option value="pdf">📄 PDF Documents ({getFileTypeCount('pdf')})</option>
                  <option value="doc">📝 Word Documents ({getFileTypeCount('doc')})</option>
                  <option value="image">🖼️ Images ({getFileTypeCount('image')})</option>
                  <option value="excel">📊 Spreadsheets ({getFileTypeCount('excel')})</option>
                  <option value="powerpoint">📋 Presentations ({getFileTypeCount('powerpoint')})</option>
                  <option value="archive">🗜️ Archives ({getFileTypeCount('archive')})</option>
                  <option value="text">📃 Text Files ({getFileTypeCount('text')})</option>
                </select>
              </div>

              {/* FIXED: Folder Filter - NOW SHOWS ALL FOLDERS */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">
                  Folder ({uniqueFolders.length} folders available)
                </label>
                <select
                  value={filters.folder}
                  onChange={(e) => {
                    console.log('📁 Folder filter changed to:', e.target.value);
                    setFilters(prev => ({ ...prev, folder: e.target.value }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="">All Folders</option>
                  {uniqueFolders.map(folderName => {
                    const count = getFolderCount(folderName);
                    const folderIcon = folderName === 'General' ? '📂' : 
                      folders.find(f => f.name === folderName)?.icon || '📁';
                    
                    return (
                      <option key={folderName} value={folderName}>
                        {folderIcon} {folderName} ({count})
                      </option>
                    );
                  })}
                </select>
                
                {/* Debug info for folder filter */}
                <div className="mt-1 text-xs text-gray-500">
                  Debug: Found {folders.length} created folders, {uniqueFolders.length} total folders
                </div>
              </div>

              {/* Date Range Filter - ENHANCED */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => {
                    console.log('📅 Date filter changed to:', e.target.value);
                    setFilters(prev => ({ ...prev, dateRange: e.target.value }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="">All Dates</option>
                  <option value="today">📅 Today</option>
                  <option value="week">📅 This Week</option>
                  <option value="month">📅 This Month</option>
                  <option value="year">📅 This Year</option>
                </select>
              </div>

              {/* File Size Filter - ENHANCED */}
              <div>
                <label className="block text-gray-300 text-xs font-medium mb-2">
                  File Size
                </label>
                <select
                  value={filters.size}
                  onChange={(e) => {
                    console.log('📦 Size filter changed to:', e.target.value);
                    setFilters(prev => ({ ...prev, size: e.target.value }));
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="">All Sizes</option>
                  <option value="small">📦 Small (&lt; 1MB)</option>
                  <option value="medium">📦 Medium (1-10MB)</option>
                  <option value="large">📦 Large (&gt; 10MB)</option>
                </select>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
              <div className="text-xs text-gray-300 space-y-1">
                <div className="flex justify-between">
                  <span>Total Documents:</span>
                  <span className="text-white font-mono">{documents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Folders:</span>
                  <span className="text-white font-mono">{uniqueFolders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>File Types:</span>
                  <span className="text-white font-mono">{uniqueFileTypes.length}</span>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex space-x-2 pt-3 border-t border-gray-600">
              <button
                onClick={clearFilters}
                className="flex-1 px-3 py-2 text-xs text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-3 py-2 text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

      {/* Search Status Indicator */}
      {(searchQuery || hasActiveFilters()) && (
        <div className="mt-2 px-3 py-2 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 border border-blue-500/50 rounded-lg">
          <div className="text-blue-200 text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <span>
                🔍 {searchQuery && `Searching for: "${searchQuery}"`}
                {hasActiveFilters() && (
                  <span className="ml-2 text-orange-300 text-xs">
                    ({getActiveFiltersCount()} filters active)
                  </span>
                )}
              </span>
            </div>
            <button 
              onClick={clearSearch}
              className="text-blue-300 hover:text-blue-200 underline ml-2 transition-colors text-xs"
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