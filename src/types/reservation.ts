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
  userId: string;
  bookingDate: string;
  timeSlots: string[];
  status: 'pending' | 'confirmed' | 'expired';
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
}
