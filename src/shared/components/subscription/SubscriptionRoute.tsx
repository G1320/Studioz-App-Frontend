import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '@core/contexts';
import { useFeatureAccess } from '@shared/hooks/subscriptions/useFeatureAccess';
import type { FeatureId, SubscriptionTier } from '@core/config/subscriptionTiers';
import { UpgradePrompt } from './UpgradePrompt';

interface SubscriptionRouteProps {
  /** Content to render when access is granted */
  children: ReactNode;
  /** Feature ID required to access this route */
  feature?: FeatureId;
  /** Minimum tier required (alternative to feature) */
  requiredTier?: SubscriptionTier;
  /** Where to redirect if not logged in (default: /login) */
  loginRedirect?: string;
  /** Custom fallback component instead of UpgradePrompt */
  fallback?: ReactNode;
  /** If true, redirects to subscription page instead of showing upgrade prompt */
  redirectToSubscription?: boolean;
}

/**
 * Route protection component that checks subscription tier
 * 
 * @example
 * ```tsx
 * // In route definition
 * <Route
 *   path="/analytics"
 *   element={
 *     <SubscriptionRoute feature="analytics">
 *       <AnalyticsPage />
 *     </SubscriptionRoute>
 *   }
 * />
 * 
 * // With minimum tier
 * <Route
 *   path="/pro-dashboard"
 *   element={
 *     <SubscriptionRoute requiredTier="pro">
 *       <ProDashboard />
 *     </SubscriptionRoute>
 *   }
 * />
 * 
 * // With redirect instead of prompt
 * <Route
 *   path="/enterprise-tools"
 *   element={
 *     <SubscriptionRoute requiredTier="pro" redirectToSubscription>
 *       <EnterpriseTools />
 *     </SubscriptionRoute>
 *   }
 * />
 * ```
 */
export const SubscriptionRoute = ({
  children,
  feature,
  requiredTier,
  loginRedirect = '/login',
  fallback,
  redirectToSubscription = false,
}: SubscriptionRouteProps) => {
  const { user } = useUserContext();
  const { i18n } = useTranslation();
  const location = useLocation();
  const { isLoading, hasFeature, hasTier, tier, getRequiredTierFor } = useFeatureAccess();

  const langPrefix = i18n.language === 'he' ? '/he' : '/en';

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to={`${langPrefix}${loginRedirect}`} state={{ from: location }} replace />;
  }

  // Still loading subscription data - show nothing or a loader
  if (isLoading) {
    return (
      <div className="subscription-route-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  // Check access
  let hasAccess = false;
  let effectiveRequiredTier: SubscriptionTier = 'free';

  if (feature) {
    hasAccess = hasFeature(feature);
    effectiveRequiredTier = getRequiredTierFor(feature);
  } else if (requiredTier) {
    hasAccess = hasTier(requiredTier);
    effectiveRequiredTier = requiredTier;
  }

  // Access granted
  if (hasAccess) {
    return <>{children}</>;
  }

  // Redirect to subscription page
  if (redirectToSubscription) {
    return <Navigate to={`${langPrefix}/subscription`} state={{ from: location, requiredTier: effectiveRequiredTier }} replace />;
  }

  // Show custom fallback or default upgrade prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <UpgradePrompt
      feature={feature}
      requiredTier={effectiveRequiredTier}
      currentTier={tier}
      variant="page"
    />
  );
};

export default SubscriptionRoute;
