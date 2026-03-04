/**
 * Subscription Tiers Configuration
 * Defines features and limits for each subscription tier
 * 
 * IMPORTANT: This is client-side configuration for UI purposes only.
 * Always verify access on the backend for security.
 */

export type SubscriptionTier = 'free' | 'starter' | 'pro';

export interface TierLimits {
  listings: number;
  paymentsPerMonth: number;
}

export interface TierConfig {
  name: string;
  features: string[];
  limits: TierLimits;
}

// Feature IDs that can be checked
export type FeatureId = 
  | 'calendar'
  | 'googleCalendar'
  | 'payments'
  | 'prioritySupport'
  | 'unlimitedListings'
  | 'analytics'
  | 'customBranding';

// Tier hierarchy for comparison (higher = more permissions)
export const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  starter: 1,
  pro: 2,
};

// Features available per tier (free tier has all - platform is free forever)
export const TIER_FEATURES: Record<SubscriptionTier, FeatureId[]> = {
  free: [
    'calendar',
    'googleCalendar',
    'payments',
    'prioritySupport',
    'unlimitedListings',
    'analytics',
    'customBranding',
  ],
  starter: [
    'calendar',
    'googleCalendar',
    'payments',
  ],
  pro: [
    'calendar',
    'googleCalendar',
    'payments',
    'prioritySupport',
    'unlimitedListings',
    'analytics',
  ],
};

// Limits per tier (free tier unlimited - platform is free forever)
export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    listings: Infinity,
    paymentsPerMonth: Infinity,
  },
  starter: {
    listings: 1,
    paymentsPerMonth: 25,
  },
  pro: {
    listings: Infinity,
    paymentsPerMonth: 200,
  },
};

// Minimum tier required for each feature (all available on free)
export const FEATURE_REQUIRED_TIER: Record<FeatureId, SubscriptionTier> = {
  calendar: 'free',
  googleCalendar: 'free',
  payments: 'free',
  prioritySupport: 'free',
  unlimitedListings: 'free',
  analytics: 'free',
  customBranding: 'free',
};

/**
 * Check if a tier has access to a feature
 */
export const tierHasFeature = (tier: SubscriptionTier, feature: FeatureId): boolean => {
  return TIER_FEATURES[tier]?.includes(feature) ?? false;
};

/**
 * Check if tier meets minimum requirement
 */
export const tierMeetsMinimum = (currentTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean => {
  return TIER_HIERARCHY[currentTier] >= TIER_HIERARCHY[requiredTier];
};

/**
 * Get the limit value for a tier
 */
export const getTierLimit = (tier: SubscriptionTier, limitKey: keyof TierLimits): number => {
  return TIER_LIMITS[tier]?.[limitKey] ?? 0;
};

/**
 * Get the minimum tier required for a feature
 */
export const getRequiredTier = (feature: FeatureId): SubscriptionTier => {
  return FEATURE_REQUIRED_TIER[feature] ?? 'pro';
};
