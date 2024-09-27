// export type CartItem = string;


export interface CartItem {
    itemId: string;
    quantity?: number;
    bookingDate?: Date| string; 
  }