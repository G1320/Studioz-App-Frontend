export default interface CartItem {
  name: {
    en: string;
    he?: string;
  };

  studioName: {
    en?: string;
    he?: string;
  };
  price: number;
  pricePer?: 'hour' | 'session' | 'unit' | 'song';
  total: number;
  itemId: string;
  quantity?: number;
  bookingDate?: string;
  startTime?: string;
  studioImgUrl?: string;
  studioId?: string;
  hours?: number;
  reservationId?: string;
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  comment?: string;
  addOnIds?: string[];
  // Payment fields (optional - only when vendor accepts payments)
  singleUseToken?: string;
  customerEmail?: string;
  useSavedCard?: boolean; // Use customer's saved card instead of new token
  sumitCustomerId?: string; // Sumit customer ID for saved card payments (incognito users)
}
