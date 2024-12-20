import { Availability } from './availability';

export default interface Item {
  _id: string;
  studio: string;
  name: string;
  description?: string;
  address?: string;
  lat?: number;
  lng?: number;
  category?: string;
  categories?: string[];
  subCategory?: string;
  subCategories?: string;
  price?: number;
  imageUrl?: string;
  idx?: number;
  inStock: boolean;
  studioId: string;
  studioName: string;
  studioImgUrl: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  sellerId?: string;
  availability?: Availability[];
}
