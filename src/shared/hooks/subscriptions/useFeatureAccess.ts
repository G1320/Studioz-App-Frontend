import { useMemo, useCallback } from 'react';
import { useSubscription } from './useSubscription';
import {
  type SubscriptionTier,
  type FeatureId,
  type TierLimits,
  tierHasFeature,
  tierMeetsMinimum,
  getTierLimit,
  getRequiredTier,
  TIER_HIERARCHY,
} from '@core/config/subscriptionTiers';

export interface FeatureAccessResult {
  /** Current subscription tier (defaults to 'free' if no subscription) */
  tier: SubscriptionTier;
  /** Whether user has an active subscription */
  hasSubscription: boolean;
  /** Whether user is on a trial subscription */
  isTrial: boolean;
  /** Whether subscription data is still loading */
  isLoading: boolean;
  /** Check if user has access to a specific feature */
  hasFeature: (feature: FeatureId) => boolean;
  /** Check if user's tier meets minimum requirement */
  hasTier: (requiredTier: SubscriptionTier) => boolean;
  /** Get the limit for a specific resource */
  getLimit: (limitKey: keyof TierLimits) => number;
  /** Check if user can perform an action within limits */
  withinLimit: (limitKey: keyof TierLimits, currentUsage: number) => boolean;
  /** Get the minimum tier required for a feature */
  getRequiredTierFor: (feature: FeatureId) => SubscriptionTier;
  /** Check if an upgrade would unlock a feature */
  wouldUpgradeUnlock: (feature: FeatureId) => boolean;
}

/**
 * Hook for checking feature access based on subscription tier
 * 
 * @example
 * ```tsx
 * const { hasFeature, hasTier, getLimit, tier } = useFeatureAccess();
 * 
 * // Check specific feature
 * if (hasFeature('googleCalendar')) {
 *   // Show Google Calendar sync
 * }
 * 
 * // Check minimum tier
 * if (hasTier('pro')) {
 *   // Show pro-only content
 * }
 * 
 * // Check limits
 * const maxListings = getLimit('listings');
 * if (withinLimit('listings', currentListingCount)) {
 *   // Allow creating new listing
 * }
 * ```
 */
export const useFeatureAccess = (): FeatureAccessResult => {
  const { isLoading, hasSubscription, isPro, isStarter, isTrial, subscription } = useSubscription();

  // Determine current tier
  const tier = useMemo((): SubscriptionTier => {
    if (!hasSubscription) return 'free';
    if (isPro) return 'pro';
    if (isStarter) return 'starter';
    // Fallback to planId from subscription
    return (subscription?.planId as SubscriptionTier) || 'free';
  }, [hasSubscription, isPro, isStarter, subscription?.planId]);

  // Check if user has access to a feature
  const hasFeature = useCallback(
    (feature: FeatureId): boolean => {
      if (isLoading) return false;
      return tierHasFeature(tier, feature);
    },
    [tier, isLoading]
  );

  // Check if user's tier meets minimum requirement
  const hasTier = useCallback(
    (requiredTier: SubscriptionTier): boolean => {
      if (isLoading) return false;
      return tierMeetsMinimum(tier, requiredTier);
    },
    [tier, isLoading]
  );

  // Get limit for a resource
  const getLimit = useCallback(
    (limitKey: keyof TierLimits): number => {
      return getTierLimit(tier, limitKey);
    },
    [tier]
  );

  // Check if within limit
  const withinLimit = useCallback(
    (limitKey: keyof TierLimits, currentUsage: number): boolean => {
      const limit = getTierLimit(tier, limitKey);
      return currentUsage < limit;
    },
    [tier]
  );

  // Get required tier for a feature
  const getRequiredTierFor = useCallback((feature: FeatureId): SubscriptionTier => {
    return getRequiredTier(feature);
  }, []);

  // Check if upgrading would unlock a feature
  const wouldUpgradeUnlock = useCallback(
    (feature: FeatureId): boolean => {
      const requiredTier = getRequiredTier(feature);
      // Feature is already accessible
      if (tierHasFeature(tier, feature)) return false;
      // Check if any higher tier has this feature
      return TIER_HIERARCHY[requiredTier] > TIER_HIERARCHY[tier];
    },
    [tier]
  );

  return {
    tier,
    hasSubscription,
    isTrial,
    isLoading,
    hasFeature,
    hasTier,
    getLimit,
    withinLimit,
    getRequiredTierFor,
    wouldUpgradeUnlock,
  };
};
