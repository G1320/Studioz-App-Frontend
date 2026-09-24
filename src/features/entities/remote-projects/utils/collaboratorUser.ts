import type { ProjectCollaborator } from 'src/types';

export function collaboratorUserLabel(user: ProjectCollaborator['userId']): string {
  if (typeof user === 'string') return user;
  return user.name || user.email || user._id;
}

export function collaboratorUserTooltip(user: ProjectCollaborator['userId']): string {
  if (typeof user === 'string') return user;
  return user.name?.trim() || user.email || user._id;
}

export function collaboratorAvatarUrl(user: ProjectCollaborator['userId']): string | undefined {
  if (typeof user === 'string') return undefined;
  return user.picture || user.avatar || user.imgUrl || undefined;
}

export function collaboratorInitials(user: ProjectCollaborator['userId']): string {
  if (typeof user === 'string') return '?';
  const source = user.name?.trim() || user.email?.trim() || '';
  if (!source) return '?';
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function collaboratorUserId(user: ProjectCollaborator['userId']): string {
  return typeof user === 'string' ? user : user._id;
}

export function activeCollaborators(collaborators?: ProjectCollaborator[]): ProjectCollaborator[] {
  return (collaborators ?? []).filter((collaborator) => collaborator.status === 'active');
}
