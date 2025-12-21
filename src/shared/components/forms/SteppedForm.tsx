import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ZodSchema } from 'zod';
import { FieldType } from './GenericHeadlessForm';
import { loadFormData, saveFormData } from '@shared/utils/formAutoSaveUtils';
import { useDebounce } from '@shared/hooks/debauncing';
import { useStepValidation } from '@shared/validation/hooks/useStepValidation';
import {
  setNestedValue,
  hasAnyValue,
  getStepFromUrl,
  getLanguageFromUrl,
  updateUrlStep,
  updateUrlLanguage,
  filterStepFields,
  prepareFieldsWithValues,
  validateStep,
  mergeFormData
} from './steppedForm/utils';
import { useLanguageToggle } from './steppedForm/hooks/useLanguageToggle';
import { useStepNavigation } from './steppedForm/hooks/useStepNavigation';
import { StepContent } from './steppedForm/components/StepContent';
import { StepErrors } from './steppedForm/components/StepErrors';
import { StepNavigation } from './steppedForm/components/StepNavigation';
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

  // Initialize language from URL or default to 'en'
  const [internalSelectedLanguage, setInternalSelectedLanguage] = useState<'en' | 'he'>(() => {
    const urlLang = getLanguageFromUrl(searchParams);
    return urlLang || 'en';
  });

  // Use external language state if provided, otherwise use internal
  const selectedLanguage = externalSelectedLanguage ?? internalSelectedLanguage;

  // Reload formData from localStorage when step changes (to ensure we have latest saved data)
  // Note: Language changes are handled by useLanguageToggle hook which preserves both languages
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
  }, [currentStepIndex, formId]); // Removed selectedLanguage to avoid conflicts with useLanguageToggle

  // Handle language toggle and preserve form data
  useLanguageToggle({
    selectedLanguage,
    currentStepIndex,
    formId,
    steps,
    setFormData,
    formData
  });

  // Update URL with current step and language
  const updateUrlStepCallback = useCallback(
    (stepIndex: number, replace: boolean = false) => {
      if (isUpdatingUrlRef.current) return;

      isUpdatingUrlRef.current = true;
      updateUrlStep(stepIndex, steps, location, navigate, replace, selectedLanguage);

      // Reset flag after navigation
      setTimeout(() => {
        isUpdatingUrlRef.current = false;
      }, 50);
    },
    [steps, location, navigate, selectedLanguage]
  );

  // Update URL when language changes (only if using internal state)
  useEffect(() => {
    if (!externalSelectedLanguage && !onLanguageChange) {
      // Only update URL if language actually changed
      const urlLang = getLanguageFromUrl(searchParams);
      if (urlLang !== internalSelectedLanguage) {
        updateUrlLanguage(internalSelectedLanguage, location, navigate, false);
      }
    }
  }, [internalSelectedLanguage, externalSelectedLanguage, onLanguageChange, searchParams, location, navigate]);

  // Update URL when external language changes
  useEffect(() => {
    if (externalSelectedLanguage && onLanguageChange) {
      const urlLang = getLanguageFromUrl(searchParams);
      if (urlLang !== externalSelectedLanguage) {
        updateUrlLanguage(externalSelectedLanguage, location, navigate, false);
      }
    }
  }, [externalSelectedLanguage, onLanguageChange, searchParams, location, navigate]);

  // Sync URL changes (from browser back/forward) with form state
  useEffect(() => {
    if (isUpdatingUrlRef.current) return;

    const urlStepIndex = getStepFromUrl(searchParams, steps);
    const urlLanguage = getLanguageFromUrl(searchParams);

    // Update step if changed
    if (urlStepIndex !== currentStepIndex && urlStepIndex >= 0 && urlStepIndex < steps.length) {
      // Determine direction based on step index change
      setDirection(urlStepIndex > currentStepIndex ? 1 : -1);
      previousStepIndexRef.current = currentStepIndex;
      setCurrentStepIndex(urlStepIndex);
      onStepChange?.(urlStepIndex, currentStepIndex);
    }

    // Update language if changed in URL (only if using internal state)
    if (urlLanguage && !externalSelectedLanguage && !onLanguageChange) {
      if (urlLanguage !== internalSelectedLanguage) {
        setInternalSelectedLanguage(urlLanguage);
      }
    } else if (urlLanguage && externalSelectedLanguage && onLanguageChange) {
      // If using external state, notify parent of language change from URL
      if (urlLanguage !== externalSelectedLanguage) {
        onLanguageChange(urlLanguage);
      }
    }
  }, [
    searchParams,
    currentStepIndex,
    steps,
    onStepChange,
    externalSelectedLanguage,
    onLanguageChange,
    internalSelectedLanguage
  ]);

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
  const currentStepFields = useMemo(
    () => filterStepFields(fields, currentStep.fieldNames, currentStep.languageToggle, selectedLanguage),
    [fields, currentStep.fieldNames, currentStep.languageToggle, selectedLanguage]
  );

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
    setValidatedSteps((prev) => new Set(prev).add(currentStep.id));

    const zodResult = currentStep.schema ? stepValidation.validate() : undefined;
    const validationResult = validateStep({
      schema: currentStep.schema,
      validate: currentStep.validate,
      formData,
      fields: currentStepFields as Array<{ name: string; label?: string; onChange?: any; [key: string]: any }>,
      stepId: currentStep.id,
      zodValidationResult: zodResult,
      t: t as any
    });

    setValidationErrors(validationResult.errors);
    return validationResult.isValid;
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
    isUpdatingUrlRef,
    selectedLanguage
  });

  // Form submission
  const handleSubmit = useCallback(
    (data: Record<string, any>, event?: React.FormEvent<HTMLFormElement>) => {
      const currentData = collectCurrentStepData();
      // Use mergeFormData to preserve both languages in nested objects
      const mergedData = mergeFormData(mergeFormData(formData, currentData), data);
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
  const fieldsWithValues = useMemo(
    () => prepareFieldsWithValues(currentStepFields, formData, handleFieldChange),
    [currentStepFields, formData, handleFieldChange]
  );

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
        <StepErrors
          stepId={currentStep.id}
          stepTitle={currentStep.title}
          hasSchema={!!currentStep.schema}
          isValid={stepValidation.isValid}
          validatedSteps={validatedSteps}
          validationMessage={stepValidation.message}
          validationErrors={stepValidation.errors}
          legacyError={validationErrors[currentStep.id]}
        />

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
            <StepContent
              stepId={currentStep.id}
              formId={formId}
              currentStepIndex={currentStepIndex}
              selectedLanguage={selectedLanguage}
              customContent={currentStep.customContent}
              fields={fieldsWithValues}
              isLastStep={isLastStep}
              validatedSteps={validatedSteps}
              validationErrors={validationErrors}
              stepValidationErrors={stepValidation.errors}
              onSubmit={handleSubmit}
              onCategoryChange={onCategoryChange}
            >
              {children}
            </StepContent>
          </motion.div>
        </AnimatePresence>

        <StepNavigation
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          allowBackNavigation={allowBackNavigation}
          hasCustomContent={!!currentStep.customContent}
          formId={formId}
          currentStepIndex={currentStepIndex}
          prevBtnText={prevBtnText}
          nextBtnText={nextBtnText}
          submitBtnText={submitBtnText}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={() => handleSubmit({})}
        />
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
