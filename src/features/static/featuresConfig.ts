/**
 * Shared config for product features (list + detail pages).
 * Single source of truth for feature IDs and image assets.
 */

export const FEATURE_IDS = [
  'calendar',
  'insights',
  'services',
  'payments',
  'studio_pages',
  'availability',
  'remote'
] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];

/** Feature id → image URLs (relative or absolute). Same for all locales. */
export const FEATURE_IMAGES: Record<FeatureId, string[]> = {
  calendar: ['/images/optimized/Studioz-Dashboard-Calendar.webp'],
  insights: [
    'https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/3a367b33-67cb-40f8-95ff-6e999870beae/1769012593593-19b82447/Studioz-stats.PNG'
  ],
  services: ['/images/optimized/Studioz-Studio-Details-Order-1-Light.webp'],
  payments: [
    'https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/3a367b33-67cb-40f8-95ff-6e999870beae/1769012592283-95784a84/Studioz-Service-Detail-PaymentStep-Saved-Cards.PNG'
  ],
  studio_pages: [
    '/images/optimized/Studioz-Studio-Details-1-Dark-315w.webp',
    '/images/optimized/Studioz-Studio-Details-1-Light-315w.webp'
  ],
  availability: ['/images/optimized/Studio-Availability-Controls-desktop-1-V3-634w.webp'],
  remote: ['/images/optimized/Studioz-Dashboard-Calendar.webp']
};

export const BASE_URL = 'https://www.studioz.co.il';

export function toAbsoluteImageUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function isFeatureId(id: string): id is FeatureId {
  return FEATURE_IDS.includes(id as FeatureId);
}
