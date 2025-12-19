import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { GenericForm, FieldType } from './GenericHeadlessForm';
import { loadFormData, saveFormData } from '@shared/utils/formAutoSaveUtils';
import { useDebounce } from '@shared/hooks/debauncing';
import './styles/_steppedForm.scss';

/**
 * SteppedForm - A reusable multi-step form component with progress indicators
 * 
 * @example
 * ```tsx
 * const steps = [
 *   {
 *     id: 'basic-info',
 *     title: 'Basic Information',
 *     description: 'Enter your basic details',
 *     fieldNames: ['name.en', 'name.he', 'description.en']
 *   },
 *   {
 *     id: 'categories',
 *     title: 'Categories',
 *     fieldNames: ['categories', 'subCategories', 'genres']
 *   },
 *   {
 *     id: 'details',
 *     title: 'Details',
 *     fieldNames: ['address', 'phone', 'maxOccupancy']
 *   }
 * ];
 * 
 * const fields = [
 *   { name: 'name.en', label: 'Name (EN)', type: 'text' },
 *   { name: 'name.he', label: 'Name (HE)', type: 'text' },
 *   // ... all other fields
 * ];
 * 
 * <SteppedForm
 *   steps={steps}
 *   fields={fields}
 *   onSubmit={(data) => console.log(data)}
 *   formId="my-stepped-form"
 * />
 * ```
 */
export interface FormStep {
  /** Unique identifier for the step */
  id: string;
  /** Title displayed in the step indicator */
  title: string;
  /** Optional description for the step */
  description?: string;
  /** Array of field names that belong to this step */
  fieldNames: string[];
  /** Optional validation function for this step */
  validate?: (formData: Record<string, any>) => boolean | string;
}

// Extended field type that includes multiSelect (used in GenericForm but not in FieldType)
type ExtendedFieldType = FieldType | 'multiSelect';

export interface SteppedFormProps {
  /** Array of steps defining the form structure */
  steps: FormStep[];
  /** All form fields (same structure as GenericForm fields) */
  fields: Array<{
    name: string;
    label: string;
    type: ExtendedFieldType;
    [key: string]: any;
  }>;
  /** Form submission handler */
  onSubmit: (formData: Record<string, any>, event?: React.FormEvent<HTMLFormElement>) => void;
  /** Optional form ID */
  formId?: string;
  /** Optional className */
  className?: string;
  /** Optional submit button text (shown on final step) */
  submitButtonText?: string;
  /** Optional next button text */
  nextButtonText?: string;
  /** Optional previous button text */
  previousButtonText?: string;
  /** Optional callback when step changes */
  onStepChange?: (currentStep: number, previousStep: number) => void;
  /** Optional callback for category changes (passed to GenericForm) */
  onCategoryChange?: (values: string[]) => void;
  /** Optional children to render */
  children?: ReactNode;
  /** Whether to show step numbers in indicators */
  showStepNumbers?: boolean;
  /** Whether to allow going back to previous steps */
  allowBackNavigation?: boolean;
}

