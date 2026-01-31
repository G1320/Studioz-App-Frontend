import { Availability } from './availability';

export interface Duration {
  value?: number;
  unit?: 'minutes' | 'hours' | 'days';
}

export interface AdvanceBookingRequired {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
}

export interface BlockDiscounts {
  eightHour?: number;
  twelveHour?: number;
}

export interface ProjectPricing {
  basePrice?: number;
  depositPercentage?: number;
  estimatedDeliveryDays?: number;
  revisionsIncluded?: number;
  revisionPrice?: number;
}

export type ServiceDeliveryType = 'in-studio' | 'remote';

export default interface Item {
  _id: string;
  studio: string;
  name: {
    en: string;
    he?: string;
  };
  description: {
    en: string;
    he?: string;
  };
  studioName: {
    en?: string;
    he?: string;
  };
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  categories: string[];
  subCategories: string[];
  genres?: string[];
  price?: number;
  pricePer?: 'hour' | 'session' | 'unit' | 'song' | 'project' | 'day';
  blockDiscounts?: BlockDiscounts;
  imageUrl?: string;
  idx?: number;
  inStock: boolean;
  studioId: string;
  studioImgUrl: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  sellerId?: string;
  paypalMerchantId?: string;
  availability?: Availability[];
  instantBook?: boolean;
  addOnIds?: string[];
  
  // Service Delivery Type
  serviceDeliveryType?: ServiceDeliveryType;
  
  // Booking Requirements (for in-studio)
  minimumBookingDuration?: Duration;
  minimumQuantity?: number;
  advanceBookingRequired?: AdvanceBookingRequired;
  
  // Setup & Preparation (for in-studio)
  preparationTime?: Duration;

  // Remote Project Settings (for remote)
  projectPricing?: ProjectPricing;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  maxFilesPerProject?: number;

  // Quantity Management
  maxQuantityPerBooking?: number;
  
  // Status
  active?: boolean;
}
