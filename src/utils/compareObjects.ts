import { arraysEqual } from './compareArrays';

// Define a generic function that can accept any object type
export const areObjectsEqual = <T extends Record<string, any>>(obj1: T, obj2: T): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the objects have the same number of keys
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (Array.isArray(value1) && Array.isArray(value2)) {
      // Compare arrays
      if (!arraysEqual(value1, value2)) {
        return false;
      }
    } else if (value1 !== value2) {
      // Compare primitive values or non-array objects
      return false;
    }
  }

  return true;
};
