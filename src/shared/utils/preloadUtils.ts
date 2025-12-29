/**
 * Preload an image and return a promise that resolves when loaded
 * @param src - The image URL to preload
 * @param timeout - Maximum time to wait before resolving anyway (default: 3000ms)
 */
export const preloadImage = (src: string, timeout = 3000): Promise<void> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    // Set a timeout to resolve even if image takes too long
    const timeoutId = setTimeout(() => {
      resolve();
    }, timeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };
    
    img.onerror = () => {
      clearTimeout(timeoutId);
      resolve(); // Resolve even on error to not block the modal
    };
    
    img.src = src;
  });
};

/**
 * Preload multiple images in parallel
 * @param urls - Array of image URLs to preload
 * @param timeout - Maximum time to wait per image (default: 3000ms)
 */
export const preloadImages = (urls: string[], timeout = 3000): Promise<void[]> => {
  return Promise.all(urls.map((url) => preloadImage(url, timeout)));
};
