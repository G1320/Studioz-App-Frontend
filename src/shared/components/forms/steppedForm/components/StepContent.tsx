import { type ReactNode } from 'react';
import { GenericForm } from '../../GenericHeadlessForm';

interface StepContentProps {
  stepId: string;
  formId: string;
  currentStepIndex: number;
  selectedLanguage: 'en' | 'he';
  customContent?: ReactNode;
  fields: any[];
  isLastStep: boolean;
  validatedSteps: Set<string>;
  validationErrors: Record<string, string>;
  stepValidationErrors: Record<string, string>;
  onSubmit: (formData: Record<string, any>, event?: React.FormEvent<HTMLFormElement>) => void;
  onCategoryChange?: (values: string[]) => void;
  children?: ReactNode;
}

export const StepContent = ({
  stepId,
  formId,
  currentStepIndex,
  selectedLanguage,
  customContent,
  fields,
  isLastStep,
  validatedSteps,
  validationErrors,
  stepValidationErrors,
  onSubmit,
  onCategoryChange,
  children
}: StepContentProps) => {
  if (customContent) {
    return <>{customContent}</>;
  }

  const hasValidated = validatedSteps.has(stepId);

  // Helper function to get error for a field (including nested errors)
  const getFieldError = (fieldName: string, errors: Record<string, string>): string | undefined => {
    // Check exact match first
    if (errors[fieldName]) {
      return errors[fieldName];
    }
    // Check for nested errors (e.g., studioAvailability.days, studioAvailability.times)
    const nestedErrors = Object.keys(errors)
      .filter(key => key.startsWith(`${fieldName}.`))
      .map(key => errors[key])
      .filter(Boolean);
    // If multiple nested errors, combine them; otherwise return the first one
    if (nestedErrors.length > 1) {
      return nestedErrors.join('; ');
    }
    return nestedErrors.length > 0 ? nestedErrors[0] : undefined;
  };

  return (
    <GenericForm
      key={`${formId}-step-${currentStepIndex}-${selectedLanguage}`}
      formId={`${formId}-step-${currentStepIndex}`}
      fields={fields.map((field) => {
        const error = hasValidated 
          ? getFieldError(field.name, validationErrors) || getFieldError(field.name, stepValidationErrors)
          : undefined;
        return {
          ...field,
          error,
          className: hasValidated && error ? 'has-error' : ''
        };
      })}
      onSubmit={isLastStep ? onSubmit : (_formData, event) => {
        if (event) {
          event.preventDefault();
        }
      }}
      onCategoryChange={onCategoryChange}
      hideSubmit={true}
      className="stepped-form__form"
    >
      {children}
    </GenericForm>
  );
};

