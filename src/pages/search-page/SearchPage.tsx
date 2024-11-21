import SearchResultsList from '@components/search/SearchResultsList';
import Item from '@models/item';
import Studio from '@models/studio';

interface SearchPageProps {
  studios: Studio[];
  items?: Item[];
}

const SearchPage: React.FC<SearchPageProps> = ({ studios, items }) => {
  return <SearchResultsList allStudios={studios} allItems={items} />;
};

export default SearchPage;
