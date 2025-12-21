import { useEffect, useRef, useCallback } from 'react';
import { loadFormData } from '@shared/utils/formAutoSaveUtils';
import { collectFormData, mergeFormData } from '../utils/formDataUtils';

interface UseLanguageToggleOptions {
  selectedLanguage: 'en' | 'he';
  currentStepIndex: number;
  formId: string;
  steps: Array<{ languageToggle?: boolean; fieldNames: string[] }>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

/**
 * Hook to handle language toggle and preserve form data
 */
export const useLanguageToggle = ({
  selectedLanguage,
  currentStepIndex,
  formId,
  steps,
  setFormData
}: UseLanguageToggleOptions) => {
  const previousLanguageRef = useRef(selectedLanguage);

  // Collect form data when language changes to preserve values
  useEffect(() => {
    const step = steps[currentStepIndex];
    // Only collect if language actually changed and language toggle is enabled
    if (step?.languageToggle && previousLanguageRef.current !== selectedLanguage) {
      const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
      
      if (form) {
        // Collect current form data from DOM
        const currentData = collectFormData(form);
        
        // Load saved data from localStorage to ensure we have all language data
        const savedData = loadFormData(formId) || {};
        
        // Merge: saved data (most complete) -> current formData -> freshly collected data
        setFormData((prev) => {
          // Start with saved data (has both languages)
          const merged = { ...savedData };
          
          // Merge with current formData state
          Object.entries(prev).forEach(([key, value]) => {
            if (key.includes('.')) {
              const [parent, child] = key.split('.');
              merged[parent] = { ...merged[parent] || {}, [child]: value };
            } else {
              merged[key] = value;
            }
          });
          
          // Finally, merge with freshly collected data from DOM
          return mergeFormData(merged, currentData);
        });
      } else {
        // If form doesn't exist yet, just load from localStorage
        const savedData = loadFormData(formId);
        if (savedData && Object.keys(savedData).length > 0) {
          setFormData((prev) => mergeFormData(prev, savedData));
        }
      }
      
      previousLanguageRef.current = selectedLanguage;
    }
  }, [selectedLanguage, steps, currentStepIndex, formId, setFormData]);
};

