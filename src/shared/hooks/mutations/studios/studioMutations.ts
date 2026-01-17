import { useLanguageNavigate, useMutationHandler } from '@shared/hooks';
import { createStudio, updateStudio, toggleStudioActive, toggleItemActive } from '@shared/services';
import { Studio, Item } from 'src/types/index';
import { useTranslation } from 'react-i18next';

type CreateStudioVariables = {
  userId: string;
  newStudio: Studio;
};

export const useCreateStudioMutation = () => {
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('common');

  return useMutationHandler<Studio, CreateStudioVariables>({
    mutationFn: ({ userId, newStudio }) => createStudio(userId, newStudio),
    successMessage: t('toasts.success.studioCreated'),
    invalidateQueries: [{ queryKey: 'studios' }],
    onSuccess: (data, _variables) => langNavigate(`/studio/${data._id}`)
  });
};

export const useUpdateStudioMutation = (studioId: string) => {
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('common');

  return useMutationHandler<Studio, Studio>({
    mutationFn: (updatedStudio) => updateStudio(studioId, updatedStudio),
    successMessage: t('toasts.success.studioUpdated'),
    invalidateQueries: [{ queryKey: 'studio', targetId: studioId }, { queryKey: 'studios' }],
    onSuccess: () => langNavigate(`/Studio/${studioId}`)
  });
};

type ToggleStudioActiveVariables = {
  studioId: string;
  active: boolean;
};

export const useToggleStudioActiveMutation = () => {
  const { t } = useTranslation('common');

  return useMutationHandler<Studio, ToggleStudioActiveVariables>({
    mutationFn: ({ studioId, active }) => toggleStudioActive(studioId, active),
    successMessage: t('toasts.success.studioStatusUpdated'),
    invalidateQueries: [{ queryKey: 'studios' }]
  });
};

type ToggleItemActiveVariables = {
  studioId: string;
  itemId: string;
  active: boolean;
};

export const useToggleItemActiveMutation = () => {
  const { t } = useTranslation('common');

  return useMutationHandler<Item, ToggleItemActiveVariables>({
    mutationFn: ({ studioId, itemId, active }) => toggleItemActive(studioId, itemId, active),
    successMessage: t('toasts.success.itemStatusUpdated'),
    invalidateQueries: [{ queryKey: 'studios' }, { queryKey: 'items' }]
  });
};
