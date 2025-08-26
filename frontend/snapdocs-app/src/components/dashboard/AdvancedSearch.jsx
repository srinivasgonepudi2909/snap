// components/dashboard/AdvancedSearch.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import debounce from 'lodash.debounce';

const FILE_TYPES = ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'png', 'zip'];
const SORT_OPTIONS = ['Name', 'Date', 'Size'];
const DATE_PRESETS = ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'This Year'];
const SIZE_UNITS = ['KB', 'MB', 'GB'];

const AdvancedSearch = ({ documents = [], folders = [], onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [fileTypes, setFileTypes] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [datePreset, setDatePreset] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [sizeUnit, setSizeUnit] = useState('MB');
  const [sortBy, setSortBy] = useState('Date');
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('recent-searches');
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('recent-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearch = useMemo(() => debounce((searchTerm) => {
    let results = documents.filter(doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (fileTypes.length > 0) {
      results = results.filter(doc => fileTypes.includes(doc.type));
    }
    if (selectedFolders.length > 0) {
      results = results.filter(doc => selectedFolders.includes(doc.folderId));
    }
    if (datePreset) {
      const now = new Date();
      const threshold = {
        'Last 24 hours': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        'Last 7 days': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        'Last 30 days': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        'This Year': new Date(now.getFullYear(), 0, 1),
      }[datePreset];
      results = results.filter(doc => new Date(doc.created_at) >= threshold);
    }
    if (minSize || maxSize) {
      const multiplier = { KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 }[sizeUnit];
      results = results.filter(doc => {
        const size = doc.size;
        return (!minSize || size >= minSize * multiplier) &&
               (!maxSize || size <= maxSize * multiplier);
      });
    }
    if (sortBy === 'Name') results.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'Date') results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === 'Size') results.sort((a, b) => b.size - a.size);

    setFiltered(results);
    onSearchResults(results);
  }, 300), [fileTypes, selectedFolders, datePreset, minSize, maxSize, sizeUnit, sortBy, documents]);

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value) {
      if (!recentSearches.includes(value)) {
        setRecentSearches(prev => [value, ...prev.slice(0, 4)]);
      }
      handleSearch(value);
    } else {
      setFiltered([]);
    }
  };

  const toggleFilter = (value, list, setList) => {
    setList(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const activeFilterCount = [fileTypes.length, selectedFolders.length, datePreset ? 1 : 0, minSize || maxSize ? 1 : 0]
    .reduce((acc, val) => acc + (val ? 1 : 0), 0);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          placeholder="Search files..."
          value={query}
          onChange={handleQueryChange}
        />
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="relative touch-friendly"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-300" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 text-xs bg-purple-600 px-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {filtersOpen && (
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* File Types */}
          <div>
            <h4 className="text-sm font-semibold mb-2">File Types</h4>
            <div className="flex flex-wrap gap-2">
              {FILE_TYPES.map(type => (
                <label key={type} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={fileTypes.includes(type)}
                    onChange={() => toggleFilter(type, fileTypes, setFileTypes)}
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Folders */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Folders</h4>
            <div className="flex flex-wrap gap-2">
              {folders.map(folder => (
                <label key={folder.id} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={selectedFolders.includes(folder.id)}
                    onChange={() => toggleFilter(folder.id, selectedFolders, setSelectedFolders)}
                  />
                  <span>{folder.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Presets */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Date Range</h4>
            <div className="flex flex-wrap gap-2">
              {DATE_PRESETS.map(preset => (
                <button
                  key={preset}
                  className={`px-2 py-1 rounded text-sm ${datePreset === preset ? 'bg-purple-600' : 'bg-gray-700'}`}
                  onClick={() => setDatePreset(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* File Size Range */}
          <div>
            <h4 className="text-sm font-semibold mb-2">File Size</h4>
            <div className="flex space-x-2 items-center">
              <input
                type="number"
                placeholder="Min"
                className="w-20 px-2 py-1 bg-gray-700 rounded"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-20 px-2 py-1 bg-gray-700 rounded"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
              />
              <select
                className="bg-gray-700 px-2 py-1 rounded"
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value)}
              >
                {SIZE_UNITS.map(unit => <option key={unit}>{unit}</option>)}
              </select>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Sort By</h4>
            <select
              className="w-full bg-gray-700 px-2 py-1 rounded"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(option => <option key={option}>{option}</option>)}
            </select>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Recent Searches</h4>
              <ul className="text-sm space-y-1">
                {recentSearches.map((term, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <button
                      className="text-purple-400 hover:underline"
                      onClick={() => {
                        setQuery(term);
                        handleSearch(term);
                      }}
                    >{term}</button>
                    <button onClick={() => {
                      setRecentSearches(prev => prev.filter(t => t !== term));
                    }}><X className="w-3 h-3 text-gray-400" /></button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Search Results (Optional if parent not rendering) */}
      {filtered.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Search Results</h3>
          <ul className="divide-y divide-gray-700">
            {filtered.map(doc => (
              <li key={doc.id} className="py-2">
                <div className="text-white font-medium">{doc.name}</div>
                <div className="text-xs text-gray-400">{doc.type} - {Math.round(doc.size / 1024)} KB - {new Date(doc.created_at).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
