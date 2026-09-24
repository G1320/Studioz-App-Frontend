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
  if (typeof user === 'string' || user == null) return undefined;
  const record = user as {
    picture?: string;
    avatar?: string;
    imgUrl?: string;
    toObject?: () => { picture?: string; avatar?: string; imgUrl?: string };
  };
  const plain = typeof record.toObject === 'function' ? record.toObject() : record;
  return plain.picture || plain.avatar || plain.imgUrl || undefined;
}

function initialsFromName(name: string): string {
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/** Deterministic Auth0-style chip colors for initials / email fallbacks. */
const AVATAR_TONES = [
  { bg: '#7C3AED', fg: '#FFFFFF' },
  { bg: '#2563EB', fg: '#FFFFFF' },
  { bg: '#DB2777', fg: '#FFFFFF' },
  { bg: '#059669', fg: '#FFFFFF' },
  { bg: '#D97706', fg: '#FFFFFF' },
  { bg: '#0891B2', fg: '#FFFFFF' },
  { bg: '#4F46E5', fg: '#FFFFFF' },
  { bg: '#DC2626', fg: '#FFFFFF' },
  { bg: '#0F766E', fg: '#FFFFFF' },
  { bg: '#C026D3', fg: '#FFFFFF' }
] as const;

export function collaboratorAvatarTone(seed: string): { background: string; color: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const tone = AVATAR_TONES[hash % AVATAR_TONES.length];
  return { background: tone.bg, color: tone.fg };
}

/** Avatar image → name initials → email local-part. */
export type CollaboratorFace =
  | { kind: 'image'; src: string }
  | { kind: 'initials'; text: string }
  | { kind: 'email'; text: string };

export function collaboratorFace(user: ProjectCollaborator['userId']): CollaboratorFace | null {
  const image = collaboratorAvatarUrl(user);
  if (image) return { kind: 'image', src: image };

  if (typeof user === 'string' || user == null) return null;

  // Populated user docs from the API (and occasional mongoose leftovers).
  const record = user as {
    name?: string;
    email?: string;
    _id?: string;
    toObject?: () => { name?: string; email?: string };
  };
  const plain = typeof record.toObject === 'function' ? record.toObject() : record;
  const name = plain.name?.trim();
  if (name) return { kind: 'initials', text: initialsFromName(name) };

  const email = plain.email?.trim();
  if (email) {
    const local = email.split('@')[0]?.trim() || email;
    // Keep chip text short — full address stays on the tooltip.
    if (local.length <= 2) return { kind: 'email', text: local.toUpperCase() };
    return { kind: 'initials', text: local.slice(0, 2).toUpperCase() };
  }

  return null;
}

export function collaboratorUserId(user: ProjectCollaborator['userId']): string {
  return typeof user === 'string' ? user : user._id;
}

export function activeCollaborators(collaborators?: ProjectCollaborator[]): ProjectCollaborator[] {
  return (collaborators ?? []).filter((collaborator) => {
    // Missing status means active (older documents / partial payloads).
    if (collaborator.status === 'removed') return false;
    return collaboratorFace(collaborator.userId) != null;
  });
}
