import { useLanguageNavigate, useMutationHandler } from '@shared/hooks';
import {
  createStudio,
  updateStudio,
  toggleStudioActive,
  toggleItemActive,
  uploadStudioPortfolioFile,
  deleteStudioFile,
  updateStudioFile
} from '@shared/services';
import { Studio, Item, StudioFile } from 'src/types/index';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

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
    onSuccess: () => langNavigate(`/studio/${studioId}`)
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

export const useUploadStudioFileMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<
    StudioFile,
    {
      studioId: string;
      file: File;
      role?: StudioFile['role'];
      onProgress?: (progress: number) => void;
    }
  >({
    mutationFn: ({ studioId, file, role, onProgress }) =>
      uploadStudioPortfolioFile(studioId, file, onProgress, role),
    successMessage: t('toasts.success.fileUploaded', 'File uploaded'),
    invalidateQueries: [{ queryKey: 'studioFiles' }],
    onSuccess: (_data, { studioId }) => {
      queryClient.invalidateQueries({ queryKey: ['studioFiles', studioId] });
    }
  });
};

export const useDeleteStudioFileMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<void, { studioId: string; fileId: string }>({
    mutationFn: ({ studioId, fileId }) => deleteStudioFile(studioId, fileId),
    successMessage: t('toasts.success.fileDeleted', 'File deleted'),
    invalidateQueries: [{ queryKey: 'studioFiles' }],
    onSuccess: (_data, { studioId }) => {
      queryClient.invalidateQueries({ queryKey: ['studioFiles', studioId] });
    }
  });
};

export const useUpdateStudioFileMutation = () => {
  const queryClient = useQueryClient();

  return useMutationHandler<
    StudioFile,
    { studioId: string; fileId: string; role?: StudioFile['role'] | '' }
  >({
    mutationFn: ({ studioId, fileId, role }) => updateStudioFile(studioId, fileId, { role }),
    invalidateQueries: [{ queryKey: 'studioFiles' }],
    onSuccess: (_data, { studioId }) => {
      queryClient.invalidateQueries({ queryKey: ['studioFiles', studioId] });
    }
  });
};
