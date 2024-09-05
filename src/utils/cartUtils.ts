import { Item } from '../../../shared/types';

import {Cart} from '../../../shared/types';
import { setLocalOfflineCart } from '../services/cart-service';

export const updateOfflineCart = (cart: Cart, setOfflineCartContext: (cart: Cart) => void) => {
  setLocalOfflineCart(cart);
  setOfflineCartContext(cart);
};

export const calculateTotalPrice = (items: Item[]) => {
  return items?.filter((item): item is Item & { price: number } => item.price !== undefined).reduce((acc, item) => acc + item?.price, 0).toFixed(2);
};

export const getItemQuantityMap = (items: Item[]): Map<string, number> => {
  return items?.reduce((map, item) => {
    map.set(item._id, map.has(item._id) ? map.get(item._id) + 1 : 1);
    return map;
  }, new Map());
};

export const getUniqueItems = (items: Item[], itemQuantityMap: Map<string, number>): Item[] => {
  return itemQuantityMap
    ? Array.from(itemQuantityMap.keys()).map((itemId) => items.find(item => item._id === itemId) as Item)
    : [];
};
