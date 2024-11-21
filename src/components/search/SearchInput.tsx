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
      searchItems(searchTerm); // Trigger search for items with the inputted search term
    }
  };

  const handleSearchStudios = () => {
    if (searchTerm.trim()) {
      searchStudios(searchTerm); // Trigger search for studios with the inputted search term
    }
  };

  const handleSearchUsers = () => {
    if (searchTerm.trim()) {
      searchUsers(searchTerm); // Trigger search for users with the inputted search term
    }
  };

  return (
    <div>
      {/* Controlled search input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term on input change
        placeholder="Search items, studios, or users..."
        className="search-input"
      />

      {/* Buttons to trigger respective searches */}
      <button onClick={handleSearchItems}>Search Items</button>
      <button onClick={handleSearchStudios}>Search Studios</button>
      <button onClick={handleSearchUsers}>Search Users</button>
    </div>
  );
};

export default SearchComponent;
