import { httpService } from '@shared/services';
import { SearchResult, StudiosAndItemsSearchResults } from 'src/types/index';
import { parseJSON, stringifyJSON } from '@shared/utils';

const searchEndpoint = '/search';

// Get search results from local storage
export const getLocalSearchResults = (): StudiosAndItemsSearchResults | SearchResult[] => {
  return parseJSON<StudiosAndItemsSearchResults | SearchResult[]>('searchResults', null) || [];
};

// Save search results to local storage
export const setLocalSearchResults = (results: StudiosAndItemsSearchResults | SearchResult[]): void => {
  stringifyJSON('searchResults', results);
};

export const searchStudiosAndItems = async (searchTerm: string) => {
  try {
    return await httpService.get<StudiosAndItemsSearchResults>(`${searchEndpoint}/all`, { q: searchTerm });
  } catch (error) {
    console.error('Error searching studios and items:', error);
    throw error;
  }
};

export const searchItems = async (searchTerm: string) => {
  try {
    return await httpService.get<SearchResult[]>(`${searchEndpoint}/items`, { q: searchTerm });
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
};

export const searchStudios = async (searchTerm: string) => {
  try {
    return await httpService.get<SearchResult[]>(`${searchEndpoint}/studios`, { q: searchTerm });
  } catch (error) {
    console.error('Error searching studios:', error);
    throw error;
  }
};

export const searchUsers = async (searchTerm: string) => {
  try {
    return await httpService.get<SearchResult[]>(`${searchEndpoint}/users`, { q: searchTerm });
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
