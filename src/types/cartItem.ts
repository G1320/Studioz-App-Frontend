export interface CartItem {
    name?: string;
    itemId: string;
    quantity?: number;
    bookingDate?: Date| string; 
    studioName?: string;
    studioId?: string;
  }