import { arraysEqual } from './compareArrays';
export const areObjectsEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  // console.log('obj1: ', obj1);

  const keys2 = Object.keys(obj2);
  // console.log('obj2: ', obj2);

  // if (keys1.length !== keys2.length) {
  //   console.log('false 1: ', false);
  //   return false;
  // }

  for (const key of keys1) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (!arraysEqual(value1, value2)) {
        console.log('false 2: ', false);
        return false;
      }
    } else if (value1 !== value2) {
      console.log('false 3: ', false);
      return false;
    }
  }
  return true;
};
