import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { LockIcon, StarIcon } from '@shared/components/icons';
import type { FeatureId, SubscriptionTier } from '@core/config/subscriptionTiers';
import './styles/upgrade-prompt.scss';

interface UpgradePromptProps {
  /** Feature that requires upgrade */
  feature?: FeatureId;
  /** Required tier for access */
  requiredTier: SubscriptionTier;
  /** Current user's tier */
  currentTier: SubscriptionTier;
  /** Visual variant */
  variant?: 'inline' | 'card' | 'page' | 'banner';
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** Hide the upgrade button */
  hideButton?: boolean;
  /** Custom button text */
  buttonText?: string;
  /** Callback when upgrade button clicked */
  onUpgradeClick?: () => void;
}

/**
 * Prompt component to encourage users to upgrade their subscription
 * 
 * @example
 * ```tsx
 * // Inline prompt (small, fits in content)
 * <UpgradePrompt feature="analytics" requiredTier="pro" currentTier="free" variant="inline" />
 * 
 * // Card prompt (medium, standalone card)
 * <UpgradePrompt feature="googleCalendar" requiredTier="starter" currentTier="free" variant="card" />
 * 
 * // Page prompt (full page takeover)
 * <UpgradePrompt requiredTier="pro" currentTier="starter" variant="page" />
 * 
 * // Banner prompt (horizontal banner)
 * <UpgradePrompt feature="payments" requiredTier="starter" currentTier="free" variant="banner" />
 * ```
 */
export const UpgradePrompt = ({
  feature,
  requiredTier,
  currentTier,
  variant = 'card',
  title,
  description,
  hideButton = false,
  buttonText,
  onUpgradeClick,
}: UpgradePromptProps) => {
  const { t } = useTranslation('subscriptions');
  const langNavigate = useLanguageNavigate();

  const tierNames: Record<SubscriptionTier, string> = {
    free: t('plans.free.name', 'Free'),
    starter: t('plans.starter.name', 'Starter'),
    pro: t('plans.pro.name', 'Professional'),
  };

  const featureNames: Record<FeatureId, string> = {
    calendar: t('upgrade.features.calendar', 'Digital Calendar'),
    googleCalendar: t('upgrade.features.googleCalendar', 'Google Calendar Sync'),
    payments: t('upgrade.features.payments', 'Payment Processing'),
    prioritySupport: t('upgrade.features.prioritySupport', 'Priority Support'),
    unlimitedListings: t('upgrade.features.unlimitedListings', 'Unlimited Listings'),
    analytics: t('upgrade.features.analytics', 'Analytics Dashboard'),
    customBranding: t('upgrade.features.customBranding', 'Custom Branding'),
  };

  const displayTitle = title || (feature 
    ? t('upgrade.featureTitle', { feature: featureNames[feature] })
    : t('upgrade.tierTitle', { tier: tierNames[requiredTier] })
  );

  const displayDescription = description || (feature
    ? t('upgrade.featureDescription', { feature: featureNames[feature], tier: tierNames[requiredTier] })
    : t('upgrade.tierDescription', { tier: tierNames[requiredTier] })
  );

  const handleUpgradeClick = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      langNavigate('/subscription');
    }
  };

  return (
    <div className={`upgrade-prompt upgrade-prompt--${variant}`}>
      <div className="upgrade-prompt__icon">
        {variant === 'page' ? (
          <StarIcon className="upgrade-prompt__star-icon" />
        ) : (
          <LockIcon className="upgrade-prompt__lock-icon" />
        )}
      </div>

      <div className="upgrade-prompt__content">
        <h3 className="upgrade-prompt__title">{displayTitle}</h3>
        <p className="upgrade-prompt__description">{displayDescription}</p>
        
        {variant === 'page' && (
          <div className="upgrade-prompt__current-tier">
            {t('upgrade.currentTier', { tier: tierNames[currentTier] })}
          </div>
        )}
      </div>

      {!hideButton && (
        <button 
          className="upgrade-prompt__button"
          onClick={handleUpgradeClick}
        >
          {buttonText || t('upgrade.button', 'Upgrade Now')}
        </button>
      )}
    </div>
  );
};

export default UpgradePrompt;
