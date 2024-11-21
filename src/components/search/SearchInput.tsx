import { useState } from 'react';
import { useSearchItemsMutation, useSearchStudiosMutation, useSearchUsersMutation } from '@hooks/index';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mutations
  const { mutate: searchItems } = useSearchItemsMutation();
  const { mutate: searchStudios } = useSearchStudiosMutation();
  const { mutate: searchUsers } = useSearchUsersMutation();

  const handleSearchItems = () => {
    if (searchTerm.trim()) {
      searchItems(searchTerm);
    }
  };

  const handleSearchStudios = () => {
    if (searchTerm.trim()) {
      searchStudios(searchTerm);
    }
  };

  const handleSearchUsers = () => {
    if (searchTerm.trim()) {
      searchUsers(searchTerm);
    }
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
      <button onClick={handleSearchStudios}>Search</button>
    </div>
  );
};

export default SearchComponent;
