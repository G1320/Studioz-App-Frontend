import { useState } from 'react';
import { useSearchStudiosAndItemsMutation } from '@hooks/index';
import { useNavigate } from 'react-router-dom';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { mutate: searchStudiosAndItems } = useSearchStudiosAndItemsMutation();

  const handleSearchStudiosAndItems = () => {
    if (searchTerm.trim()) {
      searchStudiosAndItems(searchTerm);
    }
    navigate('/search');
  };

  return (
    <div className="search-input-wrapper">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term on input change
        placeholder="Search items or studios..."
        className="search-input"
      />
      <button onClick={handleSearchStudiosAndItems}>🔎</button>
    </div>
  );
};

export default SearchComponent;
