export const getLoopedIndex = (currentIndex: number, arrayLength: number, direction: string) => {
  const increment = direction === 'next' ? 1 : -1;
  return (currentIndex + increment + arrayLength) % arrayLength;
};
