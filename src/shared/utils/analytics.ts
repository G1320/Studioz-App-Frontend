/**
 * Analytics Utility for Meta Pixel (Facebook Pixel) and potentially others
 */

type FbqEventName = 
  | 'PageView' 
  | 'Purchase' 
  | 'Lead' 
  | 'CompleteRegistration' 
  | 'AddToCart' 
  | 'InitiateCheckout' 
  | 'Search' 
  | 'ViewContent'
  | 'Contact';

interface FbqParams {
  currency?: string;
  value?: number;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
  [key: string]: any;
}

/**
 * Track a standard event to Meta Pixel
 */
export const trackEvent = (eventName: FbqEventName, params?: FbqParams) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

/**
 * Track a custom event to Meta Pixel
 */
export const trackCustomEvent = (eventName: string, params?: FbqParams) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, params);
  }
};
