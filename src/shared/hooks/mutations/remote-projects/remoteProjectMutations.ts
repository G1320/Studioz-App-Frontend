import { useMutationHandler } from '@shared/hooks';
import {
  createProject,
  acceptProject,
  declineProject,
  startProject,
  deliverProject,
  requestRevision,
  completeProject,
  cancelProject,
  uploadProjectFile,
  deleteFile,
  sendMessage,
  markMessagesAsRead,
} from '@shared/services';
import {
  RemoteProject,
  ProjectFile,
  ProjectMessage,
  CreateProjectRequest,
  ProjectFileType,
} from 'src/types/index';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

// ============================================================
// PROJECT WORKFLOW MUTATIONS
// ============================================================

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<RemoteProject, CreateProjectRequest>({
    mutationFn: (data) => createProject(data),
    successMessage: t('toasts.success.projectCreated', 'Project request submitted'),
    invalidateQueries: [{ queryKey: 'remoteProjects' }],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
    },
  });
};

export const useAcceptProjectMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<RemoteProject, string>({
    mutationFn: (projectId) => acceptProject(projectId),
    successMessage: t('toasts.success.projectAccepted', 'Project accepted'),
    invalidateQueries: [{ queryKey: 'remoteProjects' }],
    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
      queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
    },
  });
};

export const useDeclineProjectMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<RemoteProject, { projectId: string; reason?: string }>({
    mutationFn: ({ projectId, reason }) => declineProject(projectId, reason),
    successMessage: t('toasts.success.projectDeclined', 'Project declined'),
    invalidateQueries: [{ queryKey: 'remoteProjects' }],
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
      queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
    },
  });
};

export const useStartProjectMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<RemoteProject, string>({
    mutationFn: (projectId) => startProject(projectId),
    successMessage: t('toasts.success.projectStarted', 'Project started'),
    invalidateQueries: [{ queryKey: 'remoteProjects' }],
    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
      queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
    },
  });
};

export const useDeliverProjectMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<RemoteProject, { projectId: string; deliveryNotes?: string }>({
    mutationFn: ({ projectId, deliveryNotes }) => deliverProject(projectId, deliveryNotes),
    successMessage: t('toasts.success.projectDelivered', 'Project delivered'),
    invalidateQueries: [{ queryKey: 'remoteProjects' }],
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
      queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
    },
  });
};

export const useRequestRevisionMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<RemoteProject, { projectId: string; feedback: string }>({
    mutationFn: ({ projectId, feedback }) => requestRevision(projectId, feedback),
    successMessage: t('toasts.success.revisionRequested', 'Revision requested'),
    invalidateQueries: [{ queryKey: 'remoteProjects' }],
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
      queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
    },
  });
};

export const useCompleteProjectMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<RemoteProject, string>({
    mutationFn: (projectId) => completeProject(projectId),
    successMessage: t('toasts.success.projectCompleted', 'Project completed'),
    invalidateQueries: [{ queryKey: 'remoteProjects' }],
    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
      queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
    },
  });
};

export const useCancelProjectMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<
    RemoteProject,
    { projectId: string; reason?: string; cancelledBy?: string }
  >({
    mutationFn: ({ projectId, reason, cancelledBy }) =>
      cancelProject(projectId, reason, cancelledBy),
    successMessage: t('toasts.success.projectCancelled', 'Project cancelled'),
    invalidateQueries: [{ queryKey: 'remoteProjects' }],
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
      queryClient.invalidateQueries({ queryKey: ['remoteProjects'] });
    },
  });
};

// ============================================================
// FILE MUTATIONS
// ============================================================

interface UploadFileMutationParams {
  projectId: string;
  file: File;
  type: ProjectFileType;
  description?: string;
  onProgress?: (progress: number) => void;
}

export const useUploadFileMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<ProjectFile, UploadFileMutationParams>({
    mutationFn: ({ projectId, file, type, description, onProgress }) =>
      uploadProjectFile(projectId, file, type, description, onProgress),
    successMessage: t('toasts.success.fileUploaded', 'File uploaded'),
    invalidateQueries: [{ queryKey: 'projectFiles' }],
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projectFiles', projectId] });
      queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
    },
  });
};

export const useDeleteFileMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  return useMutationHandler<void, { projectId: string; fileId: string }>({
    mutationFn: ({ projectId, fileId }) => deleteFile(projectId, fileId),
    successMessage: t('toasts.success.fileDeleted', 'File deleted'),
    invalidateQueries: [{ queryKey: 'projectFiles' }],
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projectFiles', projectId] });
      queryClient.invalidateQueries({ queryKey: ['remoteProject', projectId] });
    },
  });
};

// ============================================================
// MESSAGE MUTATIONS
// ============================================================

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutationHandler<
    ProjectMessage,
    { projectId: string; senderId: string; message: string; attachmentIds?: string[] }
  >({
    mutationFn: ({ projectId, senderId, message, attachmentIds }) =>
      sendMessage(projectId, senderId, message, attachmentIds),
    // No success message for messages - feels more natural
    invalidateQueries: [{ queryKey: 'projectMessages' }],
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projectMessages', projectId] });
    },
  });
};

export const useMarkMessagesReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutationHandler<
    { markedAsRead: number },
    { projectId: string; userId: string; messageIds?: string[] }
  >({
    mutationFn: ({ projectId, userId, messageIds }) =>
      markMessagesAsRead(projectId, userId, messageIds),
    invalidateQueries: [{ queryKey: 'projectMessages' }],
    onSuccess: (_data, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projectMessages', projectId] });
    },
  });
};
