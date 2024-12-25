import StudioItem from './studioItem';

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface StudioAvailability {
  days: DayOfWeek[];
  times: { start: string; end: string }[];
}

export default interface Studio {
  _id: string;
  nameEn: string;
  nameHe: string;
  subtitleEn?: string;
  subtitleHe?: string;
  descriptionEn?: string;
  descriptionHe?: string;
  category?: string;
  categories?: string[];
  subCategory?: string;
  subCategories?: string[];
  maxOccupancy?: number;
  isSmokingAllowed?: boolean;
  city: string;
  address?: string;
  lat?: number;
  lng?: number;
  isWheelchairAccessible?: boolean;
  coverImage?: string;
  galleryImages?: string[];
  galleryAudioFiles?: string[];
  coverAudioFile?: string;
  isSelfService?: boolean;
  createdAt: Date;
  createdBy: string;
  isFeatured?: boolean;
  items: StudioItem[];
  paypalMerchantId?: string;
  studioAvailability?: StudioAvailability;
}
