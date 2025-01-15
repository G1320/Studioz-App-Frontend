import { useSubscription } from '@hooks/index';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cancelSubscription } from '@services/subscription-service';

export const SubscriptionDetails = () => {
  const { isLoading, hasSubscription, isPro, subscription, paypalDetails } = useSubscription();

  const handleCancelSubscription = async () => {
    if (!subscription?._id) return;

    try {
      if (window.confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
        await cancelSubscription(subscription._id);
        toast.success('Subscription cancelled successfully');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  if (isLoading) {
    return <div className="subscription-loading"></div>;
  }

  if (!hasSubscription) {
    return (
      <div className="subscription-details no-subscription">
        <h3>No Active Subscription</h3>
        <p>Upgrade your account to access premium features</p>
        <Link to="/subscription" className="primary-button">
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="subscription-details">
      <div className="subscription-header">
        <div className="title-status">
          <h3>{isPro ? 'Professional Plan' : 'Starter Plan'}</h3>
          <p className="status">{subscription?.status === 'ACTIVE' ? 'Active' : subscription?.status.toLowerCase()}</p>
        </div>
        <span className={`plan-badge ${isPro ? 'pro' : 'starter'}`}>{isPro ? 'PRO' : 'STARTER'}</span>
      </div>

      <div className="subscription-info">
        {subscription?.startDate && (
          <div className="info-item">
            <p className="label">Start Date</p>
            <p className="value">{new Date(subscription.startDate).toLocaleDateString()}</p>
          </div>
        )}

        {paypalDetails?.billing_info?.next_billing_time && (
          <div className="info-item">
            <p className="label">Next Billing Date</p>
            <p className="value">{new Date(paypalDetails.billing_info.next_billing_time).toLocaleDateString()}</p>
          </div>
        )}

        <div className="info-item">
          <p className="label">Price</p>
          <p className="value">{isPro ? '₪150' : '₪75'} / month</p>
        </div>
      </div>

      <div className="subscription-actions">
        {subscription?.status === 'ACTIVE' && (
          <>
            <Link to="/subscription" className="manage-link">
              {isPro ? 'Manage Plan' : 'Upgrade Plan'}
            </Link>
            <button onClick={handleCancelSubscription} className="cancel-button">
              Cancel Plan
            </button>
          </>
        )}
      </div>

      {subscription?.status === 'CANCELLED' && (
        <div className="cancelled-notice">
          <p>Your subscription has been cancelled</p>
          {subscription.endDate && (
            <p className="access-until">Access until: {new Date(subscription.endDate).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionDetails;
