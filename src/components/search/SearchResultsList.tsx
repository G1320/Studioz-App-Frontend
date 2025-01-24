import React, { useMemo } from 'react';
import { useSearchContext, useUserContext } from '@core/contexts';
import Studio from 'src/types/studio';
import Item from 'src/types/item';
import { StudiosList, ItemPreview, ItemsList } from '@components/index';
import { GenericCarousel } from '@shared/components';
import { StudiosAndItemsSearchResults } from 'src/types/searchResult';
import { useWishlists } from '@shared/hooks/data-fetching';

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

  const renderItem = (item: Item) => <ItemPreview item={item} key={item.name.en} wishlists={wishlists} />;

  return (
    <div>
      <StudiosList studios={filteredStudios} />

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
