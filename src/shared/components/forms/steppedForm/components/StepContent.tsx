import { type ReactNode } from 'react';
import { GenericForm } from '../../GenericHeadlessForm';
import { StepError } from '@shared/validation/components';

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
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
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

  return (
    <GenericForm
      key={`${formId}-step-${currentStepIndex}-${selectedLanguage}`}
      formId={`${formId}-step-${currentStepIndex}`}
      fields={fields.map((field) => ({
        ...field,
        error: hasValidated ? validationErrors[field.name] || stepValidationErrors[field.name] : undefined,
        className:
          hasValidated && (validationErrors[field.name] || stepValidationErrors[field.name]) ? 'has-error' : ''
      }))}
      onSubmit={isLastStep ? onSubmit : (e) => e.preventDefault()}
      onCategoryChange={onCategoryChange}
      hideSubmit={true}
      className="stepped-form__form"
    >
      {children}
    </GenericForm>
  );
};

