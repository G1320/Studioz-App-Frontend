// shared/types/studio.ts
import { Availability } from './availability';
import StudioItem from './studioItem';

type StudioLocation = {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
};

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
  availability?: Availability[];
  location: StudioLocation;
}
