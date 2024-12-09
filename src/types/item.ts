import { Availability } from './availability';

export default interface Item {
  _id: string;
  studio: string;
  name: string;
  description?: string;
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
  availability?: Availability[];
}
