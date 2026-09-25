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

export type StudioManageNavGroup = 'listing' | 'operations';

export interface StudioManageSectionDef {
  id: StudioManageSectionId;
  labelKey: string;
  defaultLabel: string;
  icon: ComponentType<{ className?: string; fontSize?: 'small' | 'inherit' | 'large' | 'medium' }>;
  group: StudioManageNavGroup;
}

export const STUDIO_MANAGE_SECTIONS: StudioManageSectionDef[] = [
  {
    id: 'overview',
    labelKey: 'manage.sections.overview',
    defaultLabel: 'Overview',
    icon: InfoOutlinedIcon,
    group: 'listing'
  },
  {
    id: 'media',
    labelKey: 'manage.sections.media',
    defaultLabel: 'Media',
    icon: PhotoLibraryIcon,
    group: 'listing'
  },
  {
    id: 'hours',
    labelKey: 'manage.sections.hours',
    defaultLabel: 'Hours',
    icon: ScheduleIcon,
    group: 'listing'
  },
  {
    id: 'location',
    labelKey: 'manage.sections.location',
    defaultLabel: 'Location',
    icon: LocationIcon,
    group: 'listing'
  },
  {
    id: 'amenities',
    labelKey: 'manage.sections.amenities',
    defaultLabel: 'Amenities & gear',
    icon: WeekendIcon,
    group: 'listing'
  },
  {
    id: 'policies',
    labelKey: 'manage.sections.policies',
    defaultLabel: 'Policies',
    icon: ShieldIcon,
    group: 'listing'
  },
  {
    id: 'portfolio',
    labelKey: 'manage.sections.portfolio',
    defaultLabel: 'Portfolio',
    icon: WorkIcon,
    group: 'listing'
  },
  {
    id: 'services',
    labelKey: 'manage.sections.services',
    defaultLabel: 'Services',
    icon: PackageIcon,
    group: 'operations'
  }
];

export const STUDIO_MANAGE_NAV_GROUPS: {
  id: StudioManageNavGroup;
  labelKey: string;
  defaultLabel: string;
}[] = [
  { id: 'listing', labelKey: 'manage.nav.listing', defaultLabel: 'Listing' },
  { id: 'operations', labelKey: 'manage.nav.operations', defaultLabel: 'Operations' }
];

export const DEFAULT_STUDIO_MANAGE_SECTION: StudioManageSectionId = 'overview';

export function parseStudioManageSection(value: string | null): StudioManageSectionId {
  const match = STUDIO_MANAGE_SECTIONS.find((s) => s.id === value);
  return match?.id ?? DEFAULT_STUDIO_MANAGE_SECTION;
}
