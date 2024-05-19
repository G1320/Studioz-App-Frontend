export const calculateTotalPrice = (items) => {
  return items?.reduce((acc, item) => acc + item.price, 0).toFixed(2);
};

export const getItemQuantityMap = (items) => {
  return items?.reduce((map, item) => {
    map.set(item._id, map.has(item._id) ? map.get(item._id) + 1 : 1);
    return map;
  }, new Map());
};

export const getUniqueItems = (items, itemQuantityMap) => {
  return itemQuantityMap
    ? Array.from(itemQuantityMap.keys()).map((itemId) => items.find((item) => item._id === itemId))
    : [];
};
