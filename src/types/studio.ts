import StudioItem from './studioItem';

type StudioLocation = {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
};
export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface StudioAvailability {
  days: DayOfWeek[];
  times: { start: string; end: string }[];
}

export default interface Studio {
  _id: string;
  name: string;
  description: string;
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
  studioAvailability?: StudioAvailability;

  location: StudioLocation;
}
