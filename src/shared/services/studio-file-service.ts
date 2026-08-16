import { httpService } from '@shared/services';
import {
  StudioFile,
  UploadUrlResponse,
  DownloadUrlResponse,
  AudioMetaResponse
} from 'src/types';

const endpoint = '/studios';

export const getStudioFileUploadUrl = async (
  studioId: string,
  data: { fileName: string; fileSize: number; mimeType: string }
): Promise<UploadUrlResponse> => {
  return httpService.post(`${endpoint}/${studioId}/files/upload-url`, data);
};

export const registerStudioFile = async (
  studioId: string,
  data: {
    fileId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    storageKey: string;
    role?: StudioFile['role'];
  }
): Promise<StudioFile> => {
  return httpService.post(`${endpoint}/${studioId}/files`, data);
};

export const getStudioFiles = async (studioId: string): Promise<{ files: StudioFile[] }> => {
  return httpService.get(`${endpoint}/${studioId}/files`);
};

export const getStudioFileDownloadUrl = async (
  studioId: string,
  fileId: string
): Promise<DownloadUrlResponse> => {
  return httpService.get(`${endpoint}/${studioId}/files/${fileId}/download`);
};

export const getStudioFileAudioMeta = async (
  studioId: string,
  fileId: string
): Promise<AudioMetaResponse> => {
  return httpService.get(`${endpoint}/${studioId}/files/${fileId}/audio-meta`);
};

export const deleteStudioFile = async (studioId: string, fileId: string): Promise<void> => {
  await httpService.delete(`${endpoint}/${studioId}/files/${fileId}`);
};

export const updateStudioFile = async (
  studioId: string,
  fileId: string,
  data: { role?: StudioFile['role'] | '' }
): Promise<StudioFile> => {
  return httpService.patch(`${endpoint}/${studioId}/files/${fileId}`, data);
};

const uploadToR2 = (url: string, file: File, onProgress?: (progress: number) => void): Promise<void> => {
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
    xhr.send(file);
  });
};

export const uploadStudioPortfolioFile = async (
  studioId: string,
  file: File,
  onProgress?: (progress: number) => void,
  role?: StudioFile['role']
): Promise<StudioFile> => {
  const uploadUrlResponse = await getStudioFileUploadUrl(studioId, {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'application/octet-stream'
  });

  await uploadToR2(uploadUrlResponse.uploadUrl, file, onProgress);

  return registerStudioFile(studioId, {
    fileId: uploadUrlResponse.fileId,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'application/octet-stream',
    storageKey: uploadUrlResponse.storageKey,
    role
  });
};
