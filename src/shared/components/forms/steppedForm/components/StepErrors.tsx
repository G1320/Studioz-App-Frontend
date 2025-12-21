import { StepError } from '@shared/validation/components';

interface StepErrorsProps {
  stepId: string;
  stepTitle: string;
  hasSchema: boolean;
  isValid: boolean;
  validatedSteps: Set<string>;
  validationMessage?: string;
  validationErrors: Record<string, string>;
  legacyError?: string;
}

export const StepErrors = ({
  stepId,
  stepTitle,
  hasSchema,
  isValid,
  validatedSteps,
  validationMessage,
  validationErrors,
  legacyError
}: StepErrorsProps) => {
  const hasValidated = validatedSteps.has(stepId);

  if (!hasValidated) return null;

  // Zod validation errors
  if (hasSchema && !isValid) {
    return (
      <StepError
        message={validationMessage}
        errors={validationErrors}
        stepTitle={stepTitle}
        className="stepped-form__step-error"
      />
    );
  }

  // Legacy validation errors
  if (!hasSchema && legacyError) {
    return <div className="stepped-form__error-message">{legacyError}</div>;
  }

  return null;
};

