export interface StudioFile {
  _id: string;
  studioId: string;
  uploadedBy: string | { _id: string; name?: string };
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
  createdAt?: string;
  updatedAt?: string;
}
