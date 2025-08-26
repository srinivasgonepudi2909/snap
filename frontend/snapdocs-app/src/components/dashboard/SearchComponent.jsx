// components/dashboard/SearchComponent.jsx - Fixed Version
import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileText, X } from 'lucide-react';

const SearchComponent = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_DOCUMENT_API}/api/v1/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setShowResults(true);
        onSearchResults && onSearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery('');
    console.log('Selected result:', result);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'xls': case 'xlsx': return '📊';
      case 'ppt': case 'pptx': return '📋';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
      case 'zip': case 'rar': return '🗜️';
      case 'txt': return '📃';
      default: return '📄';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Search documents..."
          className="pl-10 pr-10 py-2 w-64 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:w-80 transition-all duration-300"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* FIXED: Better styled dropdown */}
      {showResults && searchQuery && (
        <div className="absolute top-full mt-2 left-0 w-full bg-gray-800/95 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl max-h-80 overflow-y-auto z-50">
          {searchResults.length > 0 ? (
            <>
              <div className="px-4 py-2 border-b border-white/10">
                <div className="text-xs text-gray-400 font-medium">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </div>
              </div>
              {searchResults.map((result, index) => (
                <div 
                  key={index} 
                  onClick={() => handleResultClick(result)}
                  className="px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors group border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl flex-shrink-0">
                      {getFileIcon(result.name || result.original_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate text-sm group-hover:text-blue-300 transition-colors">
                        {result.name || result.original_name}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="text-gray-400 text-xs">
                          📁 {result.folder_name || 'General'}
                        </div>
                        {result.file_size && (
                          <>
                            <div className="text-gray-500 text-xs">•</div>
                            <div className="text-gray-400 text-xs">
                              {(result.file_size / 1024 / 1024).toFixed(1)} MB
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-500 group-hover:text-gray-400 transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-gray-400 text-sm">
                No documents found for "{searchQuery}"
              </div>
              <div className="text-gray-500 text-xs mt-1">
                Try a different search term
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;