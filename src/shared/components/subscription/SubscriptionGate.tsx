import { ReactNode } from 'react';
import { useFeatureAccess } from '@shared/hooks/subscriptions/useFeatureAccess';
import type { FeatureId, SubscriptionTier } from '@core/config/subscriptionTiers';

interface SubscriptionGateProps {
  /** Feature ID to check access for */
  feature?: FeatureId;
  /** Minimum tier required (alternative to feature) */
  requiredTier?: SubscriptionTier;
  /** Content to show when access is granted */
  children: ReactNode;
  /** Content to show when access is denied (default: null) */
  fallback?: ReactNode;
  /** Content to show while loading (default: null) */
  loader?: ReactNode;
  /** If true, renders children but disabled/locked state */
  showLocked?: boolean;
  /** Render prop for more control over locked state */
  renderLocked?: (props: { tier: SubscriptionTier; requiredTier: SubscriptionTier }) => ReactNode;
}

/**
 * Gate component that conditionally renders content based on subscription tier
 * 
 * @example
 * ```tsx
 * // Gate by feature
 * <SubscriptionGate feature="googleCalendar" fallback={<UpgradePrompt feature="googleCalendar" />}>
 *   <GoogleCalendarSync />
 * </SubscriptionGate>
 * 
 * // Gate by tier
 * <SubscriptionGate requiredTier="pro" fallback={<UpgradeCard />}>
 *   <ProFeatures />
 * </SubscriptionGate>
 * 
 * // With loading state
 * <SubscriptionGate feature="analytics" loader={<Skeleton />}>
 *   <AnalyticsDashboard />
 * </SubscriptionGate>
 * ```
 */
export const SubscriptionGate = ({
  feature,
  requiredTier,
  children,
  fallback = null,
  loader = null,
  showLocked = false,
  renderLocked,
}: SubscriptionGateProps) => {
  const { isLoading, hasFeature, hasTier, tier, getRequiredTierFor } = useFeatureAccess();

  // Show loader while checking subscription
  if (isLoading) {
    return <>{loader}</>;
  }

  // Determine if access is granted
  let hasAccess = false;
  let effectiveRequiredTier: SubscriptionTier = 'free';

  if (feature) {
    hasAccess = hasFeature(feature);
    effectiveRequiredTier = getRequiredTierFor(feature);
  } else if (requiredTier) {
    hasAccess = hasTier(requiredTier);
    effectiveRequiredTier = requiredTier;
  }

  // Access granted - render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // Custom locked render
  if (renderLocked) {
    return <>{renderLocked({ tier, requiredTier: effectiveRequiredTier })}</>;
  }

  // Show locked version of children
  if (showLocked) {
    return (
      <div className="subscription-gate--locked" style={{ opacity: 0.5, pointerEvents: 'none' }}>
        {children}
      </div>
    );
  }

  // Access denied - render fallback
  return <>{fallback}</>;
};

export default SubscriptionGate;
