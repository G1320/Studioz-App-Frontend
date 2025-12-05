import { getLocalUser } from '@shared/services';
import { useMutationHandler } from '@shared/hooks';
import { updateUser } from '@shared/services/user-service';
import { User } from 'src/types/index';

export const useUpdateUserMutation = () => {
  const userId = getLocalUser()?._id;

  return useMutationHandler<User, Partial<User>>({
    mutationFn: (userData: Partial<User>) => {
      if (!userId) throw new Error('User ID is required');
      return updateUser(userId, userData);
    },
    successMessage: 'Profile updated successfully',
    invalidateQueries: [{ queryKey: 'user', targetId: userId }]
  });
};
