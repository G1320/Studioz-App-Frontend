export const getLoopedIndex = (currentIndex, arrayLength, direction) => {
  const increment = direction === 'next' ? 1 : -1;
  return (currentIndex + increment + arrayLength) % arrayLength;
};
