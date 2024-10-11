export interface Payment {
  _id: string;
  userId: string;
  bookingId: string;
  amount: number; // Total price
  status: 'pending' | 'completed' | 'failed';
  method: 'stripe' | 'paypal';
  transactionId: string; // Transaction reference from payment gateway
  createdAt: Date;
}
