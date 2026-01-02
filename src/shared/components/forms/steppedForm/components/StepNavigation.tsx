import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
  const { t } = useTranslation('forms');
  
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
      <button
        type="button"
        onClick={onPrevious}
        className="stepped-form__button stepped-form__button--previous"
        disabled={isFirstStep || !allowBackNavigation}
      >
        <ChevronLeftIcon />
        {prevBtnText}
      </button>

      <div className="stepped-form__navigation-right">
        <span className="stepped-form__auto-save">
          {t('form.autoSaved', 'Auto-saved 2 mins ago')}
        </span>
        {!isLastStep ? (
          <button type="button" onClick={onNext} className="stepped-form__button stepped-form__button--next">
            {nextBtnText}
            <ChevronRightIcon />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} className="stepped-form__button stepped-form__button--submit">
            {submitBtnText}
            <ChevronRightIcon />
          </button>
        )}
      </div>
    </div>
  );
};

