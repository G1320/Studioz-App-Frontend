/**
 * Shared config for product features (list + detail pages).
 * Image keys map to features-generated captures that are not used on Preview landing.
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

export type CaptureLocale = 'en-US' | 'he';

/** Feature id → capture basenames (resolved with locale + theme at render). */
export const FEATURE_SHOTS: Record<FeatureId, string[]> = {
  calendar: ['desktop-calendar', 'mobile-calendar'],
  insights: ['desktop-stats', 'mobile-analytics-revenue'],
  services: ['desktop-studio-manager', 'mobile-studio-services'],
  payments: ['desktop-documents', 'mobile-documents', 'desktop-billing', 'mobile-billing'],
  studio_pages: ['desktop-studio-manager', 'mobile-studio-manager'],
  availability: ['desktop-studio-manager', 'desktop-calendar', 'mobile-calendar'],
  remote: ['desktop-project-workspace', 'mobile-project-workspace']
};

export const BASE_URL = 'https://www.studioz.co.il';

export function featureCaptureUrl(
  capture: string,
  locale: CaptureLocale,
  theme: string
): string {
  return `/images/features-generated/${locale}/${theme}/${capture}.webp`;
}

export function toAbsoluteImageUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function isFeatureId(id: string): id is FeatureId {
  return FEATURE_IDS.includes(id as FeatureId);
}
