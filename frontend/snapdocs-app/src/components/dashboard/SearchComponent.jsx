// components/SearchComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Search, FileText } from 'lucide-react';

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
    // Handle result click - could navigate to file or folder
    console.log('Selected result:', result);
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
          className="pl-10 pr-4 py-2 w-64 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:w-80 transition-all duration-300"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {showResults && searchQuery && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-gray-800 rounded-xl border border-white/20 shadow-2xl max-h-64 overflow-y-auto z-50">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div 
                key={index} 
                onClick={() => handleResultClick(result)}
                className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">{result.name || result.original_name}</div>
                    <div className="text-gray-400 text-sm">{result.folder_name || 'General'}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-400 text-center">
              No documents found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;