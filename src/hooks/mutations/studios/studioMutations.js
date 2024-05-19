import { useMutation, useQueryClient } from '@tanstack/react-query';
import useErrorHandling from '../../ErrorAndSuccessHandling/useErrorHandling';
import { toast } from 'sonner';

import { createStudio, updateStudio } from '../../../services/studio-service';

export const useCreateStudioMutation = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  return useMutation({
    mutationFn: ({ userId, newStudio }) => createStudio(userId, newStudio),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['studios']);
      toast.success('Studio created');
    },
    onError: (error) => handleError(error),
  });
};

export const useUpdateStudioMutation = (studioId) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries(['studio', studioId]);
    queryClient.invalidateQueries(['studios']);
  };

  return useMutation({
    mutationFn: (newStudio) => updateStudio(studioId, newStudio),
    onSuccess: (data, variables) => {
      invalidateQueries();
      toast.success('Studio updated');
    },
    onError: (error) => handleError(error),
  });
};