export const SteppedForm = ({
  steps,
  fields,
  onSubmit,
  formId = 'stepped-form',
  className = '',
  submitButtonText = 'Submit',
  nextButtonText = 'Next',
  previousButtonText = 'Previous',
  onStepChange,
  onCategoryChange,
  children,
  showStepNumbers = true,
  allowBackNavigation = true
}: SteppedFormProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    // Load saved form data on mount
    const savedData = loadFormData(formId);
    // loadFormData returns the data object directly (not wrapped)
    return savedData || {};
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const isInitialMount = useRef(true);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Filter fields for current step
  const currentStepFields = useMemo(() => {
    return fields.filter((field) => currentStep.fieldNames.includes(field.name));
  }, [fields, currentStep.fieldNames]);

  // Restore form data to form fields and set up input listeners when step changes
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    // Small delay to ensure form is rendered
    const timeoutId = setTimeout(() => {
      const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
      if (!form) return;

      // Restore values for each field in current step
      currentStepFields.forEach((field) => {
        // Skip fields with onChange handlers (they're controlled)
        if (field.onChange) return;

        // Handle nested fields like 'name.en'
        if (field.name.includes('.')) {
          const [parent, child] = field.name.split('.');
          const parentValue = formData[parent];
          if (parentValue && typeof parentValue === 'object' && parentValue[child]) {
            const input = form.querySelector(`[name="${field.name}"]`) as HTMLInputElement | HTMLTextAreaElement;
            if (input && !input.value) {
              input.value = String(parentValue[child]);
            }
          }
        } else {
          const fieldValue = formData[field.name];
          if (fieldValue === undefined || fieldValue === null) return;

          const input = form.querySelector(`[name="${field.name}"]`) as HTMLInputElement | HTMLTextAreaElement;
          if (input) {
            if (input.type === 'checkbox') {
              (input as HTMLInputElement).checked = Boolean(fieldValue);
            } else if (input.type === 'radio') {
              const radio = form.querySelector(`[name="${field.name}"][value="${fieldValue}"]`) as HTMLInputElement;
              if (radio) radio.checked = true;
            } else {
              if (!input.value) {
                input.value = String(fieldValue);
              }
            }
          }
        }
      });

      // Add input listeners to capture changes for uncontrolled fields
      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (!target.name) return;

        const fieldName = target.name;
        let value: any;

        if (target.type === 'checkbox') {
          const checkboxes = form.querySelectorAll(`[name="${fieldName}"]:checked`) as NodeListOf<HTMLInputElement>;
          value = checkboxes.length > 0 ? Array.from(checkboxes).map((cb) => cb.value) : false;
        } else if (target.type === 'radio') {
          const radio = form.querySelector(`[name="${fieldName}"]:checked`) as HTMLInputElement;
          value = radio ? radio.value : '';
        } else {
          value = target.value;
        }

        // Update formData
        if (fieldName.includes('.')) {
          const [parent, child] = fieldName.split('.');
          setFormData((prev) => ({
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: value
            }
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [fieldName]: value
          }));
        }
      };

      // Add listeners to all inputs in the form
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach((input) => {
        input.addEventListener('input', handleInput);
        input.addEventListener('change', handleInput);
      });

      cleanup = () => {
        inputs.forEach((input) => {
          input.removeEventListener('input', handleInput);
          input.removeEventListener('change', handleInput);
        });
      };
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      cleanup?.();
    };
  }, [currentStepIndex, formId, currentStepFields, formData]);

  // Auto-save form data when it changes (debounced)
  const debouncedFormData = useDebounce(formData, 1000);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Don't save empty forms
    if (!debouncedFormData || Object.keys(debouncedFormData).length === 0) {
      return;
    }

    // Don't save if all values are empty
    const hasAnyValue = Object.values(debouncedFormData).some((value) => {
      if (value === null || value === undefined || value === '') return false;
      if (typeof value === 'object' && !Array.isArray(value)) {
        return Object.values(value).some((v) => v !== null && v !== undefined && v !== '');
      }
      return true;
    });

    if (hasAnyValue) {
      saveFormData(formId, debouncedFormData);
    }
  }, [debouncedFormData, formId]);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    // Check if step has custom validation
    if (currentStep.validate) {
      const validationResult = currentStep.validate(formData);
      if (validationResult !== true) {
        errors[currentStep.id] = typeof validationResult === 'string' ? validationResult : 'Please complete all required fields';
        setValidationErrors(errors);
        return false;
      }
    }

    // Basic validation: check if required fields in current step have values
    currentStepFields.forEach((field) => {
      const fieldValue = formData[field.name];
      
      // Skip validation for fields that might be handled by GenericForm (like checkboxes, selects with onChange)
      if (field.onChange) {
        return;
      }

      // Check required fields
      if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
        // For nested fields like 'name.en', check the nested structure
        if (field.name.includes('.')) {
          const [parent, child] = field.name.split('.');
          const parentValue = formData[parent];
          if (!parentValue || !parentValue[child]) {
            errors[field.name] = `${field.label} is required`;
          }
        } else {
          errors[field.name] = `${field.label} is required`;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  }, [currentStep, currentStepFields, formData]);

  // Collect form data from current form element
  const collectCurrentStepData = useCallback(() => {
    const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
    if (!form) return {};

    const formDataObj = new FormData(form);
    const data: Record<string, any> = {};

    for (const [key, value] of formDataObj.entries()) {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        data[parent] = data[parent] || {};
        data[parent][child] = value;
      } else {
        // Handle checkboxes
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
  }, [formId, currentStepIndex]);

  // Handle next step
  const handleNext = useCallback(() => {
    // Collect data from current step before moving
    const currentData = collectCurrentStepData();
    setFormData((prev) => ({ ...prev, ...currentData }));

    if (validateCurrentStep()) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        const previousIndex = currentStepIndex;
        setCurrentStepIndex(nextIndex);
        onStepChange?.(nextIndex, previousIndex);
      }
    }
  }, [currentStepIndex, steps.length, validateCurrentStep, onStepChange, collectCurrentStepData]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    // Collect data from current step before moving back
    const currentData = collectCurrentStepData();
    setFormData((prev) => ({ ...prev, ...currentData }));

    if (currentStepIndex > 0 && allowBackNavigation) {
      const previousIndex = currentStepIndex;
      const nextIndex = currentStepIndex - 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex, previousIndex);
    }
  }, [currentStepIndex, allowBackNavigation, onStepChange, collectCurrentStepData]);

  // Handle form submission
  const handleSubmit = useCallback(
    (data: Record<string, any>, event?: React.FormEvent<HTMLFormElement>) => {
      // Collect current step data
      const currentData = collectCurrentStepData();
      
      // Merge all form data
      const mergedData = { ...formData, ...currentData, ...data };
      setFormData(mergedData);

      // Validate final step before submitting
      if (validateCurrentStep()) {
        onSubmit(mergedData, event);
      }
    },
    [formData, validateCurrentStep, onSubmit, collectCurrentStepData]
  );

  // Update form data when fields change (for controlled components)
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => {
      // Handle nested fields like 'name.en'
      if (fieldName.includes('.')) {
        const [parent, child] = fieldName.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [fieldName]: value
      };
    });
  }, []);

  // Calculate progress percentage
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className={`stepped-form ${className}`}>
      {/* Step Indicators */}
      <div className="stepped-form__indicators">
        <div className="stepped-form__progress-bar">
          <div
            className="stepped-form__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="stepped-form__steps">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isAccessible = allowBackNavigation || index <= currentStepIndex;

            return (
              <div
                key={step.id}
                className={`stepped-form__step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isAccessible ? 'disabled' : ''}`}
                onClick={() => {
                  if (isAccessible && allowBackNavigation && index !== currentStepIndex) {
                    setCurrentStepIndex(index);
                    onStepChange?.(index, currentStepIndex);
                  }
                }}
              >
                <div className="stepped-form__step-indicator">
                  {isCompleted ? (
                    <svg
                      className="stepped-form__check-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    showStepNumbers && <span className="stepped-form__step-number">{index + 1}</span>
                  )}
                </div>
                <div className="stepped-form__step-info">
                  <div className="stepped-form__step-title">{step.title}</div>
                  {step.description && (
                    <div className="stepped-form__step-description">{step.description}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="stepped-form__content">
        {validationErrors[currentStep.id] && (
          <div className="stepped-form__error-message">{validationErrors[currentStep.id]}</div>
        )}

        <GenericForm
          formId={`${formId}-step-${currentStepIndex}`}
          fields={currentStepFields.map((field) => {
            // Get saved value for this field
            let savedValue: any = undefined;
            if (field.name.includes('.')) {
              const [parent, child] = field.name.split('.');
              const parentValue = formData[parent];
              if (parentValue && typeof parentValue === 'object') {
                savedValue = parentValue[child];
              }
            } else {
              savedValue = formData[field.name];
            }

            return {
              ...field,
              // Use saved value as defaultValue if field doesn't have a value prop
              value: field.value !== undefined ? field.value : savedValue,
              // Update onChange handlers to also update our formData state
              onChange: field.onChange
                ? (value: any) => {
                    handleFieldChange(field.name, value);
                    field.onChange?.(value);
                  }
                : undefined
            };
          })}
          onSubmit={isLastStep ? handleSubmit : (e) => e.preventDefault()}
          onCategoryChange={onCategoryChange}
          hideSubmit={true}
          className="stepped-form__form"
        >
          {children}
        </GenericForm>

        {/* Navigation Buttons */}
        <div className="stepped-form__navigation">
          {!isFirstStep && (
            <button
              type="button"
              onClick={handlePrevious}
              className="stepped-form__button stepped-form__button--previous"
              disabled={!allowBackNavigation}
            >
              {previousButtonText}
            </button>
          )}
          {!isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              className="stepped-form__button stepped-form__button--next"
            >
              {nextButtonText}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                // Trigger form submission
                const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
                if (form) {
                  form.requestSubmit();
                }
              }}
              className="stepped-form__button stepped-form__button--submit"
            >
              {submitButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

