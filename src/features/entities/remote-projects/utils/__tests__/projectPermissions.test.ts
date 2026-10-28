import { describe, expect, it } from 'vitest';
import {
  PROJECT_ROLES,
  ROLE_CAPABILITIES,
  canonicalCapabilities,
  capabilitiesRequireLogin,
  roleForCapabilities
} from '../projectPermissions';

describe('frontend project permission presets', () => {
  it('maps every preset back to itself', () => {
    for (const role of PROJECT_ROLES) {
      expect(roleForCapabilities(ROLE_CAPABILITIES[role])).toBe(role);
    }
  });

  it('reports unmatched sets as custom', () => {
    expect(roleForCapabilities(['listen', 'upload'])).toBe('custom');
  });

  it('always includes listen in canonical order', () => {
    expect(canonicalCapabilities(['edit', 'comment'])).toEqual(['listen', 'comment', 'edit']);
  });

  it('listen, review and download links work without signing in', () => {
    const anonymous = PROJECT_ROLES.filter((role) => !capabilitiesRequireLogin(ROLE_CAPABILITIES[role]));
    expect(anonymous).toEqual(['listener', 'reviewer', 'listener_download']);
  });
});
