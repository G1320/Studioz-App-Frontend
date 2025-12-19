import { stringifyJSON, parseJSON } from './storageUtils';

/**
 * Storage key prefix for form auto-save data
 */
const FORM_AUTO_SAVE_PREFIX = 'form_autosave_';

/**
 * Generate a storage key for a form
 * @param formId - Unique identifier for the form (e.g., 'create-studio', 'edit-item-123')
 * @returns Storage key string
 */
export const getFormStorageKey = (formId: string): string => {
  return `${FORM_AUTO_SAVE_PREFIX}${formId}`;
};

/**
 * Interface for stored form data with metadata
 */
export interface StoredFormData {
  data: Record<string, any>;
  timestamp: number;
  version?: string; // Optional version for schema migrations
}

/**
 * Save form data to localStorage
 * @param formId - Unique identifier for the form
 * @param formData - Form data to save
 * @param version - Optional version string for schema migrations
 */
export const saveFormData = (formId: string, formData: Record<string, any>, version?: string): void => {
  const storageKey = getFormStorageKey(formId);
  const storedData: StoredFormData = {
    data: formData,
    timestamp: Date.now(),
    ...(version && { version })
  };

  stringifyJSON(storageKey, storedData);
};

/**
 * Load form data from localStorage
 * @param formId - Unique identifier for the form
 * @returns Form data or null if not found
 */
export const loadFormData = (formId: string): Record<string, any> | null => {
  const storageKey = getFormStorageKey(formId);
  const stored = parseJSON<StoredFormData>(storageKey, null);

  if (!stored || !stored.data) {
    return null;
  }

  return stored.data;
};

/**
 * Clear saved form data from localStorage
 * @param formId - Unique identifier for the form
 */
export const clearFormData = (formId: string): void => {
  const storageKey = getFormStorageKey(formId);
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error(`Error clearing form data for "${formId}":`, error);
  }
};

/**
 * Check if form data exists in localStorage
 * @param formId - Unique identifier for the form
 * @returns True if form data exists
 */
export const hasFormData = (formId: string): boolean => {
  const storageKey = getFormStorageKey(formId);
  try {
    return localStorage.getItem(storageKey) !== null;
  } catch {
    return false;
  }
};

/**
 * Get the timestamp of saved form data
 * @param formId - Unique identifier for the form
 * @returns Timestamp or null if not found
 */
export const getFormDataTimestamp = (formId: string): number | null => {
  const storageKey = getFormStorageKey(formId);
  const stored = parseJSON<StoredFormData>(storageKey, null);

  return stored?.timestamp ?? null;
};

/**
 * Generate a storage key for form state (controlled React state)
 * @param formId - Unique identifier for the form
 * @returns Storage key string
 */
export const getFormStateStorageKey = (formId: string): string => {
  return `${FORM_AUTO_SAVE_PREFIX}${formId}_state`;
};

/**
 * Save controlled form state to localStorage
 * @param formId - Unique identifier for the form
 * @param stateData - Controlled state data to save
 * @param version - Optional version string for schema migrations
 */
export const saveFormState = <T = Record<string, any>>(
  formId: string,
  stateData: T,
  version?: string
): void => {
  const storageKey = getFormStateStorageKey(formId);
  const storedData: StoredFormData = {
    data: stateData as Record<string, any>,
    timestamp: Date.now(),
    ...(version && { version })
  };

  stringifyJSON(storageKey, storedData);
};

/**
 * Load controlled form state from localStorage
 * @param formId - Unique identifier for the form
 * @returns State data or null if not found
 */
export const loadFormState = <T = Record<string, any>>(formId: string): T | null => {
  const storageKey = getFormStateStorageKey(formId);
  const stored = parseJSON<StoredFormData>(storageKey, null);

  if (!stored || !stored.data) {
    return null;
  }

  return stored.data as T;
};

/**
 * Clear saved controlled form state from localStorage
 * @param formId - Unique identifier for the form
 */
export const clearFormState = (formId: string): void => {
  const storageKey = getFormStateStorageKey(formId);
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error(`Error clearing form state for "${formId}":`, error);
  }
};

/**
 * Clear both form fields and controlled state for a form
 * @param formId - Unique identifier for the form
 */
export const clearAllFormData = (formId: string): void => {
  clearFormData(formId);
  clearFormState(formId);
};

/**
 * Check if form state exists in localStorage
 * @param formId - Unique identifier for the form
 * @returns True if form state exists
 */
export const hasFormState = (formId: string): boolean => {
  const storageKey = getFormStateStorageKey(formId);
  try {
    return localStorage.getItem(storageKey) !== null;
  } catch {
    return false;
  }
};

/**
 * Clean up old form auto-save data (older than specified days)
 * @param maxAgeDays - Maximum age in days (default: 7)
 */
export const cleanupOldFormData = (maxAgeDays: number = 7): void => {
  try {
    const maxAge = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(FORM_AUTO_SAVE_PREFIX)) {
        try {
          const stored = parseJSON<StoredFormData>(key, null);
          if (stored?.timestamp && stored.timestamp < maxAge) {
            localStorage.removeItem(key);
          }
        } catch {
          // If parsing fails, remove the key
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error during form data cleanup:', error);
  }
};

