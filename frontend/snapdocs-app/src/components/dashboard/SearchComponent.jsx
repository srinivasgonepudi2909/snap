// components/dashboard/SearchComponent.jsx - Advanced Version
import React, { useState } from 'react';
import AdvancedSearch from './AdvancedSearch';

const SearchComponent = ({ documents = [], folders = [], onSearchResults }) => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    if (onSearchResults) {
      onSearchResults(results);
    }
  };

  return (
    <div className="relative z-50">
      <AdvancedSearch
        documents={documents}
        folders={folders}
        onSearchResults={handleSearchResults}
      />
    </div>
  );
};

export default SearchComponent;
