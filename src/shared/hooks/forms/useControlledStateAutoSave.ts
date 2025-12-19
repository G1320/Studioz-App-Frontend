import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '../debauncing';
import { saveFormState, loadFormState, clearFormState } from '@shared/utils/formAutoSaveUtils';

export interface UseControlledStateAutoSaveOptions<T> {
  /**
   * Unique identifier for the form (e.g., 'create-studio', 'edit-studio-123')
   * Used as the key for localStorage
   */
  formId: string;

  /**
   * Current controlled state to auto-save
   */
  state: T;

  /**
   * Callback to restore state when component mounts
   * Called with the restored state if found in localStorage
   */
  onRestore?: (restoredState: T) => void;

  /**
   * Debounce delay in milliseconds for auto-save (default: 1000ms)
   */
  debounceMs?: number;

  /**
   * Whether to enable auto-save (default: true)
   */
  enabled?: boolean;

  /**
   * Whether to restore state on mount (default: true)
   */
  restoreOnMount?: boolean;

  /**
   * Optional version string for schema migrations
   */
  version?: string;

  /**
   * Callback fired when state is saved
   */
  onSave?: (state: T) => void;

  /**
   * Callback fired when restore completes (with or without data)
   */
  onRestoreComplete?: (restoredState: T | null) => void;

  /**
   * Function to check if state should be saved
   * Return false to skip saving (e.g., if state is empty or invalid)
   */
  shouldSave?: (state: T) => boolean;
}

/**
 * Hook for auto-saving controlled React state to localStorage with debouncing
 * Works with any controlled state (useState, useReducer, etc.)
 *
 * @example
 * ```tsx
 * const [categories, setCategories] = useState([]);
 * const [genres, setGenres] = useState([]);
 *
 * useControlledStateAutoSave({
 *   formId: 'create-studio',
 *   state: { categories, genres },
 *   onRestore: (restored) => {
 *     setCategories(restored.categories);
 *     setGenres(restored.genres);
 *   }
 * });
 * ```
 */
export const useControlledStateAutoSave = <T extends Record<string, any>>({
  formId,
  state,
  onRestore,
  debounceMs = 1000,
  enabled = true,
  restoreOnMount = true,
  version,
  onSave,
  onRestoreComplete,
  shouldSave
}: UseControlledStateAutoSaveOptions<T>): {
  /**
   * Manually clear saved state
   */
  clearSavedState: () => void;

  /**
   * Manually save state (bypasses debounce)
   */
  saveNow: () => void;

  /**
   * Check if there's saved state available
   */
  hasSavedState: boolean;
} => {
  const isInitialMount = useRef(true);
  const hasRestored = useRef(false);
  const debouncedState = useDebounce(state, debounceMs);

  // Restore state on mount
  useEffect(() => {
    if (!restoreOnMount || !enabled || hasRestored.current) {
      return;
    }

    const restoredState = loadFormState<T>(formId);
    if (restoredState && Object.keys(restoredState).length > 0) {
      onRestore?.(restoredState);
      onRestoreComplete?.(restoredState);
      hasRestored.current = true;
    } else {
      onRestoreComplete?.(null);
      hasRestored.current = true;
    }
  }, [formId, restoreOnMount, enabled, onRestore, onRestoreComplete]);

  // Auto-save state when it changes (debounced)
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Skip save on initial mount (after restore)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Check if state should be saved
    if (shouldSave && !shouldSave(debouncedState)) {
      return;
    }

    // Don't save empty state objects
    if (!debouncedState || Object.keys(debouncedState).length === 0) {
      return;
    }

    // Don't save if all values are empty/undefined (unless shouldSave is provided)
    if (!shouldSave) {
      const hasAnyValue = Object.values(debouncedState).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        if (typeof value === 'object' && value !== null) {
          return Object.keys(value).length > 0;
        }
        return value !== '' && value !== null && value !== undefined;
      });

      if (!hasAnyValue) {
        return;
      }
    }

    saveFormState(formId, debouncedState, version);
    onSave?.(debouncedState);
  }, [debouncedState, formId, enabled, version, onSave, shouldSave]);

  const clearSavedState = useCallback(() => {
    clearFormState(formId);
  }, [formId]);

  const saveNow = useCallback(() => {
    if (!enabled) return;
    if (!state || Object.keys(state).length === 0) return;

    if (shouldSave && !shouldSave(state)) {
      return;
    }

    if (!shouldSave) {
      const hasAnyValue = Object.values(state).some((value) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        if (typeof value === 'object' && value !== null) {
          return Object.keys(value).length > 0;
        }
        return value !== '' && value !== null && value !== undefined;
      });

      if (!hasAnyValue) return;
    }

    saveFormState(formId, state, version);
    onSave?.(state);
  }, [formId, state, enabled, version, onSave, shouldSave]);

  const hasSavedState = loadFormState<T>(formId) !== null;

  return {
    clearSavedState,
    saveNow,
    hasSavedState
  };
};

