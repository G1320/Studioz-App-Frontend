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
 *   }
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
  id: string;
  title: string;
  description?: string;
  fieldNames: string[];
  validate?: (formData: Record<string, any>) => boolean | string;
}

type ExtendedFieldType = FieldType | 'multiSelect';

export interface SteppedFormProps {
  steps: FormStep[];
  fields: Array<{
    name: string;
    label: string;
    type: ExtendedFieldType;
    [key: string]: any;
  }>;
  onSubmit: (formData: Record<string, any>, event?: React.FormEvent<HTMLFormElement>) => void;
  formId?: string;
  className?: string;
  submitButtonText?: string;
  nextButtonText?: string;
  previousButtonText?: string;
  onStepChange?: (currentStep: number, previousStep: number) => void;
  onCategoryChange?: (values: string[]) => void;
  children?: ReactNode;
  showStepNumbers?: boolean;
  allowBackNavigation?: boolean;
}

// Helper functions
const getNestedValue = (data: Record<string, any>, fieldName: string): any => {
  if (fieldName.includes('.')) {
    const [parent, child] = fieldName.split('.');
    return data[parent]?.[child];
  }
  return data[fieldName];
};

const setNestedValue = (data: Record<string, any>, fieldName: string, value: any): Record<string, any> => {
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

const collectFormData = (form: HTMLFormElement): Record<string, any> => {
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

const hasAnyValue = (data: Record<string, any>): boolean => {
  return Object.values(data).some((value) => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'object' && !Array.isArray(value)) {
      return Object.values(value).some((v) => v !== null && v !== undefined && v !== '');
    }
    return true;
  });
};

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
  const [formData, setFormData] = useState<Record<string, any>>(() => loadFormData(formId) || {});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const isInitialMount = useRef(true);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Filter fields for current step
  const currentStepFields = useMemo(() => {
    return fields.filter((field) => currentStep.fieldNames.includes(field.name));
  }, [fields, currentStep.fieldNames]);

  // Collect data from current form
  const collectCurrentStepData = useCallback(() => {
    const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
    return form ? collectFormData(form) : {};
  }, [formId, currentStepIndex]);

  // Update form data when controlled fields change
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => setNestedValue(prev, fieldName, value));
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep.validate) {
      const result = currentStep.validate(formData);
      if (result !== true) {
        errors[currentStep.id] = typeof result === 'string' ? result : 'Please complete all required fields';
        setValidationErrors(errors);
        return false;
      }
    }

    currentStepFields.forEach((field) => {
      if (field.onChange) return; // Skip controlled fields

      const fieldValue = getNestedValue(formData, field.name);
      if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
        errors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  }, [currentStep, currentStepFields, formData]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    const currentData = collectCurrentStepData();
    setFormData((prev) => ({ ...prev, ...currentData }));

    if (validateCurrentStep() && currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex, currentStepIndex);
    }
  }, [currentStepIndex, steps.length, validateCurrentStep, onStepChange, collectCurrentStepData]);

  const handlePrevious = useCallback(() => {
    const currentData = collectCurrentStepData();
    setFormData((prev) => ({ ...prev, ...currentData }));

    if (currentStepIndex > 0 && allowBackNavigation) {
      const nextIndex = currentStepIndex - 1;
      setCurrentStepIndex(nextIndex);
      onStepChange?.(nextIndex, currentStepIndex);
    }
  }, [currentStepIndex, allowBackNavigation, onStepChange, collectCurrentStepData]);

  // Form submission
  const handleSubmit = useCallback(
    (data: Record<string, any>, event?: React.FormEvent<HTMLFormElement>) => {
      const currentData = collectCurrentStepData();
      const mergedData = { ...formData, ...currentData, ...data };
      setFormData(mergedData);

      if (validateCurrentStep()) {
        onSubmit(mergedData, event);
      }
    },
    [formData, validateCurrentStep, onSubmit, collectCurrentStepData]
  );

  // Auto-save form data (debounced)
  const debouncedFormData = useDebounce(formData, 1000);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedFormData && hasAnyValue(debouncedFormData)) {
      saveFormData(formId, debouncedFormData);
    }
  }, [debouncedFormData, formId]);

  // Prepare fields with saved values
  const fieldsWithValues = useMemo(() => {
    return currentStepFields.map((field) => {
      const savedValue = getNestedValue(formData, field.name);
      return {
        ...field,
        value: field.value !== undefined ? field.value : savedValue,
        onChange: field.onChange
          ? (value: any) => {
              handleFieldChange(field.name, value);
              field.onChange?.(value);
            }
          : undefined
      };
    });
  }, [currentStepFields, formData, handleFieldChange]);

  return (
    <div className={`stepped-form ${className}`}>
      {/* Step Indicators */}
      <div className="stepped-form__indicators">
        <div className="stepped-form__progress-bar">
          <div className="stepped-form__progress-fill" style={{ width: `${progress}%` }} />
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
                    <svg className="stepped-form__check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    showStepNumbers && <span className="stepped-form__step-number">{index + 1}</span>
                  )}
                </div>
                <div className="stepped-form__step-info">
                  <div className="stepped-form__step-title">{step.title}</div>
                  {step.description && <div className="stepped-form__step-description">{step.description}</div>}
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
          fields={fieldsWithValues}
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
            <button type="button" onClick={handleNext} className="stepped-form__button stepped-form__button--next">
              {nextButtonText}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
                form?.requestSubmit();
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
