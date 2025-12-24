import { getNestedValue } from './formDataUtils';

/**
 * Check if there are validation errors in the other language
 * @param validationErrors - Record of field paths to error messages
 * @param selectedLanguage - Currently selected language ('en' or 'he')
 * @param stepFieldNames - Field names for the current step
 * @returns true if there are errors in the other language
 */
export const hasErrorsInOtherLanguage = (
  validationErrors: Record<string, string>,
  selectedLanguage: 'en' | 'he',
  stepFieldNames: string[]
): boolean => {
  const otherLanguage = selectedLanguage === 'en' ? 'he' : 'en';
  
  // Check if any validation errors are for fields in the other language
  return Object.keys(validationErrors).some((errorPath) => {
    // Check if error is for a field in the other language
    if (errorPath.endsWith(`.${otherLanguage}`)) {
      // Extract the base field name (e.g., 'name' from 'name.he')
      const baseFieldName = errorPath.replace(`.${otherLanguage}`, '');
      // Check if this base field is in the current step
      return stepFieldNames.some((stepFieldName) => {
        // Match exact field name or parent field (e.g., 'name' matches 'name.en' or 'name.he')
        return stepFieldName === baseFieldName || stepFieldName === errorPath;
      });
    }
    return false;
  });
};

/**
 * Filter fields for the current step based on field names and language
 */
export const filterStepFields = (
  allFields: Array<{ name: string; [key: string]: any }>,
  stepFieldNames: string[],
  languageToggle?: boolean,
  selectedLanguage?: 'en' | 'he'
): Array<{ name: string; [key: string]: any }> => {
  let filtered = allFields.filter((field) => stepFieldNames.includes(field.name));

  if (!languageToggle) {
    return filtered;
  }

  return filtered.filter((field) => {
    // Keep fields matching selected language
    if (field.name.endsWith(`.${selectedLanguage}`)) {
      return true;
    }
    // Keep non-language fields
    return !field.name.includes('.en') && !field.name.includes('.he');
  });
};

/**
 * Prepare fields with values from formData
 */
export const prepareFieldsWithValues = (
  fields: Array<{ name: string; value?: any; onChange?: (value: any) => void; type?: string; [key: string]: any }>,
  formData: Record<string, any>,
  onFieldChange: (fieldName: string, value: any) => void
) => {
  return fields.map((field) => {
    // For languageToggle fields, always use the field's value prop (current selectedLanguage state)
    // This ensures the toggle UI stays in sync with the actual language selection
    if (field.type === 'languageToggle') {
      return {
        ...field,
        value: field.value, // Always use the prop value for languageToggle
        onChange: (value: any) => {
          onFieldChange(field.name, value);
          field.onChange?.(value);
        }
      };
    }

    const savedValue = getNestedValue(formData, field.name);
    const fieldValue = savedValue !== undefined ? savedValue : field.value;

    return {
      ...field,
      value: fieldValue,
      onChange: (value: any) => {
        onFieldChange(field.name, value);
        field.onChange?.(value);
      }
    };
  });
};

