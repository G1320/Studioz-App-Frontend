
import { useMutationHandler } from '../../utils/useMutationHandler';
import { createStudio, updateStudio } from '../../../services/studio-service';
import { Studio } from '../../../../../shared/types';
import { useNavigate } from 'react-router-dom';

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
    onSuccess: () =>  navigate('/'),
  });
};

export const useUpdateStudioMutation = (studioId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Studio, Studio>({
    mutationFn: (updatedStudio) => updateStudio(studioId, updatedStudio),
    successMessage: 'Studio updated',
    invalidateQueries: [
      { queryKey: 'studio', targetId: studioId },
      { queryKey: 'studios' },
    ],
    onSuccess: () => navigate(`/Studio/${studioId}`),
  });
};