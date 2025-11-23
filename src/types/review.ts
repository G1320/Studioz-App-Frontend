import { User } from './index';

export default interface Review {
  _id: string;
  studioId: string;
  userId: string;
  user?: User;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt?: Date;
}
