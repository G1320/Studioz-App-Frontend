import { useEffect, useRef } from 'react';
import { loadFormData, saveFormData } from '@shared/utils/formAutoSaveUtils';
import { collectFormData, mergeFormData } from '../utils/formDataUtils';

interface UseLanguageToggleOptions {
  selectedLanguage: 'en' | 'he';
  currentStepIndex: number;
  formId: string;
  steps: Array<{ languageToggle?: boolean; fieldNames: string[] }>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  formData: Record<string, any>;
}

/**
 * Hook to handle language toggle and preserve form data
 *
 * IMPORTANT: This hook ensures both languages' data are preserved when toggling.
 * It collects visible fields from DOM and merges with existing formData state.
 */
export const useLanguageToggle = ({
  selectedLanguage,
  currentStepIndex,
  formId,
  steps,
  setFormData,
  formData
}: UseLanguageToggleOptions) => {
  const previousLanguageRef = useRef(selectedLanguage);

  // Collect form data when language changes to preserve values
  useEffect(() => {
    const step = steps[currentStepIndex];
    // Only collect if language actually changed and language toggle is enabled
    if (step?.languageToggle && previousLanguageRef.current !== selectedLanguage) {
      const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;

      // Collect visible fields from DOM (current language before toggle)
      // This captures the latest typed text even if debounced save hasn't completed
      const visibleData = form ? collectFormData(form) : {};

      // Immediately save current formData + visibleData to ensure latest changes are persisted
      // This prevents data loss when toggling quickly
      const currentData = { ...formData };
      const dataToSave = mergeFormData(currentData, visibleData);
      if (Object.keys(dataToSave).length > 0) {
        saveFormData(formId, dataToSave);
      }

      // Load saved data from localStorage (has both languages from previous saves)
      const savedData = loadFormData(formId) || {};

      // Merge strategy: visible DOM data (latest) -> current formData state -> saved data
      // Prioritize visible DOM data as it has the most recent user input
      setFormData((prev) => {
        // Start with visible DOM data (most recent)
        const merged = { ...visibleData };

        // Merge with current formData state (has both languages from handleFieldChange)
        Object.entries(prev).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Merge nested objects (like { name: { en: "...", he: "..." } })
            merged[key] = { ...(merged[key] || {}), ...value };
          } else if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
            merged[key] = value;
          }
        });

        // Finally merge with saved data (fallback for any missing data)
        Object.entries(savedData).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            merged[key] = { ...(merged[key] || {}), ...value };
          } else if ((merged[key] === undefined || merged[key] === null || merged[key] === '') && value) {
            merged[key] = value;
          }
        });

        return merged;
      });

      previousLanguageRef.current = selectedLanguage;
    }
  }, [selectedLanguage, steps, currentStepIndex, formId, setFormData, formData]);
};
