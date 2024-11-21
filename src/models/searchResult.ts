import Item from './item';
import Studio from './studio';
import User from './user';

export default interface searchResults {
  searchResult: Item | Studio | User;
}
