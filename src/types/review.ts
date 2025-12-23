import { User } from './index';

export interface Translation {
  en?: string;
  he?: string;
}

export default interface Review {
  _id: string;
  studioId: string;
  userId: string;
  user?: User;
  rating: number; // 1-5
  name?: Translation;
  comment?: Translation;
  createdAt: Date;
  updatedAt?: Date;
}
