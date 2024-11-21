import React from 'react';
import { useSearchContext } from '@contexts/index';
import Studio from '@models/studio';
import Item from '@models/item';

const SearchResultsList: React.FC = () => {
  const { searchResults } = useSearchContext();
  console.log('searchResults: ', searchResults);

  return (
    <div>
      <ul>
        {searchResults.map((result, index) => {
          const searchResult = result as Partial<Studio> | Partial<Item>; // Type assertion
          const name = searchResult?.name;
          const id = searchResult?._id || index; // Use index as fallback if _id is missing

          return <li key={id}>{name ? name : 'No name available'}</li>;
        })}
      </ul>
    </div>
  );
};

export default SearchResultsList;
