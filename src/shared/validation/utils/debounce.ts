/**
 * Debounce utility for validation
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * 
 * @param func - Function to debounce
 * @param wait - Number of milliseconds to delay
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a debounced validation function
 * 
 * @param validateFn - Validation function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced validation function
 */
export function debounceValidation<T extends (...args: any[]) => any>(
  validateFn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  return debounce(validateFn, delay);
}

