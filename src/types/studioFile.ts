import type { StudioPortfolioRole } from '@shared/constants/studioPortfolioFileLimits';

export interface StudioFile {
  _id: string;
  studioId: string;
  uploadedBy: string | { _id: string; name?: string };
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
  role?: StudioPortfolioRole;
  coverStorageKey?: string;
  coverUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
