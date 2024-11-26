import Item from './item';
import Studio from './studio';
import User from './user';

export interface StudiosAndItemsSearchResults {
  studios: Studio[];
  items: Item[];
}

export interface SearchResult {
  searchResult: Partial<Item> | Partial<Studio> | Partial<User>;
}
