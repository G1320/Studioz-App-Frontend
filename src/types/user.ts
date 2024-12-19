import Cart from './cart';
import { PaymentMethod } from './paymentMethod';

export type PayPalOnboardingStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export default interface User {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  name: string;
  avatar?: string;
  password?: string;
  picture?: string;
  sub: string;
  isAdmin?: boolean;
  updatedAt?: Date;
  email?: string;
  studios?: string[];
  wishlists?: string[];
  cart?: Cart;
  booking?: PaymentMethod[];
  paypalMerchantId?: string;
  paypalOnboardingStatus?: PayPalOnboardingStatus;
  __v?: number;
}
