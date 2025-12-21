import { getNestedValue } from './formDataUtils';

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
  fields: Array<{ name: string; value?: any; onChange?: (value: any) => void; [key: string]: any }>,
  formData: Record<string, any>,
  onFieldChange: (fieldName: string, value: any) => void
) => {
  return fields.map((field) => {
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

