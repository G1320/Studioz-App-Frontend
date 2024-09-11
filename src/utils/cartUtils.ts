import { Item, Cart } from '../types/index';
import { setLocalOfflineCart } from '../services/cart-service';

// Function to count occurrences of each ID in offlineCartItemsIds
export const getOfflineCartIdCountMap = (cart: Cart): { [key: string]: number } => {
  return cart?.items.reduce<{ [key: string]: number }>((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
};

// Filter items array based on offlineCartItemsIds
export const filterOfflineCartItems = (items: Item[], offlineCartIdCountMap: { [key: string]: number }) => {
  return items
    ? items.flatMap((item) => Array.from({ length: offlineCartIdCountMap[item._id] || 0 }, () => item))
    : [];
};

// Function to update the offline cart
export const updateOfflineCart = (cart: Cart, setOfflineCartContext: (cart: Cart) => void) => {
  setLocalOfflineCart(cart);
  setOfflineCartContext(cart);
};

// Function to calculate the total price of items
export const calculateTotalPrice = (items: Item[]) => {
  return items
    ?.filter((item): item is Item & { price: number } => item.price !== undefined)
    .reduce((acc, item) => acc + item.price, 0)
    .toFixed(2);
};

// Function to get the item quantity map
export const getItemQuantityMap = (items: Item[]): Map<string, number> => {
  return items?.reduce((map, item) => {
    map.set(item._id, map.has(item._id) ? (map.get(item._id) || 0) + 1 : 1);
    return map;
  }, new Map());
};

// Function to get unique items
export const getUniqueItems = (items: Item[], itemQuantityMap: Map<string, number>): Item[] => {
  return itemQuantityMap
    ? Array.from(itemQuantityMap.keys()).map((itemId) => items.find(item => item._id === itemId) as Item)
    : [];
};
