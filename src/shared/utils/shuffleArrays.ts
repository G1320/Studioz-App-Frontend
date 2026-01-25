export function shuffleArray<T>(array: T[] | undefined | null): T[] {
  // Defensive check - return empty array if input is not a valid array
  if (!array || !Array.isArray(array)) {
    return [];
  }
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
