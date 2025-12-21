import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
  customContent?: ReactNode;
  languageToggle?: boolean; // Enable language toggle for dual-language fields
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
  selectedLanguage?: 'en' | 'he';
  onLanguageChange?: (language: 'en' | 'he') => void;
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
  submitButtonText,
  nextButtonText,
  previousButtonText,
  onStepChange,
  onCategoryChange,
  children,
  showStepNumbers = true,
  allowBackNavigation = true,
  selectedLanguage: externalSelectedLanguage,
  onLanguageChange
}: SteppedFormProps) => {
  const { t } = useTranslation('forms');
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, any>>(() => loadFormData(formId) || {});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const isInitialMount = useRef(true);
  const isUpdatingUrlRef = useRef(false);

  // Get step from URL or default to 0
  const getStepFromUrl = useCallback((): number => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      // Try to find by step ID first
      const stepIndexById = steps.findIndex((step) => step.id === stepParam);
      if (stepIndexById !== -1) {
        return stepIndexById;
      }
      // Fallback to numeric index
      const stepIndex = parseInt(stepParam, 10);
      if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < steps.length) {
        return stepIndex;
      }
    }
    return 0;
  }, [searchParams, steps]);

  const [currentStepIndex, setCurrentStepIndex] = useState(() => getStepFromUrl());
  const [direction, setDirection] = useState<number>(1);
  const previousStepIndexRef = useRef(currentStepIndex);
  const [internalSelectedLanguage, setInternalSelectedLanguage] = useState<'en' | 'he'>('en');
  
  // Use external language state if provided, otherwise use internal
  const selectedLanguage = externalSelectedLanguage ?? internalSelectedLanguage;
  const setSelectedLanguage = onLanguageChange ?? setInternalSelectedLanguage;

  // Update URL with current step
  const updateUrlStep = useCallback(
    (stepIndex: number, replace: boolean = false) => {
      if (isUpdatingUrlRef.current) return;

      isUpdatingUrlRef.current = true;
      const stepId = steps[stepIndex]?.id || stepIndex.toString();
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.set('step', stepId);

      const searchString = newSearchParams.toString();
      const newUrl = `${location.pathname}${searchString ? `?${searchString}` : ''}`;

      navigate(newUrl, { replace });

      // Reset flag after navigation
      setTimeout(() => {
        isUpdatingUrlRef.current = false;
      }, 50);
    },
    [steps, location.pathname, location.search, navigate]
  );

  // Sync URL changes (from browser back/forward) with form state
  useEffect(() => {
    if (isUpdatingUrlRef.current) return;

    const urlStepIndex = getStepFromUrl();
    if (urlStepIndex !== currentStepIndex && urlStepIndex >= 0 && urlStepIndex < steps.length) {
      // Determine direction based on step index change
      setDirection(urlStepIndex > currentStepIndex ? 1 : -1);
      previousStepIndexRef.current = currentStepIndex;
      setCurrentStepIndex(urlStepIndex);
      onStepChange?.(urlStepIndex, currentStepIndex);
    }
  }, [searchParams, getStepFromUrl, currentStepIndex, steps.length, onStepChange]);

  // Initialize URL on mount if no step param exists
  useEffect(() => {
    if (!searchParams.get('step')) {
      updateUrlStep(currentStepIndex, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Use translations with fallback to props or defaults
  const submitBtnText = submitButtonText || t('form.buttons.submit', 'Submit');
  const nextBtnText = nextButtonText || t('form.buttons.next', 'Next');
  const prevBtnText = previousButtonText || t('form.buttons.previous', 'Previous');

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Filter fields for current step
  const currentStepFields = useMemo(() => {
    let filteredFields = fields.filter((field) => currentStep.fieldNames.includes(field.name));
    
    // If language toggle is enabled, filter to show only selected language
    if (currentStep.languageToggle) {
      filteredFields = filteredFields.filter((field) => {
        // Keep fields that match the selected language
        if (field.name.endsWith(`.${selectedLanguage}`)) {
          return true;
        }
        // Keep fields that don't have a language suffix (non-language fields)
        if (!field.name.includes('.en') && !field.name.includes('.he')) {
          return true;
        }
        return false;
      });
    }
    
    return filteredFields;
  }, [fields, currentStep.fieldNames, currentStep.languageToggle, selectedLanguage]);

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
        errors[currentStep.id] =
          typeof result === 'string' ? result : t('form.validation.required', 'Please complete all required fields');
        setValidationErrors(errors);
        return false;
      }
    }

    currentStepFields.forEach((field) => {
      if (field.onChange) return; // Skip controlled fields

      const fieldValue = getNestedValue(formData, field.name);
      if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
        errors[field.name] = t('form.validation.fieldRequired', '{{field}} is required', {
          field: field.label
        });
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  }, [currentStep, currentStepFields, formData, t]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    const currentData = collectCurrentStepData();
    setFormData((prev) => ({ ...prev, ...currentData }));

    if (validateCurrentStep() && currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setDirection(1); // Forward direction
      previousStepIndexRef.current = currentStepIndex;
      setCurrentStepIndex(nextIndex);
      updateUrlStep(nextIndex, false); // Don't replace, allow browser history
      onStepChange?.(nextIndex, currentStepIndex);
    }
  }, [currentStepIndex, steps.length, validateCurrentStep, onStepChange, collectCurrentStepData, updateUrlStep]);

  const handlePrevious = useCallback(() => {
    const currentData = collectCurrentStepData();
    setFormData((prev) => ({ ...prev, ...currentData }));

    if (currentStepIndex > 0 && allowBackNavigation) {
      const nextIndex = currentStepIndex - 1;
      setDirection(-1); // Backward direction
      previousStepIndexRef.current = currentStepIndex;
      setCurrentStepIndex(nextIndex);
      updateUrlStep(nextIndex, false); // Don't replace, allow browser history
      onStepChange?.(nextIndex, currentStepIndex);
    }
  }, [currentStepIndex, allowBackNavigation, onStepChange, collectCurrentStepData, updateUrlStep]);

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

  // Reset language when step changes (only if using internal state)
  useEffect(() => {
    if (!externalSelectedLanguage && !onLanguageChange) {
      setInternalSelectedLanguage('en');
    }
  }, [currentStepIndex, externalSelectedLanguage, onLanguageChange]);

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

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };

  const slideTransition = {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };

  return (
    <div className={`stepped-form ${className}`}>
      {/* Current Step Content */}
      <div className="stepped-form__content">
        {validationErrors[currentStep.id] && (
          <div className="stepped-form__error-message">{validationErrors[currentStep.id]}</div>
        )}

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStepIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            style={{ width: '100%' }}
          >
            {currentStep.customContent ? (
              currentStep.customContent
            ) : (
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
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="stepped-form__navigation">
          {!isFirstStep && (
            <button
              type="button"
              onClick={handlePrevious}
              className="stepped-form__button stepped-form__button--previous"
              disabled={!allowBackNavigation}
            >
              {prevBtnText}
            </button>
          )}
          {!isLastStep ? (
            <button type="button" onClick={handleNext} className="stepped-form__button stepped-form__button--next">
              {nextBtnText}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (currentStep.customContent) {
                  // For steps with custom content, directly call handleSubmit
                  handleSubmit({});
                } else {
                  // For regular form steps, trigger form submission
                const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
                form?.requestSubmit();
                }
              }}
              className="stepped-form__button stepped-form__button--submit"
            >
              {submitBtnText}
            </button>
          )}
        </div>
      </div>

      {/* Step Indicators - At bottom */}
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
                    const currentData = collectCurrentStepData();
                    setFormData((prev) => ({ ...prev, ...currentData }));
                    setDirection(index > currentStepIndex ? 1 : -1);
                    previousStepIndexRef.current = currentStepIndex;
                    setCurrentStepIndex(index);
                    updateUrlStep(index, false); // Don't replace, allow browser history
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
    </div>
  );
};
