import { useUserContext } from '@core/contexts';
import { useState, useCallback } from 'react';
import { sumitService } from '@shared/services/sumit-service';
import { createSubscription, activateSubscription } from '@shared/services/subscription-service';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { sendSubscriptionConfirmation } from '@shared/services/email-service';
import { SumitPaymentForm } from '@shared/components';
import { prepareFormData } from '../utils';
import { applyCoupon } from '@shared/services/coupon-service';

export const SumitSubscriptionPaymentForm = ({ plan }) => {
  const [error, setError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { user, updateSubscription } = useUserContext();
  const langNavigate = useLanguageNavigate();

  const handleCouponApplied = useCallback((coupon) => {
    setAppliedCoupon(coupon);
  }, []);

  const createPendingSubscription = async () => {
    try {
      const subscription = await createSubscription({
        userId: user?._id,
        planId: plan.planId
      });

      if (!subscription?._id) {
        throw new Error('Invalid subscription response');
      }

      return subscription;
    } catch (error) {
      throw new Error('Failed to create subscription: ' + error.message);
    }
  };

  const processPayment = async (token, finalPrice) => {
    const paymentResponse = await sumitService.createSubscriptionPayment(
      token,
      {
        customerName: user?.name,
        customerEmail: user?.email,
        userId: user?._id // Pass userId to save card for future use
      },
      {
        name: `Monthly ${plan.name} Subscription`,
        amount: finalPrice,
        description: appliedCoupon 
          ? `Monthly subscription plan (Coupon: ${appliedCoupon.code})`
          : 'Monthly subscription plan',
        durationMonths: 1,
        recurrence: 12
      }
    );

    if (!paymentResponse?.success) {
      throw new Error(paymentResponse?.error || 'Payment processing failed');
    }

    return paymentResponse;
  };

  const activateSubscriptionWithPayment = async (subscriptionId, paymentDetails) => {
    try {
      return await activateSubscription({
        subscriptionId,
        sumitPaymentResponse: paymentDetails
      });
    } catch (error) {
      throw new Error('Failed to activate subscription: ' + error.message);
    }
  };

  // Calculate final price after coupon discount
  const getFinalPrice = () => {
    if (!appliedCoupon) return plan.price;
    return Math.max(0, plan.price - appliedCoupon.discountAmount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalPrice = getFinalPrice();

    try {
      // 1. Create pending subscription
      const pendingSubscription = await createPendingSubscription();

      // 2. Get token from Sumit
      const formData = prepareFormData(e.target);
      const token = await sumitService.getSumitToken(formData);

      // 3. Process payment with Sumit (with discounted price)
      const paymentResponse = await processPayment(token, finalPrice);
      if (!paymentResponse.data) {
        throw new Error('Invalid payment response');
      }

      // 4. Mark coupon as used if applied
      if (appliedCoupon) {
        try {
          await applyCoupon(appliedCoupon.code);
        } catch (couponError) {
          console.error('Failed to mark coupon as used:', couponError);
          // Don't fail the subscription if coupon tracking fails
        }
      }

      // 5. Activate subscription
      const activeSubscription = await activateSubscriptionWithPayment(pendingSubscription._id, paymentResponse.data);

      updateSubscription(activeSubscription._id, 'ACTIVE');

      await sendSubscriptionConfirmation(user?.email, {
        customerName: user?.name,
        planName: activeSubscription.planName,
        planPrice: activeSubscription.sumitPaymentDetails.Payment.Amount,
        subscriptionId: activeSubscription._id,
        startDate: new Date()
      });

      console.log('Subscription activated successfully');
      langNavigate('/dashboard');
    } catch (error) {
      console.error('Subscription process error:', error);
      setError(error.message || 'Failed to complete subscription process');
    }
  };

  return (
    <SumitPaymentForm
      onSubmit={handleSubmit}
      error={error}
      totalAmount={plan.price}
      planId={plan.planId}
      onCouponApplied={handleCouponApplied}
      showCouponInput={true}
    />
  );
};

export default SumitSubscriptionPaymentForm;
