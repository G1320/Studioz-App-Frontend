import { useSubscription, useCancelSubscriptionMutation } from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';

export const SubscriptionDetails = () => {
  const { isLoading, hasSubscription, subscription } = useSubscription();
  const { user, updateSubscription } = useUserContext();
  const { t } = useTranslation(['subscriptions', 'profile']);
  const langNavigate = useLanguageNavigate();
  const cancelSubscriptionMutation = useCancelSubscriptionMutation(subscription?._id || '');

  const hasCardOnFile = Boolean(user?.sumitCustomerId || user?.savedCardLastFour);

  const handleCancelSubscription = () => {
    if (!subscription?._id) return;

    if (window.confirm(t('subscriptionDetails.cancellation.confirmMessage'))) {
      cancelSubscriptionMutation.mutate(undefined, {
        onSuccess: (cancelledSubscription) => {
          if (cancelledSubscription) {
            updateSubscription(cancelledSubscription._id, 'CANCELLED');
          }
        }
      });
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
        <button onClick={() => langNavigate('/dashboard?tab=billing')} className="primary-button">
          {t('subscriptionDetails.noSubscription.viewBilling')}
        </button>
      </div>
    );
  }

  return (
    <div className="subscription-details">
      <div className="subscription-header">
        <div className="title-status">
          <h3>{t('subscriptionDetails.planNames.free')}</h3>
          <p className="status">
            {subscription?.status === 'ACTIVE'
              ? t('subscriptionDetails.status.active')
              : t('subscriptionDetails.status.cancelled')}
          </p>
        </div>
        <span className="plan-badge free">{t('subscriptionDetails.badges.free')}</span>
      </div>

      <div className="subscription-info">
        <div className="info-item">
          <p className="label">{t('subscriptionDetails.info.monthlyFee.label')}</p>
          <p className="value">{t('subscriptionDetails.info.monthlyFee.free')}</p>
        </div>
        <div className="info-item">
          <p className="label">{t('subscriptionDetails.info.platformFee.label')}</p>
          <p className="value">{t('subscriptionDetails.info.platformFee.value')}</p>
        </div>
        <div className="info-item">
          <p className="label">{t('profile.platformFee.cardOnFile', { ns: 'profile' })}</p>
          <p className="value">
            {hasCardOnFile
              ? user?.savedCardLastFour
                ? `•••• ${user.savedCardLastFour}`
                : t('profile.platformFee.saved', { ns: 'profile' })
              : t('profile.platformFee.notSaved', { ns: 'profile' })}
          </p>
        </div>
      </div>

      <div className="subscription-actions">
        {subscription?.status === 'ACTIVE' && (
          <>
            <button onClick={() => langNavigate('/dashboard?tab=billing')} className="manage-link">
              {t('subscriptionDetails.actions.managePayment')}
            </button>
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
