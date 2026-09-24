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

function initialsFromName(name: string): string {
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/** Avatar image → name initials → email local-part. */
export type CollaboratorFace =
  | { kind: 'image'; src: string }
  | { kind: 'initials'; text: string }
  | { kind: 'email'; text: string };

export function collaboratorFace(user: ProjectCollaborator['userId']): CollaboratorFace | null {
  const image = collaboratorAvatarUrl(user);
  if (image) return { kind: 'image', src: image };

  if (typeof user === 'string') return null;

  const name = user.name?.trim();
  if (name) return { kind: 'initials', text: initialsFromName(name) };

  const email = user.email?.trim();
  if (email) {
    const local = email.split('@')[0]?.trim() || email;
    return { kind: 'email', text: local };
  }

  return null;
}

export function collaboratorUserId(user: ProjectCollaborator['userId']): string {
  return typeof user === 'string' ? user : user._id;
}

export function activeCollaborators(collaborators?: ProjectCollaborator[]): ProjectCollaborator[] {
  return (collaborators ?? []).filter((collaborator) => {
    if (collaborator.status !== 'active') return false;
    return collaboratorFace(collaborator.userId) != null;
  });
}
