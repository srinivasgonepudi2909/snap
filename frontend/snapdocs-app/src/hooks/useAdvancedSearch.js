// hooks/useAdvancedSearch.js
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

const DEFAULT_FILTERS = {
  fileTypes: [],
  folders: [],
  datePreset: '',
  minSize: '',
  maxSize: '',
  sizeUnit: 'MB',
  sortBy: 'Date',
};

const SIZE_MULTIPLIERS = { KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
const DATE_PRESET_MAP = {
  'Last 24 hours': () => new Date(Date.now() - 24 * 60 * 60 * 1000),
  'Last 7 days': () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  'Last 30 days': () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  'This Year': () => new Date(new Date().getFullYear(), 0, 1),
};

export default function useAdvancedSearch(documents = []) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('recent-searches');
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('recent-searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFilterValue = (key, value) => {
    setFilters((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  };

  const getFileType = (filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : 'unknown';
  };

  const checkDateRange = (created_at, preset) => {
    const threshold = DATE_PRESET_MAP[preset]?.();
    return threshold ? new Date(created_at) >= threshold : true;
  };

  const executeSearch = useMemo(() => debounce((searchTerm) => {
    setLoading(true);
    let result = documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // File type
    if (filters.fileTypes.length > 0) {
      result = result.filter((doc) =>
        filters.fileTypes.includes(getFileType(doc.name))
      );
    }

    // Folder filter
    if (filters.folders.length > 0) {
      result = result.filter((doc) =>
        filters.folders.includes(doc.folderId)
      );
    }

    // Date filter
    if (filters.datePreset) {
      result = result.filter((doc) =>
        checkDateRange(doc.created_at, filters.datePreset)
      );
    }

    // Size filter
    if (filters.minSize || filters.maxSize) {
      const multiplier = SIZE_MULTIPLIERS[filters.sizeUnit] || 1024 ** 2;
      result = result.filter((doc) => {
        const size = doc.size || 0;
        return (
          (!filters.minSize || size >= filters.minSize * multiplier) &&
          (!filters.maxSize || size <= filters.maxSize * multiplier)
        );
      });
    }

    // Sort
    if (filters.sortBy === 'Name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'Size') {
      result.sort((a, b) => b.size - a.size);
    } else {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setResults(result);
    setLoading(false);
  }, 300), [filters, documents]);

  const handleQueryChange = (value) => {
    setQuery(value);
    if (!value) {
      setResults([]);
      return;
    }
    if (!recentSearches.includes(value)) {
      setRecentSearches((prev) => [value, ...prev.slice(0, 4)]);
    }
    executeSearch(value);
  };

  const removeRecentSearch = (value) => {
    setRecentSearches((prev) => prev.filter((v) => v !== value));
  };

  return {
    query,
    filters,
    results,
    loading,
    recentSearches,
    setQuery: handleQueryChange,
    updateFilter,
    toggleFilterValue,
    removeRecentSearch,
    clearResults: () => setResults([]),
    reRunSearch: () => executeSearch(query),
  };
}
