import { useNavigate } from 'react-router-dom';
import { useMutationHandler } from '@hooks/utils/index';
import { createStudio, updateStudio } from '@services/index';
import { Studio } from 'src/types/index';

type CreateStudioVariables = {
  userId: string;
  newStudio: Studio;
};

export const useCreateStudioMutation = () => {
  const navigate = useNavigate();

  return useMutationHandler<Studio, CreateStudioVariables>({
    mutationFn: ({ userId, newStudio }) => createStudio(userId, newStudio),
    successMessage: 'Studio created',
    invalidateQueries: [{ queryKey: 'studios' }],
    onSuccess: (data, _variables) => navigate(`/studio/${data._id}`)
  });
};

export const useUpdateStudioMutation = (studioId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Studio, Studio>({
    mutationFn: (updatedStudio) => updateStudio(studioId, updatedStudio),
    successMessage: 'Studio updated',
    invalidateQueries: [{ queryKey: 'studio', targetId: studioId }, { queryKey: 'studios' }],
    onSuccess: () => navigate(`/Studio/${studioId}`)
  });
};
