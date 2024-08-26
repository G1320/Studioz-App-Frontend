
export const toggleArrayItem = <T>(array: T[], item: T): T[] => {
  return array.indexOf(item) === -1 ? [...array, item] : array.filter((value) => value !== item);
};