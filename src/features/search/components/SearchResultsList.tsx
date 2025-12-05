import React, { useMemo } from 'react';
import { useSearchContext, useUserContext } from '@core/contexts';
import Studio from 'src/types/studio';
import Item from 'src/types/item';
import { StudiosList, ItemCard, ItemsList } from '@features/entities';
import { GenericCarousel } from '@shared/components';
import { StudiosAndItemsSearchResults } from 'src/types/searchResult';
import { useWishlists } from '@shared/hooks';

interface SearchResultsListProps {
  allStudios: Studio[];
  allItems?: Item[];
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({ allStudios, allItems = [] }) => {
  const { searchResults } = useSearchContext();
  const { user } = useUserContext();
  const { data: wishlists = [] } = useWishlists(user?._id || '');

  const results = searchResults as StudiosAndItemsSearchResults;
  const filteredStudios = useMemo(() => {
    const searchedStudios = results.studios || [];
    return allStudios.filter((studio) => searchedStudios.some((result: Studio) => result._id === studio._id));
  }, [allStudios, results.studios]);

  // Filter items matching the search results
  const filteredItems = useMemo(() => {
    const searchedItems = results.items || [];
    return allItems.filter((item) => searchedItems.some((result: Item) => result._id === item._id));
  }, [allItems, results.items]);

  const renderItem = (item: Item) => <ItemCard item={item} key={item.name.en} wishlists={wishlists} />;

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
