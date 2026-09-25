import type { ComponentType } from 'react';
import {
  InfoOutlinedIcon,
  CategoryIcon,
  PublicIcon,
  OfferIcon,
  CalendarIcon,
  InventoryIcon
} from '@shared/components/icons';

export type ItemManageSectionId =
  | 'basics'
  | 'classification'
  | 'delivery'
  | 'pricing'
  | 'booking'
  | 'addons';

export interface ItemManageSectionDef {
  id: ItemManageSectionId;
  labelKey: string;
  defaultLabel: string;
  icon: ComponentType<{ className?: string; fontSize?: 'small' | 'inherit' | 'large' | 'medium' }>;
  /** Hide when remote delivery */
  inStudioOnly?: boolean;
  /** Feature-flag gated */
  featureFlag?: 'addOns';
}

export const ITEM_MANAGE_SECTIONS: ItemManageSectionDef[] = [
  {
    id: 'basics',
    labelKey: 'manage.item.sections.basics',
    defaultLabel: 'Basics',
    icon: InfoOutlinedIcon
  },
  {
    id: 'classification',
    labelKey: 'manage.item.sections.classification',
    defaultLabel: 'Classification',
    icon: CategoryIcon
  },
  {
    id: 'delivery',
    labelKey: 'manage.item.sections.delivery',
    defaultLabel: 'Delivery',
    icon: PublicIcon
  },
  {
    id: 'pricing',
    labelKey: 'manage.item.sections.pricing',
    defaultLabel: 'Pricing',
    icon: OfferIcon
  },
  {
    id: 'booking',
    labelKey: 'manage.item.sections.booking',
    defaultLabel: 'Booking',
    icon: CalendarIcon,
    inStudioOnly: true
  },
  {
    id: 'addons',
    labelKey: 'manage.item.sections.addons',
    defaultLabel: 'Add-ons',
    icon: InventoryIcon,
    featureFlag: 'addOns'
  }
];

export const DEFAULT_ITEM_MANAGE_SECTION: ItemManageSectionId = 'basics';

export function parseItemManageSection(value: string | null): ItemManageSectionId {
  const match = ITEM_MANAGE_SECTIONS.find((s) => s.id === value);
  return match?.id ?? DEFAULT_ITEM_MANAGE_SECTION;
}

/** Legacy stepped-form step → manage section */
export const ITEM_STEP_TO_SECTION: Record<string, ItemManageSectionId> = {
  'basic-info': 'basics',
  'service-type': 'delivery',
  categories: 'classification',
  pricing: 'pricing',
  'project-pricing': 'pricing',
  'booking-settings': 'booking',
  'add-ons': 'addons'
};
