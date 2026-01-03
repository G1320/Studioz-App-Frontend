import { useCallback, useRef } from 'react';
import { updateUrlStep } from '../utils/urlUtils';
import { collectFormData, mergeFormData } from '../utils/formDataUtils';

// Scroll to form with offset to show more content in the viewport
const scrollToFormWithOffset = (offset: number = 100) => {
  const formElement = document.querySelector('.stepped-form') as HTMLElement;
  if (formElement) {
    const elementPosition = formElement.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
};

interface UseStepNavigationOptions {
  currentStepIndex: number;
  steps: Array<{ id: string }>;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  setDirection: React.Dispatch<React.SetStateAction<number>>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  formId: string;
  location: { pathname: string; search: string };
  navigate: (url: string, options?: { replace?: boolean }) => void;
  onStepChange?: (currentStep: number, previousStep: number) => void;
  allowBackNavigation: boolean;
  validateCurrentStep: () => boolean;
  isUpdatingUrlRef: React.MutableRefObject<boolean>;
}

/**
 * Hook to handle step navigation in SteppedForm
 */
export const useStepNavigation = ({
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
  isUpdatingUrlRef: _isUpdatingUrlRef
}: UseStepNavigationOptions) => {
  const previousStepIndexRef = useRef(currentStepIndex);

  const collectCurrentStepData = useCallback(() => {
    const form = document.getElementById(`${formId}-step-${currentStepIndex}`) as HTMLFormElement;
    if (!form) return {};
    return collectFormData(form);
  }, [formId, currentStepIndex]);

  const handleNext = useCallback(() => {
    const currentData = collectCurrentStepData();
    // Use mergeFormData to preserve both languages in nested objects
    setFormData((prev) => mergeFormData(prev, currentData));

    if (validateCurrentStep() && currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setDirection(1);
      previousStepIndexRef.current = currentStepIndex;
      setCurrentStepIndex(nextIndex);
      updateUrlStep(nextIndex, steps, location, navigate, false);
      onStepChange?.(nextIndex, currentStepIndex);
      
      // Smooth scroll form into view after step change (with offset for better visibility)
      setTimeout(() => scrollToFormWithOffset(100), 100);
    }
  }, [
    currentStepIndex,
    steps.length,
    validateCurrentStep,
    onStepChange,
    collectCurrentStepData,
    setFormData,
    setDirection,
    setCurrentStepIndex,
    location,
    navigate,
    steps
  ]);

  const handlePrevious = useCallback(() => {
    const currentData = collectCurrentStepData();
    // Use mergeFormData to preserve both languages in nested objects
    setFormData((prev) => mergeFormData(prev, currentData));

    if (currentStepIndex > 0 && allowBackNavigation) {
      const nextIndex = currentStepIndex - 1;
      setDirection(-1);
      previousStepIndexRef.current = currentStepIndex;
      setCurrentStepIndex(nextIndex);
      updateUrlStep(nextIndex, steps, location, navigate, false);
      onStepChange?.(nextIndex, currentStepIndex);
      
      // Smooth scroll form into view after step change (with offset for better visibility)
      setTimeout(() => scrollToFormWithOffset(100), 100);
    }
  }, [
    currentStepIndex,
    allowBackNavigation,
    onStepChange,
    collectCurrentStepData,
    setFormData,
    setDirection,
    setCurrentStepIndex,
    location,
    navigate,
    steps
  ]);

  const handleStepClick = useCallback(
    (index: number) => {
      if (allowBackNavigation && index !== currentStepIndex) {
        const currentData = collectCurrentStepData();
        // Use mergeFormData to preserve both languages in nested objects
        setFormData((prev) => mergeFormData(prev, currentData));
        setDirection(index > currentStepIndex ? 1 : -1);
        previousStepIndexRef.current = currentStepIndex;
        setCurrentStepIndex(index);
        updateUrlStep(index, steps, location, navigate, false);
        onStepChange?.(index, currentStepIndex);
        
        // Smooth scroll form into view after step change (with offset for better visibility)
        setTimeout(() => scrollToFormWithOffset(100), 100);
      }
    },
    [
      allowBackNavigation,
      currentStepIndex,
      collectCurrentStepData,
      setFormData,
      setDirection,
      setCurrentStepIndex,
      location,
      navigate,
      steps,
      onStepChange
    ]
  );

  return {
    handleNext,
    handlePrevious,
    handleStepClick,
    collectCurrentStepData
  };
};

