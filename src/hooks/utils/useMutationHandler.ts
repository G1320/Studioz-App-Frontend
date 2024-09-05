import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import useErrorHandling from '../errorAndSuccessHandling/useErrorHandling';
import { useInvalidateQueries } from './useInvalidateQueries';

type MutationHandlerOptions<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error) => void;
  invalidateQueries: Array<{ queryKey: string; targetId?: string }>;
  successMessage: string;
  undoAction?: (variables: TVariables, data: TData) => Promise<TData> ;
};

export const useMutationHandler = <TData, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries,
  successMessage,
  undoAction,
}: MutationHandlerOptions<TData, TVariables>) => {
  const handleError = useErrorHandling();
  const invalidate = useInvalidateQueries(() => invalidateQueries);

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      invalidate();
      toast.success(successMessage, {
        action: undoAction
          ? {
              label: 'Undo',
              onClick: () => undoAction(variables, data).then(invalidate).catch(handleError),
            }
          : undefined,
      });
      if (onSuccess) onSuccess(data, variables);
    },
    onError: (error) => {
      handleError(error);
      if (onError) onError(error);
    },
  });
};
