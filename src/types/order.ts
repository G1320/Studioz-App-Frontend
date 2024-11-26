import { Booking } from './booking';

export interface Order {
  _id: string;
  userId: string;
  jobId: string; // Link back to the Job
  bookings: Booking[];
  totalAmount: number; // Sum of all bookings' total prices
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string; // Stripe or PayPal payment reference
  createdAt: Date;
  updatedAt?: Date;
}
