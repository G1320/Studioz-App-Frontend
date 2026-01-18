import { useUserContext } from '@core/contexts';
import { useState, useCallback, useMemo } from 'react';
import { sumitService } from '@shared/services/sumit-service';
import { createSubscription, activateSubscription } from '@shared/services/subscription-service';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { sendSubscriptionConfirmation } from '@shared/services/email-service';
import { SumitPaymentForm } from '@shared/components';
import { prepareFormData } from '../utils';
import { applyCoupon } from '@shared/services/coupon-service';
import { useSubscription } from '@shared/hooks/subscriptions/useSubscription';

// Plan configuration with trial days
const PLAN_CONFIG = {
  starter: { trialDays: 7 },
  pro: { trialDays: 14 }
};

export const SumitSubscriptionPaymentForm = ({ plan }) => {
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { user, updateSubscription } = useUserContext();
  const { subscription, isStarter, isPro } = useSubscription();
  const { t } = useTranslation('subscriptions');
  const langNavigate = useLanguageNavigate();

  // Determine if this is an upgrade (user already has an active subscription)
  const isUpgrade = useMemo(() => {
    // User is upgrading if they have an active/trial subscription and are selecting a different plan
    if (!subscription) return false;
    const hasActiveSubscription = ['ACTIVE', 'TRIAL'].includes(subscription.status);
    const isDifferentPlan = subscription.planId !== plan.planId;
    return hasActiveSubscription && isDifferentPlan;
  }, [subscription, plan.planId]);

  // Get trial days for the selected plan
  const trialDays = PLAN_CONFIG[plan.planId]?.trialDays || 7;

  const handleCouponApplied = useCallback((coupon) => {
    setAppliedCoupon(coupon);
  }, []);

  // Calculate final price after coupon discount
  const getFinalPrice = () => {
    if (!appliedCoupon) return plan.price;
    return Math.max(0, plan.price - appliedCoupon.discountAmount);
  };

  // ============================================
  // UPGRADE FLOW - Immediate charge
  // ============================================
  const handleUpgrade = async (token, finalPrice) => {
    // 1. Create pending subscription record
    const pendingSubscription = await createSubscription({
      userId: user?._id,
      planId: plan.planId
    });

    if (!pendingSubscription?._id) {
      throw new Error('Failed to create subscription record');
    }

    // 2. Process immediate payment
    const paymentResponse = await sumitService.createSubscriptionPayment(
      token,
      {
        customerName: user?.name,
        customerEmail: user?.email,
        userId: user?._id
      },
      {
        name: `Monthly ${plan.name} Subscription`,
        amount: finalPrice,
        description: `Upgrade to ${plan.name} plan`,
        durationMonths: 1,
        recurrence: 12
      }
    );

    if (!paymentResponse?.success) {
      throw new Error(paymentResponse?.error || 'Payment processing failed');
    }

    // 3. Activate the new subscription
    const activeSubscription = await activateSubscription({
      subscriptionId: pendingSubscription._id,
      sumitPaymentResponse: paymentResponse.data
    });

    // 4. Update user context
    updateSubscription(activeSubscription._id, 'ACTIVE');

    // 5. Send confirmation email
    await sendSubscriptionConfirmation(user?.email, {
      customerName: user?.name,
      planName: activeSubscription.planName,
      planPrice: activeSubscription.sumitPaymentDetails?.Payment?.Amount || finalPrice,
      subscriptionId: activeSubscription._id,
      startDate: new Date()
    });

    return activeSubscription;
  };

  // ============================================
  // NEW SUBSCRIPTION FLOW - Free trial (card capture only)
  // ============================================
  const handleNewSubscription = async (token) => {
    const response = await sumitService.createTrialSubscription({
      singleUseToken: token,
      customerInfo: {
        userId: user?._id || '',
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: user?.phone || ''
      },
      planDetails: {
        planId: plan.planId
      },
      trialDays
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to start trial');
    }

    // Update user context with TRIAL status
    updateSubscription(response.data?.subscription._id, 'TRIAL');

    return response.data?.subscription;
  };

  // ============================================
  // MAIN SUBMIT HANDLER
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    const finalPrice = getFinalPrice();

    try {
      // Get token from Sumit (validates card)
      const formData = prepareFormData(e.target);
      const token = await sumitService.getSumitToken(formData);

      // Mark coupon as used if applied (for upgrades)
      if (appliedCoupon && isUpgrade) {
        try {
          await applyCoupon(appliedCoupon.code);
        } catch (couponError) {
          console.error('Failed to mark coupon as used:', couponError);
        }
      }

      if (isUpgrade) {
        // UPGRADE: Charge immediately
        await handleUpgrade(token, finalPrice);
        console.log('Upgrade completed successfully');
      } else {
        // NEW SUBSCRIPTION: Start free trial
        await handleNewSubscription(token);
        console.log('Trial started successfully');
      }

      langNavigate('/dashboard');
    } catch (error) {
      console.error('Subscription process error:', error);
      setError(error.message || 'Failed to complete subscription process');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="subscription-payment-form">
      {/* Show trial info for new subscriptions, upgrade info for upgrades */}
      {!isUpgrade ? (
        <div className="subscription-payment-form__trial-banner">
          <div className="trial-badge">
            <span className="trial-days">{trialDays}</span>
            <span className="trial-label">{t('trial.daysFree', 'Days Free')}</span>
          </div>
          <div className="trial-details">
            <h3>{t('trial.startYourTrial', 'Start Your Free Trial')}</h3>
            <p>
              {t(
                'trial.description',
                'Try {{planName}} free for {{days}} days. Your card will be charged ₪{{price}} on {{date}} unless you cancel.',
                {
                  planName: plan.name,
                  days: trialDays,
                  price: plan.price,
                  date: trialEndDate.toLocaleDateString('he-IL')
                }
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="subscription-payment-form__upgrade-banner">
          <h3>{t('upgrade.title', 'Upgrade to {{planName}}', { planName: plan.name })}</h3>
          <p>
            {t('upgrade.description', 'You will be charged ₪{{price}} now and monthly thereafter.', {
              price: getFinalPrice()
            })}
          </p>
        </div>
      )}

      <SumitPaymentForm
        onSubmit={handleSubmit}
        error={error}
        totalAmount={isUpgrade ? getFinalPrice() : 0}
        planId={plan.planId}
        onCouponApplied={handleCouponApplied}
        showCouponInput={isUpgrade} // Only show coupon for upgrades (immediate payment)
        isProcessing={isProcessing}
        submitButtonText={
          isProcessing
            ? t('form.processing', 'Processing...')
            : isUpgrade
              ? t('form.upgradeNow', 'Upgrade Now')
              : t('form.startTrial', 'Start Free Trial')
        }
        showHeader={false}
      />

      {/* Trial terms for new subscriptions */}
      {!isUpgrade && (
        <div className="subscription-payment-form__terms">
          <p>
            {t(
              'trial.terms',
              'By starting your trial, you agree to be charged ₪{{price}} monthly after the trial ends. Cancel anytime before {{date}} to avoid charges.',
              {
                price: plan.price,
                date: trialEndDate.toLocaleDateString('he-IL')
              }
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default SumitSubscriptionPaymentForm;
