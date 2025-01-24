import { useLanguageNavigate, useMutationHandler } from '@shared/hooks';
import { createStudio, updateStudio } from '@shared/services';
import { Studio } from 'src/types/index';

type CreateStudioVariables = {
  userId: string;
  newStudio: Studio;
};

export const useCreateStudioMutation = () => {
  const langNavigate = useLanguageNavigate();

  return useMutationHandler<Studio, CreateStudioVariables>({
    mutationFn: ({ userId, newStudio }) => createStudio(userId, newStudio),
    successMessage: 'Studio created',
    invalidateQueries: [{ queryKey: 'studios' }],
    onSuccess: (data, _variables) => langNavigate(`/studio/${data._id}`)
  });
};

export const useUpdateStudioMutation = (studioId: string) => {
  const langNavigate = useLanguageNavigate();

  return useMutationHandler<Studio, Studio>({
    mutationFn: (updatedStudio) => updateStudio(studioId, updatedStudio),
    successMessage: 'Studio updated',
    invalidateQueries: [{ queryKey: 'studio', targetId: studioId }, { queryKey: 'studios' }],
    onSuccess: () => langNavigate(`/Studio/${studioId}`)
  });
};
