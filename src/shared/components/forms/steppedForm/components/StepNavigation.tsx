interface StepNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  allowBackNavigation: boolean;
  hasCustomContent: boolean;
  formId: string;
  currentStepIndex: number;
  prevBtnText: string;
  nextBtnText: string;
  submitBtnText: string;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const StepNavigation = ({
  isFirstStep,
  isLastStep,
  allowBackNavigation,
  hasCustomContent,
  formId,
  currentStepIndex,
  prevBtnText,
  nextBtnText,
  submitBtnText,
  onPrevious,
  onNext,
  onSubmit
}: StepNavigationProps) => {
  const handleSubmit = () => {
    if (hasCustomContent) {
      onSubmit();
    } else {
      const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
      form?.requestSubmit();
    }
  };

  return (
    <div className="stepped-form__navigation">
      {!isFirstStep && (
        <button
          type="button"
          onClick={onPrevious}
          className="stepped-form__button stepped-form__button--previous"
          disabled={!allowBackNavigation}
        >
          {prevBtnText}
        </button>
      )}
      {!isLastStep ? (
        <button type="button" onClick={onNext} className="stepped-form__button stepped-form__button--next">
          {nextBtnText}
        </button>
      ) : (
        <button type="button" onClick={handleSubmit} className="stepped-form__button stepped-form__button--submit">
          {submitBtnText}
        </button>
      )}
    </div>
  );
};

