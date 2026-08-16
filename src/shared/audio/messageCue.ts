import type { ProjectMessage, MessageFileCue } from 'src/types';

export function getMessageFileId(fileId: ProjectMessage['fileId']): string | null {
  if (!fileId) return null;
  return typeof fileId === 'string' ? fileId : fileId._id;
}

export function getMessageFileCue(fileId: ProjectMessage['fileId']): MessageFileCue | null {
  if (!fileId || typeof fileId === 'string') return null;
  return fileId;
}

export function isTimedComment(msg: ProjectMessage): boolean {
  return getMessageFileId(msg.fileId) !== null && typeof msg.offsetSeconds === 'number';
}
