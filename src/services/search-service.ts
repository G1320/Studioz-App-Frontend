import { httpService } from '@services/index';
import { Item, Studio, User } from '@models/index';

const searchEndpoint = '/search';

// Search Functions
export const searchItems = async (searchTerm: string) => {
  try {
    return await httpService.get<Item[]>(`${searchEndpoint}/items`, { q: searchTerm });
  } catch (error) {
    console.error('Error searching items:', error);
    throw error;
  }
};

export const searchStudios = async (searchTerm: string) => {
  try {
    return await httpService.get<Studio[]>(`${searchEndpoint}/studios`, { q: searchTerm });
  } catch (error) {
    console.error('Error searching studios:', error);
    throw error;
  }
};

export const searchUsers = async (searchTerm: string) => {
  try {
    return await httpService.get<User[]>(`${searchEndpoint}/users`, { q: searchTerm });
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
