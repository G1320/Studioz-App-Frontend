/**
 * Utility functions for handling form data in SteppedForm
 */

/**
 * Get nested value from form data object
 */
export const getNestedValue = (data: Record<string, any>, fieldName: string): any => {
  if (fieldName.includes('.')) {
    const [parent, child] = fieldName.split('.');
    return data[parent]?.[child];
  }
  return data[fieldName];
};

/**
 * Set nested value in form data object
 */
export const setNestedValue = (data: Record<string, any>, fieldName: string, value: any): Record<string, any> => {
  if (fieldName.includes('.')) {
    const [parent, child] = fieldName.split('.');
    return {
      ...data,
      [parent]: {
        ...data[parent],
        [child]: value
      }
    };
  }
  return { ...data, [fieldName]: value };
};

/**
 * Collect form data from HTML form element
 */
export const collectFormData = (form: HTMLFormElement): Record<string, any> => {
  const formData = new FormData(form);
  const data: Record<string, any> = {};

  for (const [key, value] of formData.entries()) {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      data[parent] = data[parent] || {};
      data[parent][child] = value;
    } else {
      const element = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
      if (element?.type === 'checkbox') {
        const checkboxes = form.querySelectorAll(`[name="${key}"]:checked`) as NodeListOf<HTMLInputElement>;
        data[key] = checkboxes.length > 0 ? Array.from(checkboxes).map((cb) => cb.value) : false;
      } else {
        data[key] = value;
      }
    }
  }

  return data;
};

/**
 * Check if form data has any non-empty values
 */
export const hasAnyValue = (data: Record<string, any>): boolean => {
  return Object.values(data).some((value) => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.values(value).some((v) => v !== null && v !== undefined && v !== '');
    }
    return true;
  });
};

/**
 * Merge form data objects, handling nested structures
 */
export const mergeFormData = (
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> => {
  const merged = { ...target };
  
  Object.entries(source).forEach(([key, value]) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      merged[parent] = { ...merged[parent] || {}, [child]: value };
    } else {
      merged[key] = value;
    }
  });
  
  return merged;
};

