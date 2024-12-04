import { useEffect, useRef, useState } from 'react';
import { useSearchStudiosAndItemsMutation, useDebounce, useLanguageNavigate } from '@hooks/index';
import SearchIcon from '@mui/icons-material/Search';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const langNavigate = useLanguageNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: searchStudiosAndItems } = useSearchStudiosAndItemsMutation();

  const handleSearchStudiosAndItems = () => {
    if (debouncedSearchTerm.trim()) {
      searchStudiosAndItems(debouncedSearchTerm);
    }
    langNavigate('/search');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchStudiosAndItems();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 3) {
      searchStudiosAndItems(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchStudiosAndItems]);

  return (
    <div className="search-input-wrapper">
      <SearchIcon className="search-button" />
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search studios and services..."
        className="search-input"
      />
    </div>
  );
};

export default SearchInput;
