import { useEffect, useRef, useCallback } from 'react';
import { useDebounce } from '../debauncing';
import { saveFormData, loadFormData, clearFormData } from '@shared/utils/formAutoSaveUtils';

export interface UseFormAutoSaveOptions {
  /**
   * Unique identifier for the form (e.g., 'create-studio', 'edit-item-123')
   * Used as the key for localStorage
   */
  formId: string;

  /**
   * Current form data to auto-save
   */
  formData: Record<string, any>;

  /**
   * Callback to restore form data when component mounts
   * Called with the restored data if found in localStorage
   */
  onRestore?: (restoredData: Record<string, any>) => void;

  /**
   * Debounce delay in milliseconds for auto-save (default: 1000ms)
   */
  debounceMs?: number;

  /**
   * Whether to enable auto-save (default: true)
   */
  enabled?: boolean;

  /**
   * Whether to restore form data on mount (default: true)
   */
  restoreOnMount?: boolean;

  /**
   * Optional version string for schema migrations
   */
  version?: string;

  /**
   * Callback fired when data is saved
   */
  onSave?: (data: Record<string, any>) => void;

  /**
   * Callback fired when data is restored
   */
  onRestoreComplete?: (data: Record<string, any> | null) => void;
}

/**
 * Hook for auto-saving form data to localStorage with debouncing
 * Works with controlled forms (React Hook Form, controlled inputs, etc.)
 *
 * @example
 * ```tsx
 * const { formData, setFormData } = useState({ name: '', email: '' });
 *
 * useFormAutoSave({
 *   formId: 'create-user',
 *   formData,
 *   onRestore: (data) => setFormData(data),
 *   onSave: () => console.log('Form saved!')
 * });
 * ```
 */
export const useFormAutoSave = ({
  formId,
  formData,
  onRestore,
  debounceMs = 1000,
  enabled = true,
  restoreOnMount = true,
  version,
  onSave,
  onRestoreComplete
}: UseFormAutoSaveOptions): {
  /**
   * Manually clear saved form data
   */
  clearSavedData: () => void;

  /**
   * Manually save form data (bypasses debounce)
   */
  saveNow: () => void;

  /**
   * Check if there's saved data available
   */
  hasSavedData: boolean;
} => {
  const isInitialMount = useRef(true);
  const hasRestored = useRef(false);
  const debouncedFormData = useDebounce(formData, debounceMs);

  // Restore form data on mount
  useEffect(() => {
    if (!restoreOnMount || !enabled || hasRestored.current) {
      return;
    }

    const restoredData = loadFormData(formId);
    if (restoredData && Object.keys(restoredData).length > 0) {
      onRestore?.(restoredData);
      onRestoreComplete?.(restoredData);
      hasRestored.current = true;
    } else {
      onRestoreComplete?.(null);
      hasRestored.current = true;
    }
  }, [formId, restoreOnMount, enabled, onRestore, onRestoreComplete]);

  // Auto-save form data when it changes (debounced)
  useEffect(() => {
    if (!enabled || isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Don't save empty forms
    if (!formData || Object.keys(formData).length === 0) {
      return;
    }

    // Don't save if all values are empty strings, null, or undefined
    const hasAnyValue = Object.values(formData).some((value) => value !== '' && value !== null && value !== undefined);

    if (!hasAnyValue) {
      return;
    }

    saveFormData(formId, debouncedFormData, version);
    onSave?.(debouncedFormData);
  }, [debouncedFormData, formId, enabled, version, onSave]);

  const clearSavedData = useCallback(() => {
    clearFormData(formId);
  }, [formId]);

  const saveNow = useCallback(() => {
    if (!enabled) return;
    if (!formData || Object.keys(formData).length === 0) return;

    const hasAnyValue = Object.values(formData).some((value) => value !== '' && value !== null && value !== undefined);

    if (!hasAnyValue) return;

    saveFormData(formId, formData, version);
    onSave?.(formData);
  }, [formId, formData, enabled, version, onSave]);

  const hasSavedData = loadFormData(formId) !== null;

  return {
    clearSavedData,
    saveNow,
    hasSavedData
  };
};
