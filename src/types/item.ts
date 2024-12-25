import { Availability } from './availability';

export default interface Item {
  _id: string;
  studio: string;
  name: {
    en: string;
    he?: string;
  };
  description: {
    en: string;
    he?: string;
  };
  studioName: {
    en?: string;
    he?: string;
  };
  address?: string;
  lat?: number;
  lng?: number;
  category?: string;
  categories?: string[];
  subCategory?: string;
  subCategories?: string[];
  price?: number;
  pricePer?: 'hour' | 'session' | 'unit' | 'song';
  imageUrl?: string;
  idx?: number;
  inStock: boolean;
  studioId: string;

  studioImgUrl: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  sellerId?: string;
  paypalMerchantId?: string;
  availability?: Availability[];
}
