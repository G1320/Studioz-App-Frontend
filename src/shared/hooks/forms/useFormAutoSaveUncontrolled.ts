import { useEffect, useRef, useCallback } from 'react';
import { saveFormData, loadFormData, clearFormData } from '@shared/utils/formAutoSaveUtils';

export interface UseFormAutoSaveUncontrolledOptions {
  /**
   * Unique identifier for the form (e.g., 'create-studio', 'edit-item-123')
   * Used as the key for localStorage
   */
  formId: string;

  /**
   * Form element reference or form ID selector
   */
  formRef?: React.RefObject<HTMLFormElement> | string;

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
 * Hook for auto-saving uncontrolled form data to localStorage
 * Works with uncontrolled forms (GenericForm, native HTML forms, etc.)
 *
 * @example
 * ```tsx
 * const formRef = useRef<HTMLFormElement>(null);
 *
 * useFormAutoSaveUncontrolled({
 *   formId: 'create-studio',
 *   formRef,
 *   onSave: () => console.log('Form saved!')
 * });
 *
 * return <form ref={formRef}>...</form>;
 * ```
 *
 * @example With form ID
 * ```tsx
 * useFormAutoSaveUncontrolled({
 *   formId: 'create-studio',
 *   formRef: 'my-form-id'
 * });
 *
 * return <form id="my-form-id">...</form>;
 * ```
 */
export const useFormAutoSaveUncontrolled = ({
  formId,
  formRef,
  debounceMs = 1000,
  enabled = true,
  restoreOnMount = true,
  version,
  onSave,
  onRestoreComplete
}: UseFormAutoSaveUncontrolledOptions): {
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
  const formElementRef = useRef<HTMLFormElement | null>(null);

  // Get form element
  useEffect(() => {
    if (typeof formRef === 'string') {
      formElementRef.current = document.getElementById(formRef) as HTMLFormElement;
    } else if (formRef && 'current' in formRef) {
      formElementRef.current = formRef.current;
    }
  }, [formRef]);

  // Extract form data from form element
  const getFormData = useCallback((): Record<string, any> => {
    const form = formElementRef.current;
    if (!form) return {};

    const formData = new FormData(form);
    const data: Record<string, any> = {};

    // Process all form fields
    for (const [key, value] of formData.entries()) {
      // Handle nested fields (e.g., "name.en" -> { name: { en: value } })
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        data[parent] = data[parent] || {};
        data[parent][child] = value;
      } else {
        // Handle checkboxes and radio buttons
        const element = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
        if (element?.type === 'checkbox') {
          const checkboxes = form.querySelectorAll(`[name="${key}"]:checked`) as NodeListOf<HTMLInputElement>;
          data[key] = checkboxes.length > 0 ? Array.from(checkboxes).map((cb) => cb.value) : false;
        } else if (element?.type === 'radio') {
          const radio = form.querySelector(`[name="${key}"]:checked`) as HTMLInputElement;
          data[key] = radio ? radio.value : '';
        } else {
          data[key] = value;
        }
      }
    }

    return data;
  }, []);

  // Restore form data on mount
  useEffect(() => {
    if (!restoreOnMount || !enabled || hasRestored.current || !formElementRef.current) {
      return;
    }

    const restoredData = loadFormData(formId);
    if (restoredData && Object.keys(restoredData).length > 0) {
      const form = formElementRef.current;

      // Restore form fields
      Object.entries(restoredData).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Handle nested fields
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            const field = form.querySelector(`[name="${key}.${nestedKey}"]`) as HTMLInputElement | HTMLTextAreaElement;
            if (field) {
              field.value = String(nestedValue);
              // Trigger input event to notify any listeners
              field.dispatchEvent(new Event('input', { bubbles: true }));
            }
          });
        } else if (Array.isArray(value)) {
          // Handle checkboxes/selects with multiple values
          const checkboxes = form.querySelectorAll(`[name="${key}"]`) as NodeListOf<HTMLInputElement>;
          checkboxes.forEach((checkbox) => {
            checkbox.checked = value.includes(checkbox.value);
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          });
        } else {
          const field = form.querySelector(`[name="${key}"]`) as
            | HTMLInputElement
            | HTMLTextAreaElement
            | HTMLSelectElement;
          if (field) {
            if (field.type === 'checkbox') {
              (field as HTMLInputElement).checked = Boolean(value);
            } else {
              field.value = String(value);
            }
            // Trigger input/change event to notify any listeners
            field.dispatchEvent(new Event(field.type === 'checkbox' ? 'change' : 'input', { bubbles: true }));
          }
        }
      });

      onRestoreComplete?.(restoredData);
      hasRestored.current = true;
    } else {
      onRestoreComplete?.(null);
      hasRestored.current = true;
    }
  }, [formId, restoreOnMount, enabled, onRestoreComplete]);

  // Auto-save form data when it changes (debounced)
  useEffect(() => {
    if (!enabled || !formElementRef.current) {
      return;
    }

    const form = formElementRef.current;

    // Debounce function
    let timeoutId: NodeJS.Timeout;

    const handleFormChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isInitialMount.current) {
          isInitialMount.current = false;
          return;
        }

        const formData = getFormData();

        // Don't save empty forms
        if (!formData || Object.keys(formData).length === 0) {
          return;
        }

        // Don't save if all values are empty strings, null, or undefined
        const hasAnyValue = Object.values(formData).some((value) => {
          if (Array.isArray(value)) {
            return value.length > 0;
          }
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some((v) => v !== '' && v !== null && v !== undefined);
          }
          return value !== '' && value !== null && value !== undefined;
        });

        if (!hasAnyValue) {
          return;
        }

        saveFormData(formId, formData, version);
        onSave?.(formData);
      }, debounceMs);
    };

    // Listen to form changes
    form.addEventListener('input', handleFormChange);
    form.addEventListener('change', handleFormChange);

    return () => {
      clearTimeout(timeoutId);
      form.removeEventListener('input', handleFormChange);
      form.removeEventListener('change', handleFormChange);
    };
  }, [formId, enabled, debounceMs, version, onSave, getFormData]);

  const clearSavedData = useCallback(() => {
    clearFormData(formId);
  }, [formId]);

  const saveNow = useCallback(() => {
    if (!enabled || !formElementRef.current) return;

    const formData = getFormData();
    if (!formData || Object.keys(formData).length === 0) return;

    const hasAnyValue = Object.values(formData).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some((v) => v !== '' && v !== null && v !== undefined);
      }
      return value !== '' && value !== null && value !== undefined;
    });

    if (!hasAnyValue) return;

    saveFormData(formId, formData, version);
    onSave?.(formData);
  }, [formId, enabled, version, onSave, getFormData]);

  const hasSavedData = loadFormData(formId) !== null;

  return {
    clearSavedData,
    saveNow,
    hasSavedData
  };
};
