import { useEffect, useRef } from 'react';
import { loadFormData } from '@shared/utils/formAutoSaveUtils';
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
      const visibleData = form ? collectFormData(form) : {};

      // Load saved data from localStorage (has both languages from previous saves)
      const savedData = loadFormData(formId) || {};

      // Merge strategy: current formData state -> saved data -> visible DOM data
      // The formData state already has both languages because handleFieldChange updates it
      setFormData((prev) => {
        // Start with current formData state (has both languages from handleFieldChange)
        const merged = { ...prev };

        // Merge with saved data from localStorage (ensures we have persisted data)
        // This is important in case formData state was lost or reset
        Object.entries(savedData).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Merge nested objects (like { name: { en: "...", he: "..." } })
            // This preserves both languages
            merged[key] = { ...(merged[key] || {}), ...value };
          } else {
            // Only overwrite if current value is empty and saved value exists
            if ((merged[key] === undefined || merged[key] === null || merged[key] === '') && value) {
              merged[key] = value;
            }
          }
        });

        // Finally, merge with visible DOM data (captures any last-minute changes)
        // mergeFormData will preserve both languages in nested objects
        return mergeFormData(merged, visibleData);
      });

      previousLanguageRef.current = selectedLanguage;
    }
  }, [selectedLanguage, steps, currentStepIndex, formId, setFormData, formData]);
};
