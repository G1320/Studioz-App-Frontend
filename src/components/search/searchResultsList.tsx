import React from 'react';
import { useSearchContext } from '@contexts/index';

const SearchResultsList: React.FC = () => {
  const { searchResults } = useSearchContext();

  return (
    <div>
      {searchResults.length === 0 ? (
        <p>No search results found</p>
      ) : (
        <pre>{JSON.stringify(searchResults, null, 2)}</pre>
      )}
    </div>
  );
};

export default SearchResultsList;
