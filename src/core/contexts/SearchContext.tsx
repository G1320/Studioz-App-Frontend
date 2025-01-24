import { createContext, useState, useContext, ReactNode } from 'react';
import { getLocalSearchResults } from '@shared/services/search-service'; // Import service functions
import { StudiosAndItemsSearchResults, SearchResult } from 'src/types/index'; // Assuming SearchResult is already defined

interface SearchContextType {
  searchResults: StudiosAndItemsSearchResults | SearchResult[];
  setSearchResults: React.Dispatch<React.SetStateAction<StudiosAndItemsSearchResults | SearchResult[]>>;
}

interface SearchProviderProps {
  children: ReactNode;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<StudiosAndItemsSearchResults | SearchResult[]>(
    getLocalSearchResults()
  );

  return <SearchContext.Provider value={{ searchResults, setSearchResults }}>{children}</SearchContext.Provider>;
};

export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
