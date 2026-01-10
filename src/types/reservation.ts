// Payment types for reservations (optional - only when vendor accepts payments)
export type PaymentStatus = 'pending' | 'card_saved' | 'charged' | 'failed' | 'refunded';

export interface PaymentDetails {
  sumitCustomerId: string;
  sumitCreditCardToken?: string;
  lastFourDigits?: string;
  amount: number;
  currency: string;
  sumitPaymentId?: string;
  chargedAt?: Date;
  failureReason?: string;
  vendorId: string;
  refundId?: string;
  refundedAt?: Date;
}

export default interface Reservation {
  _id: string;
  itemId: string;
  itemName: {
    en: string;
    he?: string;
  };
  studioName?: {
    en?: string;
    he?: string;
  };
  studioId?: string;
  studioImgUrl?: string;
  address?: string;
  userId: string;
  bookingDate: string;
  timeSlots: string[];
  status: 'pending' | 'confirmed' | 'expired' | 'cancelled' | 'rejected' | 'payment_failed';
  expiration: Date;
  createdAt?: Date;
  updatedAt?: Date;
  itemPrice?: number;
  totalPrice?: number;
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  comment?: string;
  addOnIds?: string[];
  quantity?: number;
  // Payment fields (optional - only populated when vendor accepts payments)
  paymentStatus?: PaymentStatus;
  paymentDetails?: PaymentDetails;
}
