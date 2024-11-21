import Item from './item';
import Studio from './studio';
import User from './user';

export default interface searchResults {
  searchResult: Partial<Item> | Partial<Studio> | Partial<User>;
}
