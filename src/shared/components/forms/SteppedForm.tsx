import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ZodSchema } from 'zod';
import { GenericForm, FieldType } from './GenericHeadlessForm';
import { loadFormData, saveFormData } from '@shared/utils/formAutoSaveUtils';
import { useDebounce } from '@shared/hooks/debauncing';
import { useStepValidation } from '@shared/validation/hooks/useStepValidation';
import { StepError } from '@shared/validation/components';
import { getNestedValue, setNestedValue, hasAnyValue, getStepFromUrl, updateUrlStep } from './steppedForm/utils';
import { useLanguageToggle } from './steppedForm/hooks/useLanguageToggle';
import { useStepNavigation } from './steppedForm/hooks/useStepNavigation';
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
  /** Zod schema for validation (takes precedence over validate function) */
  schema?: ZodSchema;
  /** Custom validation function (kept for backward compatibility) */
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
  // Initialize formData from localStorage
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const saved = loadFormData(formId);
    return saved || {};
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [validatedSteps, setValidatedSteps] = useState<Set<string>>(new Set());
  const isInitialMount = useRef(true);
  const isUpdatingUrlRef = useRef(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(() => getStepFromUrl(searchParams, steps));
  const [direction, setDirection] = useState<number>(1);
  const previousStepIndexRef = useRef(currentStepIndex);
  const [internalSelectedLanguage, setInternalSelectedLanguage] = useState<'en' | 'he'>('en');

  // Use external language state if provided, otherwise use internal
  const selectedLanguage = externalSelectedLanguage ?? internalSelectedLanguage;

  // Reload formData from localStorage when step or language changes (to ensure we have latest saved data)
  useEffect(() => {
    const saved = loadFormData(formId);
    if (saved && Object.keys(saved).length > 0) {
      setFormData((prev) => {
        // Start with saved data (has all languages)
        const merged = { ...saved };
        // Merge with current state to preserve any unsaved changes
        Object.entries(prev).forEach(([key, value]) => {
          if (key.includes('.')) {
            const [parent, child] = key.split('.');
            merged[parent] = { ...(merged[parent] || {}), [child]: value };
          } else {
            merged[key] = value;
          }
        });
        return merged;
      });
    }
  }, [currentStepIndex, selectedLanguage, formId]);

  // Handle language toggle and preserve form data
  useLanguageToggle({
    selectedLanguage,
    currentStepIndex,
    formId,
    steps,
    setFormData
  });

  // Update URL with current step
  const updateUrlStepCallback = useCallback(
    (stepIndex: number, replace: boolean = false) => {
      if (isUpdatingUrlRef.current) return;

      isUpdatingUrlRef.current = true;
      updateUrlStep(stepIndex, steps, location, navigate, replace);

      // Reset flag after navigation
      setTimeout(() => {
        isUpdatingUrlRef.current = false;
      }, 50);
    },
    [steps, location, navigate]
  );

  // Sync URL changes (from browser back/forward) with form state
  useEffect(() => {
    if (isUpdatingUrlRef.current) return;

    const urlStepIndex = getStepFromUrl(searchParams, steps);
    if (urlStepIndex !== currentStepIndex && urlStepIndex >= 0 && urlStepIndex < steps.length) {
      // Determine direction based on step index change
      setDirection(urlStepIndex > currentStepIndex ? 1 : -1);
      previousStepIndexRef.current = currentStepIndex;
      setCurrentStepIndex(urlStepIndex);
      onStepChange?.(urlStepIndex, currentStepIndex);
    }
  }, [searchParams, currentStepIndex, steps, onStepChange]);

  // Initialize URL on mount if no step param exists
  useEffect(() => {
    if (!searchParams.get('step')) {
      updateUrlStepCallback(currentStepIndex, true);
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

  // Update form data when controlled fields change
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => {
      const updated = setNestedValue(prev, fieldName, value);
      return updated;
    });
  }, []);

  // Use Zod validation if schema is provided
  const stepValidation = useStepValidation(currentStep.schema, formData, currentStep.id, {
    validateOnlyStepFields: true,
    stepFieldNames: currentStep.fieldNames
  });

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    // Mark this step as validated
    setValidatedSteps((prev) => new Set(prev).add(currentStep.id));

    const errors: Record<string, string> = {};

    // Use Zod validation if schema is provided
    if (currentStep.schema) {
      const validationResult = stepValidation.validate();
      if (!validationResult.isValid) {
        setValidationErrors(validationResult.errors);
        return false;
      }
      setValidationErrors({});
      return true;
    }

    // Fallback to custom validate function (backward compatibility)
    if (currentStep.validate) {
      const result = currentStep.validate(formData);
      if (result !== true) {
        errors[currentStep.id] =
          typeof result === 'string' ? result : t('form.validation.required', 'Please complete all required fields');
        setValidationErrors(errors);
        return false;
      }
    }

    // Fallback to basic required field validation
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
  }, [currentStep, currentStepFields, formData, t, stepValidation]);

  // Navigation handlers
  const { handleNext, handlePrevious, handleStepClick, collectCurrentStepData } = useStepNavigation({
    currentStepIndex,
    steps,
    setCurrentStepIndex,
    setDirection,
    setFormData,
    formId,
    location,
    navigate,
    onStepChange,
    allowBackNavigation,
    validateCurrentStep,
    isUpdatingUrlRef
  });

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
      // Always get the latest value from formData (not from field.value which might be stale)
      const savedValue = getNestedValue(formData, field.name);
      // Use formData value if available, otherwise use field.value, otherwise undefined
      const fieldValue = savedValue !== undefined ? savedValue : field.value !== undefined ? field.value : undefined;

      return {
        ...field,
        value: fieldValue,
        onChange: (value: any) => {
          // Always update formData immediately when field changes
          handleFieldChange(field.name, value);
          // Also call original onChange if provided
          field.onChange?.(value);
        }
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
        {/* Step-level error display - only show if step has been validated */}
        {currentStep.schema && validatedSteps.has(currentStep.id) && !stepValidation.isValid && (
          <StepError
            message={stepValidation.message}
            errors={stepValidation.errors}
            stepTitle={currentStep.title}
            className="stepped-form__step-error"
          />
        )}

        {/* Legacy error display for custom validate functions - only show if step has been validated */}
        {!currentStep.schema && validatedSteps.has(currentStep.id) && validationErrors[currentStep.id] && (
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
                key={`${formId}-step-${currentStepIndex}-${selectedLanguage}`}
                formId={`${formId}-step-${currentStepIndex}`}
                fields={fieldsWithValues.map((field) => ({
                  ...field,
                  error: validatedSteps.has(currentStep.id)
                    ? validationErrors[field.name] || stepValidation.errors[field.name]
                    : undefined,
                  className:
                    validatedSteps.has(currentStep.id) &&
                    (validationErrors[field.name] || stepValidation.errors[field.name])
                      ? 'has-error'
                      : ''
                }))}
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
                onClick={() => handleStepClick(index)}
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
