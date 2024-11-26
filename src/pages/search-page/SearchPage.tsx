import SearchInput from '@components/search/SearchInput';
import SearchResultsList from '@components/search/SearchResultsList';
import Item from 'src/types/item';
import Studio from 'src/types/studio';

interface SearchPageProps {
  studios: Studio[];
  items?: Item[];
}

const SearchPage: React.FC<SearchPageProps> = ({ studios, items }) => {
  return (
    <section className="search-page">
      <SearchInput />

      <SearchResultsList allStudios={studios} allItems={items} />
    </section>
  );
};

export default SearchPage;
