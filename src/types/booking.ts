export interface Booking {
  _id: string;
  orderId: string; // Link back to the Order
  userId: string;
  itemId: string; // The specific service or item booked
  studioId: string;
  price: number;
  date: string;
  time: string;
  status: 'booked' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string; // Stripe payment reference if applicable
}
