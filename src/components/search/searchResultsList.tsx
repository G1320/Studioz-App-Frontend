import React, { useMemo } from 'react';
import { useSearchContext, useUserContext } from '@contexts/index';
import Studio from '@models/studio';
import Item from '@models/item';
import { StudiosList, GenericCarousel, ItemPreview, ItemsList } from '@components/index'; // Assuming ItemsList exists
import { StudiosAndItemsSearchResults } from '@models/searchResult';
import { useWishlists } from '@hooks/dataFetching';

interface SearchResultsListProps {
  allStudios: Studio[];
  allItems?: Item[];
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ allStudios, allItems = [] }) => {
  const { searchResults } = useSearchContext();
  const { user } = useUserContext();
  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const results = searchResults as StudiosAndItemsSearchResults;
  const searchedItems = results.items || [];
  const searchedStudios = results.studios || [];

  // Filter studios matching the search results
  const filteredStudios = useMemo(() => {
    return allStudios.filter((studio) => searchedStudios.some((result: Studio) => result._id === studio._id));
  }, [allStudios, searchedStudios]);

  // Filter items matching the search results
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => searchedItems.some((result: Item) => result._id === item._id));
  }, [allItems, searchedItems]);

  const renderItem = (item: Item) => <ItemPreview item={item} key={item.name} wishlists={wishlists} />;

  return (
    <div>
      <StudiosList studios={filteredStudios} title="Matched Studios" />

      {filteredItems.length > 0 &&
        (filteredItems.length < 4 ? (
          <ItemsList items={filteredItems} />
        ) : (
          <GenericCarousel
            data={filteredItems}
            renderItem={renderItem}
            className="items-carousel"
            title="Matching Services"
          />
        ))}
    </div>
  );
};

export default SearchResultsList;
