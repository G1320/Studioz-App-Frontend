/**
 * Utility functions for handling URL state in SteppedForm
 */

/**
 * Get step index from URL search params
 */
export const getStepFromUrl = (
  searchParams: URLSearchParams,
  steps: Array<{ id: string }>
): number => {
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
};

/**
 * Update URL with current step
 */
export const updateUrlStep = (
  stepIndex: number,
  steps: Array<{ id: string }>,
  location: { pathname: string; search: string },
  navigate: (url: string, options?: { replace?: boolean }) => void,
  replace: boolean = false
): void => {
  const stepId = steps[stepIndex]?.id || stepIndex.toString();
  const newSearchParams = new URLSearchParams(location.search);
  newSearchParams.set('step', stepId);

  const searchString = newSearchParams.toString();
  const newUrl = `${location.pathname}${searchString ? `?${searchString}` : ''}`;

  navigate(newUrl, { replace });
};

