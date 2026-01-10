import { Cart, Wishlist } from './index';
import Reservation from './reservation';

export type PayPalOnboardingStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface PayPalOAuthIntegration {
  status: string;
  integration_type: string;
}

export interface PayPalAccountStatus {
  payments_receivable?: boolean;
  primary_email_confirmed?: boolean;
  oauth_integrations?: PayPalOAuthIntegration[];
}

export interface GoogleCalendarIntegration {
  connected: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  calendarId?: string;
  lastSyncAt?: Date;
  syncToken?: string;
}

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
  phone?: string;
  email_verified?: boolean;
  studios?: string[];
  wishlists?: Wishlist[];
  reservations?: Reservation[];
  cart?: Cart;
  paypalMerchantId?: string;
  paypalOnboardingStatus?: PayPalOnboardingStatus;
  paypalAccountStatus?: PayPalAccountStatus;
  subscriptionStatus?: string;
  subscriptionId?: string;
  sumitCompanyId?: number;
  sumitApiKey?: string;
  sumitApiPublicKey?: string;
  // Customer's saved card info (for paying, not receiving)
  sumitCustomerId?: string;
  savedCardLastFour?: string;
  savedCardBrand?: string;
  role?: 'user' | 'vendor' | 'admin';
  googleCalendar?: GoogleCalendarIntegration;

  __v?: number;
}
