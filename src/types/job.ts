import { Order } from './order';

export interface Job {
  _id: string;
  userId: string;
  orders: Order[]; // Each job can have multiple orders
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt?: Date;
  notes?: string; // Optional notes for the job
}
