export const toggleArrayItem = (array, item) => {
  return array.indexOf(item) === -1 ? [...array, item] : array.filter((value) => value !== item);
};
