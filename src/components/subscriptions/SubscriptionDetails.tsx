import { useSubscription } from '@hooks/index';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cancelSubscription } from '@services/subscription-service';
import { useUserContext } from '@contexts/UserContext';
import type { CancelSubscriptionResponse } from 'src/types/subscription';
import { useTranslation } from 'react-i18next';

export const SubscriptionDetails = () => {
  const { isLoading, hasSubscription, isPro, subscription, paypalDetails } = useSubscription();
  const { updateSubscription } = useUserContext();
  const { t } = useTranslation('subscriptions');

  const handleCancelSubscription = async () => {
    if (!subscription?._id) return;

    try {
      if (window.confirm(t('subscriptionDetails.cancellation.confirmMessage'))) {
        const cancelledSubscription = (await cancelSubscription(subscription._id)) as CancelSubscriptionResponse;

        if (cancelledSubscription) {
          updateSubscription(cancelledSubscription._id, 'CANCELLED');
        }

        toast.success(t('subscriptionDetails.cancellation.successMessage'));
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error(t('subscriptionDetails.cancellation.errorMessage'));
    }
  };

  if (isLoading) {
    return <div className="subscription-loading">{t('subscriptionDetails.loading')}</div>;
  }

  if (!hasSubscription) {
    return (
      <div className="subscription-details no-subscription">
        <h3>{t('subscriptionDetails.noSubscription.title')}</h3>
        <p>{t('subscriptionDetails.noSubscription.description')}</p>
        <Link to="/subscription" className="primary-button">
          {t('subscriptionDetails.noSubscription.viewPlans')}
        </Link>
      </div>
    );
  }

  return (
    <div className="subscription-details">
      <div className="subscription-header">
        <div className="title-status">
          <h3>{t(isPro ? 'subscriptionDetails.planNames.pro' : 'subscriptionDetails.planNames.starter')}</h3>
          <p className="status">
            {subscription?.status === 'ACTIVE'
              ? t('subscriptionDetails.status.active')
              : t('subscriptionDetails.status.cancelled')}
          </p>
        </div>
        <span className={`plan-badge ${isPro ? 'pro' : 'starter'}`}>
          {t(isPro ? 'subscriptionDetails.badges.pro' : 'subscriptionDetails.badges.starter')}
        </span>
      </div>

      <div className="subscription-info">
        {subscription?.startDate && (
          <div className="info-item">
            <p className="label">{t('subscriptionDetails.info.startDate.label')}</p>
            <p className="value">{new Date(subscription.startDate).toLocaleDateString()}</p>
          </div>
        )}

        {paypalDetails?.billing_info?.next_billing_time && (
          <div className="info-item">
            <p className="label">{t('subscriptionDetails.info.nextBilling.label')}</p>
            <p className="value">{new Date(paypalDetails.billing_info.next_billing_time).toLocaleDateString()}</p>
          </div>
        )}

        <div className="info-item">
          <p className="label">{t('subscriptionDetails.info.price.label')}</p>
          <p className="value">{t('subscriptionDetails.info.price.value', { amount: isPro ? '150' : '75' })}</p>
        </div>
      </div>

      <div className="subscription-actions">
        {subscription?.status === 'ACTIVE' && (
          <>
            <Link to="/subscription" className="manage-link">
              {t(isPro ? 'subscriptionDetails.actions.managePlan' : 'subscriptionDetails.actions.upgradePlan')}
            </Link>
            <button onClick={handleCancelSubscription} className="cancel-button">
              {t('subscriptionDetails.actions.cancelPlan')}
            </button>
          </>
        )}
      </div>

      {subscription?.status === 'CANCELLED' && (
        <div className="cancelled-notice">
          <p>{t('subscriptionDetails.cancellation.notice')}</p>
          {subscription.endDate && (
            <p className="access-until">
              {t('subscriptionDetails.cancellation.accessUntil', {
                date: new Date(subscription.endDate).toLocaleDateString()
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
