import React, { useMemo } from 'react';
import { useSearchContext } from '@contexts/index';
import Studio from '@models/studio';
import Item from '@models/item';
import { StudiosList } from '..';

interface SearchResultsListProps {
  allStudios: Studio[];
  allItems?: Item[];
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ allStudios, allItems }) => {
  const { searchResults } = useSearchContext();

  // This will hold the studios that match the search results
  const matchedStudios = useMemo(() => {
    return searchResults.reduce((matches: Studio[], result) => {
      const searchResult = result as Partial<Studio> | Partial<Item>; // Type assertion
      const name = searchResult?.name;
      const id = searchResult?._id;

      // Ensure result is of type Studio
      if (name || id) {
        // Match the result by name or _id
        const matchedStudio = allStudios.find((studio) => studio.name === name || studio._id === id);
        if (matchedStudio) {
          matches.push(matchedStudio);
        }
      }
      return matches;
    }, []);
  }, [searchResults, allStudios]);

  return (
    <div>
      <StudiosList studios={matchedStudios} title="Search" />
    </div>
  );
};

export default SearchResultsList;
