import { httpService } from '@services/index';
import { SearchResult } from '@models/index';
import { parseJSON, stringifyJSON } from '@utils/storageUtils';

const searchEndpoint = '/search';

// Get search results from local storage
export const getLocalSearchResults = (): SearchResult[] => {
  return parseJSON<SearchResult[]>('searchResults', null) || [];
};

// Save search results to local storage
export const setLocalSearchResults = (results: SearchResult[]): void => {
  stringifyJSON('searchResults', results);
};
// Search Functions
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
