import type { ComponentType } from 'react';
import {
  InfoOutlinedIcon,
  PhotoLibraryIcon,
  ScheduleIcon,
  LocationIcon,
  WeekendIcon,
  ShieldIcon,
  WorkIcon,
  PackageIcon
} from '@shared/components/icons';

export type StudioManageSectionId =
  | 'overview'
  | 'media'
  | 'hours'
  | 'location'
  | 'amenities'
  | 'policies'
  | 'portfolio'
  | 'services';

export interface StudioManageSectionDef {
  id: StudioManageSectionId;
  labelKey: string;
  defaultLabel: string;
  icon: ComponentType<{ className?: string; fontSize?: 'small' | 'inherit' | 'large' | 'medium' }>;
  /** Implemented in hub vs legacy edit fallback */
  ready: boolean;
  /** SteppedForm step id for legacy deep-link */
  legacyStep?: string;
}

export const STUDIO_MANAGE_SECTIONS: StudioManageSectionDef[] = [
  {
    id: 'overview',
    labelKey: 'manage.sections.overview',
    defaultLabel: 'Overview',
    icon: InfoOutlinedIcon,
    ready: true
  },
  {
    id: 'media',
    labelKey: 'manage.sections.media',
    defaultLabel: 'Media',
    icon: PhotoLibraryIcon,
    ready: true,
    legacyStep: 'files'
  },
  {
    id: 'hours',
    labelKey: 'manage.sections.hours',
    defaultLabel: 'Hours',
    icon: ScheduleIcon,
    ready: true,
    legacyStep: 'availability'
  },
  {
    id: 'location',
    labelKey: 'manage.sections.location',
    defaultLabel: 'Location',
    icon: LocationIcon,
    ready: false,
    legacyStep: 'location'
  },
  {
    id: 'amenities',
    labelKey: 'manage.sections.amenities',
    defaultLabel: 'Amenities & gear',
    icon: WeekendIcon,
    ready: false,
    legacyStep: 'amenities-gear'
  },
  {
    id: 'policies',
    labelKey: 'manage.sections.policies',
    defaultLabel: 'Policies',
    icon: ShieldIcon,
    ready: false,
    legacyStep: 'policies'
  },
  {
    id: 'portfolio',
    labelKey: 'manage.sections.portfolio',
    defaultLabel: 'Portfolio',
    icon: WorkIcon,
    ready: false,
    legacyStep: 'portfolio'
  },
  {
    id: 'services',
    labelKey: 'manage.sections.services',
    defaultLabel: 'Services',
    icon: PackageIcon,
    ready: false
  }
];

export const DEFAULT_STUDIO_MANAGE_SECTION: StudioManageSectionId = 'overview';

export function parseStudioManageSection(value: string | null): StudioManageSectionId {
  const match = STUDIO_MANAGE_SECTIONS.find((s) => s.id === value);
  return match?.id ?? DEFAULT_STUDIO_MANAGE_SECTION;
}
