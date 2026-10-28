import type { ProjectCapability, ProjectRole, ProjectRoleOrCustom } from 'src/types';

/** Mirrors Backend/src/constants/projectPermissions.ts. */
export const PROJECT_CAPABILITIES: readonly ProjectCapability[] = ['listen', 'comment', 'download', 'upload', 'edit'];

export const PROJECT_ROLES: readonly ProjectRole[] = [
  'listener',
  'reviewer',
  'listener_download',
  'contributor',
  'editor'
];

export const ROLE_CAPABILITIES: Record<ProjectRole, readonly ProjectCapability[]> = {
  listener: ['listen'],
  reviewer: ['listen', 'comment'],
  listener_download: ['listen', 'download'],
  contributor: ['listen', 'comment', 'download', 'upload'],
  editor: ['listen', 'comment', 'download', 'upload', 'edit']
};

export function roleForCapabilities(capabilities: readonly ProjectCapability[]): ProjectRoleOrCustom {
  const key = [...capabilities].sort().join(',');
  return PROJECT_ROLES.find((role) => [...ROLE_CAPABILITIES[role]].sort().join(',') === key) ?? 'custom';
}

export function canonicalCapabilities(capabilities: Iterable<ProjectCapability>): ProjectCapability[] {
  const set = new Set(capabilities);
  set.add('listen');
  return PROJECT_CAPABILITIES.filter((c) => set.has(c));
}

export const ANONYMOUS_LINK_CAPABILITIES: readonly ProjectCapability[] = ['listen', 'comment', 'download'];

/** Uploading and editing require the recipient to sign in and join. */
export function capabilitiesRequireLogin(capabilities: readonly ProjectCapability[]): boolean {
  return capabilities.some((c) => !ANONYMOUS_LINK_CAPABILITIES.includes(c));
}
