import { createContext, useState, useContext, ReactNode } from 'react';
import { getLocalSearchResults } from '@services/search-service'; // Import service functions
import { SearchResult } from '@models/index'; // Assuming SearchResult is already defined

interface SearchContextType {
  searchResults: SearchResult[];
  setSearchResults: React.Dispatch<React.SetStateAction<SearchResult[]>>;
}

interface SearchProviderProps {
  children: ReactNode;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>(getLocalSearchResults());

  return <SearchContext.Provider value={{ searchResults, setSearchResults }}>{children}</SearchContext.Provider>;
};

export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
