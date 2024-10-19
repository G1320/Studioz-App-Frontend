export interface Payment {
  _id: string;
  userId: string;
  orderId: string;
  amount: number; // Total price paid
  status: 'pending' | 'completed' | 'failed';
  method: 'stripe' | 'paypal';
  transactionId: string; // Payment gateway transaction reference
  createdAt: Date;
}
