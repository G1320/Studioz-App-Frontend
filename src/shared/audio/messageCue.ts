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

/** Any comment bound to a track (timed or not). */
export function isTrackComment(msg: ProjectMessage): boolean {
  return getMessageFileId(msg.fileId) !== null;
}

export function isResolvedComment(msg: ProjectMessage): boolean {
  return Boolean(msg.resolvedAt);
}

export function getParentId(msg: ProjectMessage): string | null {
  return msg.parentId ? String(msg.parentId) : null;
}

/** Top-level comments for a file plus their replies, in chronological order. */
export function buildTrackThread(messages: ProjectMessage[], fileId: string) {
  const forFile = messages.filter((m) => getMessageFileId(m.fileId) === fileId);
  const byTime = (a: ProjectMessage, b: ProjectMessage) =>
    new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();

  const replies = new Map<string, ProjectMessage[]>();
  const roots: ProjectMessage[] = [];
  for (const m of forFile) {
    const parent = getParentId(m);
    if (parent) {
      const list = replies.get(parent) ?? [];
      list.push(m);
      replies.set(parent, list);
    } else {
      roots.push(m);
    }
  }
  roots.sort(byTime);
  for (const list of replies.values()) list.sort(byTime);

  // Replies whose parent isn't in this file's set (shouldn't happen) fall back to roots.
  for (const [parentId, list] of replies) {
    if (!roots.some((r) => r._id === parentId)) roots.push(...list);
  }

  return {
    roots,
    repliesFor: (id: string) => replies.get(id) ?? [],
    total: forFile.length,
    openCount: roots.filter((r) => !r.resolvedAt).length
  };
}
