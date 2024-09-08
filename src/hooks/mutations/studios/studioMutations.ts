import { useNavigate } from 'react-router-dom';
import { useMutationHandler } from '../../utils/useMutationHandler';
import * as studioService from '../../../services/studio-service';
import { Studio } from '../../../types/index';

type CreateStudioVariables = {
  userId: string;
  newStudio: Studio;
};

export const useCreateStudioMutation = () => {
  const navigate = useNavigate();

  return useMutationHandler<Studio, CreateStudioVariables>({
    mutationFn: ({ userId, newStudio }) => studioService.createStudio(userId, newStudio),
    successMessage: 'Studio created',
    invalidateQueries: [{ queryKey: 'studios' }],
    onSuccess: () =>  navigate('/'),
  });
};

export const useUpdateStudioMutation = (studioId: string) => {
  const navigate = useNavigate();

  return useMutationHandler<Studio, Studio>({
    mutationFn: (updatedStudio) => studioService.updateStudio(studioId, updatedStudio),
    successMessage: 'Studio updated',
    invalidateQueries: [
      { queryKey: 'studio', targetId: studioId },
      { queryKey: 'studios' },
    ],
    onSuccess: () => navigate(`/Studio/${studioId}`),
  });
};