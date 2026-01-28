import { httpService } from '@shared/services';
import {
  RemoteProject,
  ProjectFile,
  ProjectMessage,
  ProjectFileType,
  CreateProjectRequest,
  ProjectsResponse,
  ProjectDetailResponse,
  UploadUrlResponse,
  DownloadUrlResponse,
  MessagesResponse,
} from 'src/types';

const endpoint = '/remote-projects';

// ============================================================
// PROJECT CRUD
// ============================================================

export const createProject = async (data: CreateProjectRequest): Promise<RemoteProject> => {
  try {
    return await httpService.post(endpoint, data);
  } catch (error) {
    console.error('Error creating remote project:', error);
    throw error;
  }
};

export const getProjects = async (params: {
  customerId?: string;
  vendorId?: string;
  studioId?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ProjectsResponse> => {
  try {
    return await httpService.get(endpoint, params);
  } catch (error) {
    console.error('Error fetching remote projects:', error);
    throw error;
  }
};

export const getProjectById = async (projectId: string): Promise<ProjectDetailResponse> => {
  try {
    return await httpService.get(`${endpoint}/${projectId}`);
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
};

// ============================================================
// PROJECT WORKFLOW ACTIONS
// ============================================================

export const acceptProject = async (projectId: string): Promise<RemoteProject> => {
  try {
    return await httpService.patch(`${endpoint}/${projectId}/accept`);
  } catch (error) {
    console.error(`Error accepting project ${projectId}:`, error);
    throw error;
  }
};

export const declineProject = async (
  projectId: string,
  reason?: string
): Promise<RemoteProject> => {
  try {
    return await httpService.patch(`${endpoint}/${projectId}/decline`, { reason });
  } catch (error) {
    console.error(`Error declining project ${projectId}:`, error);
    throw error;
  }
};

export const startProject = async (projectId: string): Promise<RemoteProject> => {
  try {
    return await httpService.patch(`${endpoint}/${projectId}/start`);
  } catch (error) {
    console.error(`Error starting project ${projectId}:`, error);
    throw error;
  }
};

export const deliverProject = async (
  projectId: string,
  deliveryNotes?: string
): Promise<RemoteProject> => {
  try {
    return await httpService.patch(`${endpoint}/${projectId}/deliver`, { deliveryNotes });
  } catch (error) {
    console.error(`Error delivering project ${projectId}:`, error);
    throw error;
  }
};

export const requestRevision = async (
  projectId: string,
  feedback: string
): Promise<RemoteProject> => {
  try {
    return await httpService.patch(`${endpoint}/${projectId}/request-revision`, { feedback });
  } catch (error) {
    console.error(`Error requesting revision for project ${projectId}:`, error);
    throw error;
  }
};

export const completeProject = async (projectId: string): Promise<RemoteProject> => {
  try {
    return await httpService.patch(`${endpoint}/${projectId}/complete`);
  } catch (error) {
    console.error(`Error completing project ${projectId}:`, error);
    throw error;
  }
};

export const cancelProject = async (
  projectId: string,
  reason?: string,
  cancelledBy?: string
): Promise<RemoteProject> => {
  try {
    return await httpService.patch(`${endpoint}/${projectId}/cancel`, { reason, cancelledBy });
  } catch (error) {
    console.error(`Error cancelling project ${projectId}:`, error);
    throw error;
  }
};

// ============================================================
// FILE OPERATIONS
// ============================================================

export const getUploadUrl = async (
  projectId: string,
  data: {
    fileName: string;
    fileSize: number;
    mimeType: string;
    type: ProjectFileType;
    description?: string;
  }
): Promise<UploadUrlResponse> => {
  try {
    return await httpService.post(`${endpoint}/${projectId}/files/upload-url`, data);
  } catch (error) {
    console.error(`Error getting upload URL for project ${projectId}:`, error);
    throw error;
  }
};

export const registerFile = async (
  projectId: string,
  data: {
    fileId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    storageKey: string;
    type: ProjectFileType;
    description?: string;
    revisionNumber?: number;
  }
): Promise<ProjectFile> => {
  try {
    return await httpService.post(`${endpoint}/${projectId}/files`, data);
  } catch (error) {
    console.error(`Error registering file for project ${projectId}:`, error);
    throw error;
  }
};

export const getProjectFiles = async (
  projectId: string,
  type?: ProjectFileType
): Promise<{ files: ProjectFile[] }> => {
  try {
    const params = type ? { type } : {};
    return await httpService.get(`${endpoint}/${projectId}/files`, params);
  } catch (error) {
    console.error(`Error fetching files for project ${projectId}:`, error);
    throw error;
  }
};

export const getDownloadUrl = async (
  projectId: string,
  fileId: string
): Promise<DownloadUrlResponse> => {
  try {
    return await httpService.get(`${endpoint}/${projectId}/files/${fileId}/download`);
  } catch (error) {
    console.error(`Error getting download URL for file ${fileId}:`, error);
    throw error;
  }
};

export const deleteFile = async (projectId: string, fileId: string): Promise<void> => {
  try {
    await httpService.delete(`${endpoint}/${projectId}/files/${fileId}`);
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    throw error;
  }
};

/**
 * Upload a file to R2 storage
 * This is a two-step process:
 * 1. Get presigned upload URL from backend
 * 2. Upload file directly to R2 using the presigned URL
 * 3. Register the file in the database
 */
export const uploadProjectFile = async (
  projectId: string,
  file: File,
  type: ProjectFileType,
  description?: string,
  onProgress?: (progress: number) => void
): Promise<ProjectFile> => {
  // Step 1: Get upload URL
  const uploadUrlResponse = await getUploadUrl(projectId, {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'application/octet-stream',
    type,
    description,
  });

  // Step 2: Upload to R2 using presigned URL
  await uploadToPresignedUrl(uploadUrlResponse.uploadUrl, file, onProgress);

  // Step 3: Register file in database
  const registeredFile = await registerFile(projectId, {
    fileId: uploadUrlResponse.fileId,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'application/octet-stream',
    storageKey: uploadUrlResponse.storageKey,
    type,
    description,
  });

  return registeredFile;
};

/**
 * Upload file to presigned URL with progress tracking
 */
const uploadToPresignedUrl = (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.send(file);
  });
};

// ============================================================
// MESSAGE OPERATIONS
// ============================================================

export const getMessages = async (
  projectId: string,
  params?: { page?: number; limit?: number; since?: string }
): Promise<MessagesResponse> => {
  try {
    return await httpService.get(`${endpoint}/${projectId}/messages`, params);
  } catch (error) {
    console.error(`Error fetching messages for project ${projectId}:`, error);
    throw error;
  }
};

export const sendMessage = async (
  projectId: string,
  senderId: string,
  message: string,
  attachmentIds?: string[]
): Promise<ProjectMessage> => {
  try {
    return await httpService.post(`${endpoint}/${projectId}/messages`, {
      senderId,
      message,
      attachmentIds,
    });
  } catch (error) {
    console.error(`Error sending message for project ${projectId}:`, error);
    throw error;
  }
};

export const markMessagesAsRead = async (
  projectId: string,
  userId: string,
  messageIds?: string[]
): Promise<{ markedAsRead: number }> => {
  try {
    return await httpService.patch(`${endpoint}/${projectId}/messages/read`, {
      userId,
      messageIds,
    });
  } catch (error) {
    console.error(`Error marking messages as read for project ${projectId}:`, error);
    throw error;
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Get status display info
 */
export const getStatusInfo = (status: string): { label: string; color: string } => {
  const statusMap: Record<string, { label: string; color: string }> = {
    requested: { label: 'Pending Review', color: 'warning' },
    accepted: { label: 'Accepted', color: 'info' },
    in_progress: { label: 'In Progress', color: 'info' },
    delivered: { label: 'Delivered', color: 'success' },
    revision_requested: { label: 'Revision Requested', color: 'warning' },
    completed: { label: 'Completed', color: 'success' },
    cancelled: { label: 'Cancelled', color: 'error' },
    declined: { label: 'Declined', color: 'error' },
  };
  return statusMap[status] || { label: status, color: 'default' };
};
