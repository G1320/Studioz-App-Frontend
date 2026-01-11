export default interface StudioItem {
  idx: number;
  itemId: string;
  _id?: string;
  studioId: string;
  name: {
    en: string;
    he: string;
  };
  address?: string;
  lat?: number;
  lng?: number;
  sellerId?: string;
  studioImgUrl?: string;
  // Additional fields for studio management
  active?: boolean;
  price?: number;
  categories?: string[];
  subCategories?: string[];
  minimumBookingDuration?: {
    value?: number;
    unit?: 'minutes' | 'hours' | 'days';
  };
}
