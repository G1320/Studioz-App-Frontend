import { describe, expect, it } from 'vitest';
import type { RemoteProject } from 'src/types';
import { getProjectDisplayNames, projectMatchesSearch } from './projectListUtils';

const fallbacks = {
  item: 'Remote Service',
  studio: 'Studio',
  customer: 'Customer'
};

const project = {
  _id: 'project-1',
  title: 'Debut EP Mix',
  itemId: { _id: 'item-1', name: { en: 'Mixing', he: 'מיקס' } },
  studioId: { _id: 'studio-1', name: { en: 'North Studio', he: 'אולפן צפון' } },
  customerId: { _id: 'customer-1', name: 'Dana' }
} as RemoteProject;

describe('project list search helpers', () => {
  it('matches title and populated project names without throwing', () => {
    expect(projectMatchesSearch(project, 'debut', 'en', fallbacks)).toBe(true);
    expect(projectMatchesSearch(project, 'north', 'en', fallbacks)).toBe(true);
    expect(projectMatchesSearch(project, 'dana', 'en', fallbacks)).toBe(true);
  });

  it('uses localized names when searching', () => {
    expect(projectMatchesSearch(project, 'אולפן צפון', 'he', fallbacks)).toBe(true);
    expect(getProjectDisplayNames(project, 'he', fallbacks).item).toBe('מיקס');
  });

  it('safely falls back when populated names are missing', () => {
    const missingNames = {
      ...project,
      itemId: { _id: 'item-1' },
      studioId: { _id: 'studio-1' },
      customerId: { _id: 'customer-1' }
    } as RemoteProject;

    expect(() => projectMatchesSearch(missingNames, 'anything', 'en', fallbacks)).not.toThrow();
    expect(getProjectDisplayNames(missingNames, 'en', fallbacks)).toEqual(fallbacks);
  });

  it('treats an empty search as a match', () => {
    expect(projectMatchesSearch(project, '   ', 'en', fallbacks)).toBe(true);
  });
});
