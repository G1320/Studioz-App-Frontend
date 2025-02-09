import { useEffect, useRef, useState } from 'react';
import { useSearchStudiosAndItemsMutation, useDebounce, useLanguageNavigate } from '@shared/hooks';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

export const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const langNavigate = useLanguageNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');

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
      <label htmlFor="search-input" className="visually-hidden">
        Search Studios and Services
      </label>
      <SearchIcon className="search-button" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('search.placeholder')}
        className="search-input"
        aria-label="Search Studios and Services"
      />
    </div>
  );
};

export default SearchInput;
