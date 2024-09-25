export interface Booking {
    _id: string;
    userId: string;
    serviceId: string;
    studioId: string;
    price: number;
    date: string;
    time: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentId?: string; // Payment gateway ID (Stripe)
  }