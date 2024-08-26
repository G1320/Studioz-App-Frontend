import { useMutation, useQueryClient } from '@tanstack/react-query';
import useErrorHandling from '../../ErrorAndSuccessHandling/useErrorHandling';
import { toast } from 'sonner';

import { createStudio, updateStudio } from '../../../services/studio-service';
import { Studio } from '../../../../../shared/types';

type CreateStudioVariables = {
  userId: string;
  newStudio: Studio;
};

export const useCreateStudioMutation = () => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  return useMutation<Studio, Error, CreateStudioVariables>({
    mutationFn: ({ userId, newStudio }) => createStudio(userId, newStudio),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['studios']});
      toast.success('Studio created');
    },
    onError: (error) => handleError(error),
  });
};

export const useUpdateStudioMutation = (studioId:string) => {
  const queryClient = useQueryClient();
  const handleError = useErrorHandling();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({queryKey:['studio', studioId]});
    queryClient.invalidateQueries({queryKey:['studios']});
  };

  return useMutation<Studio,Error,Studio>({
    mutationFn: (updatedStudio) => updateStudio(studioId, updatedStudio),
    onSuccess: (_data, _variables) => {
      invalidateQueries();
      toast.success('Studio updated');
    },
    onError: (error) => handleError(error),
  });
};
