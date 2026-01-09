import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ZodSchema } from 'zod';
import { FieldType } from './GenericHeadlessForm';
import { loadFormData, saveFormData } from '@shared/utils/formAutoSaveUtils';
import { useDebounce } from '@shared/hooks/debauncing';
import { useStepValidation } from '@shared/validation/hooks/useStepValidation';
import { formatZodIssueWithI18n } from '@shared/validation/utils/zodI18n';
import {
  setNestedValue,
  getNestedValue,
  hasAnyValue,
  getStepFromUrl,
  updateUrlStep,
  filterStepFields,
  prepareFieldsWithValues,
  validateStep,
  mergeFormData,
  collectFormData,
  hasErrorsInOtherLanguage
} from './steppedForm/utils';
import { useLanguageToggle } from './steppedForm/hooks/useLanguageToggle';
import { useStepNavigation } from './steppedForm/hooks/useStepNavigation';
import { StepContent } from './steppedForm/components/StepContent';
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
  /** Icon component to display in the step indicator */
  icon?: React.ElementType;
  /** Optional Pro Tip content to display at the bottom of the step */
  proTip?: ReactNode;
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
  const { t, i18n } = useTranslation('forms');
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
  // const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Filter fields for current step
  const currentStepFields = useMemo(
    () => filterStepFields(fields, currentStep.fieldNames, currentStep.languageToggle, selectedLanguage),
    [fields, currentStep.fieldNames, currentStep.languageToggle, selectedLanguage]
  );

  // Sync field values into formData when step loads (for controlled fields like categories)
  // This ensures fields with a value prop are properly initialized in formData
  // This runs after the localStorage load effect to initialize missing values
  // Also updates values when they change (for dynamic fields like galleryImages)
  useEffect(() => {
    setFormData((prev) => {
      let updated = { ...prev };
      let hasChanges = false;

      currentStepFields.forEach((field) => {
        // Sync if field has a value prop
        if (field.value !== undefined && field.value !== null && field.value !== '') {
          const existingValue = getNestedValue(prev, field.name);

          // For steps with custom content (like file upload), always sync the value
          // This ensures galleryImages and other dynamic fields stay in sync
          const isCustomContentStep = currentStep.customContent !== undefined;

          // Check if existing value is empty/missing - includes undefined, null, empty string
          const isExistingEmpty = existingValue === undefined || existingValue === null || existingValue === '';

          // Initialize if missing/empty, or update if it's a custom content step (to keep dynamic values in sync)
          if (
            isExistingEmpty ||
            (isCustomContentStep && JSON.stringify(existingValue) !== JSON.stringify(field.value))
          ) {
            updated = setNestedValue(updated, field.name, field.value);
            hasChanges = true;
          }
        }
      });

      return hasChanges ? updated : prev;
    });
  }, [currentStepIndex, currentStepFields, currentStep.customContent]); // Sync when step, fields, or custom content changes

  // Update form data when controlled fields change
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => {
      const updated = setNestedValue(prev, fieldName, value);
      return updated;
    });
  }, []);

  // Merge current field values into formData for validation (ensures we have latest values, especially for custom content steps)
  const formDataForValidation = useMemo(() => {
    let merged = { ...formData };
    currentStepFields.forEach((field) => {
      if (field.value !== undefined && field.value !== null && field.value !== '') {
        // For custom content steps, always use the latest field value
        // For regular steps, use field value if formData doesn't have it or has empty value
        const isCustomContentStep = currentStep.customContent !== undefined;
        const existingValue = getNestedValue(merged, field.name);
        const isExistingEmpty = existingValue === undefined || existingValue === null || existingValue === '';

        if (isCustomContentStep || isExistingEmpty) {
          merged = setNestedValue(merged, field.name, field.value);
        }
      }
    });
    return merged;
  }, [formData, currentStepFields, currentStep.customContent]);

  // Use Zod validation if schema is provided
  const stepValidation = useStepValidation(currentStep.schema, formDataForValidation, currentStep.id, {
    validateOnlyStepFields: true,
    stepFieldNames: currentStep.fieldNames
  });

  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    setValidatedSteps((prev) => new Set(prev).add(currentStep.id));

    // Collect current form data from HTML form to ensure we have latest values
    const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
    const latestFormData = form ? { ...formDataForValidation, ...collectFormData(form) } : formDataForValidation;

    // For language-toggle steps, merge with saved formData to ensure both languages are available
    // This is needed because filterStepFields only shows fields for the selected language,
    // but validation requires all fields (e.g., both name.en and name.he)
    const dataForValidation = currentStep.languageToggle ? { ...formData, ...latestFormData } : latestFormData;

    // Validate with latest data if schema exists
    let zodResult = undefined;
    if (currentStep.schema) {
      try {
        // Extract only step-specific fields
        const dataToValidate: Record<string, any> = {};
        currentStep.fieldNames.forEach((fieldName) => {
          if (fieldName.includes('.')) {
            const [parent, child] = fieldName.split('.');
            if (!dataToValidate[parent]) dataToValidate[parent] = {};
            // Check both latestFormData and formData to ensure we get all language variants
            const value = dataForValidation[parent]?.[child] ?? formData[parent]?.[child];
            if (value !== undefined) {
              dataToValidate[parent][child] = value;
            }
          } else {
            // Check both latestFormData and formData
            const value = dataForValidation[fieldName] ?? formData[fieldName];
            if (value !== undefined) {
              dataToValidate[fieldName] = value;
            }
          }
        });
        currentStep.schema.parse(dataToValidate);
        zodResult = { isValid: true, errors: {} };
      } catch (error: any) {
        if (error.name === 'ZodError') {
          const errors: Record<string, string> = {};
          error.issues?.forEach((issue: any) => {
            const fieldPath = issue.path.map(String).join('.');
            // Use i18n formatter to get user-friendly error messages
            const formattedMessage = formatZodIssueWithI18n(issue, t, fieldPath);
            errors[fieldPath] = formattedMessage;
          });
          zodResult = { isValid: false, errors };
        }
      }
    }

    const validationResult = validateStep({
      schema: currentStep.schema,
      validate: currentStep.validate,
      formData: dataForValidation,
      fields: currentStepFields as Array<{ name: string; label?: string; onChange?: any; [key: string]: any }>,
      stepId: currentStep.id,
      zodValidationResult: zodResult,
      t: t as any
    });

    setValidationErrors(validationResult.errors);
    return validationResult.isValid;
  }, [currentStep, currentStepFields, formDataForValidation, formData, t, formId, currentStepIndex]);

  // Validate when language changes on a step with languageToggle
  // This ensures the error hint appears/disappears when errors are fixed
  // Only validate if the step has been validated before (user has tried to proceed)
  useEffect(() => {
    if (currentStep?.languageToggle && validatedSteps.has(currentStep.id)) {
      // Use a small delay to ensure formData is updated after language toggle
      const timeoutId = setTimeout(() => {
        validateCurrentStep();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedLanguage, currentStep?.languageToggle, currentStep?.id, validatedSteps, validateCurrentStep]);

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

  // Auto-save form data (debounced) - reduced delay for faster saves
  const debouncedFormData = useDebounce(formData, 300);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedFormData && hasAnyValue(debouncedFormData)) {
      saveFormData(formId, debouncedFormData);
    }
  }, [debouncedFormData, formId]);

  // Check if there are validation errors in the other language
  const hasOtherLanguageErrors = useMemo(() => {
    if (!currentStep.languageToggle) return false;
    return hasErrorsInOtherLanguage(validationErrors, selectedLanguage, currentStep.fieldNames);
  }, [validationErrors, selectedLanguage, currentStep.languageToggle, currentStep.fieldNames]);

  // Prepare fields with saved values
  const fieldsWithValues = useMemo(() => {
    const prepared = prepareFieldsWithValues(currentStepFields, formData, handleFieldChange);

    // Add step counter to the first sectionHeader field
    let foundFirstSectionHeader = false;
    const withStepCounter = prepared.map((field) => {
      if (field.type === 'sectionHeader' && !foundFirstSectionHeader) {
        foundFirstSectionHeader = true;
        return {
          ...field,
          stepCounter: {
            current: currentStepIndex + 1,
            total: steps.length
          }
        };
      }
      // Add error indicator to languageToggle field if there are errors in the other language
      if (field.type === 'languageToggle' && currentStep.languageToggle && hasOtherLanguageErrors) {
        return {
          ...field,
          hasOtherLanguageErrors: true
        };
      }
      return field;
    });

    return withStepCounter;
  }, [currentStepFields, formData, handleFieldChange, currentStep.languageToggle, hasOtherLanguageErrors, currentStepIndex, steps.length]);

  // Check if current language is RTL (Hebrew)
  const isRTL = i18n.language === 'he';

  // Slide animation variants
  // In RTL mode, reverse the direction for proper animation flow
  const slideVariants = {
    enter: (direction: number) => {
      const effectiveDirection = isRTL ? -direction : direction;
      return {
        x: effectiveDirection > 0 ? '100%' : '-100%',
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      const effectiveDirection = isRTL ? -direction : direction;
      return {
        x: effectiveDirection > 0 ? '-100%' : '100%',
        opacity: 0
      };
    }
  };

  const slideTransition = {
    x: { type: 'spring', stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };

  // Calculate progress percentage
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className={`stepped-form ${className}`}>
      {/* Step Indicators - At top */}
      <div className="stepped-form__indicators">
        {/* Mobile progress bar */}
        <div className="stepped-form__progress-bar">
          <div 
            className="stepped-form__progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="stepped-form__progress-text">
          {t('form.stepCounter', {
            current: currentStepIndex + 1,
            total: steps.length,
            defaultValue: `Step ${currentStepIndex + 1} of ${steps.length}`
          })}
        </div>
        
        {/* Desktop step indicators */}
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
                  ) : step.icon ? (
                    <step.icon className="stepped-form__step-icon" />
                  ) : (
                    showStepNumbers && <span className="stepped-form__step-number">{index + 1}</span>
                  )}
                </div>
                <div className="stepped-form__step-info">
                  <div className="stepped-form__step-title">{step.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="stepped-form__content">
        {/* Form Content */}
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
              proTip={currentStep.proTip}
              stepCounter={currentStep.customContent ? { current: currentStepIndex + 1, total: steps.length } : undefined}
              stepIcon={currentStep.icon}
              stepTitle={currentStep.customContent ? currentStep.title : undefined}
              stepSubtitle={currentStep.customContent ? currentStep.description : undefined}
            >
              {children}
            </StepContent>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Navigation */}
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
  );
};
