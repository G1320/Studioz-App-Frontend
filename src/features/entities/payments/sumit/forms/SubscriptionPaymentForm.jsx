import { useUserContext } from '@core/contexts';
import { useEffect, useState } from 'react';
import { sumitService } from '@shared/services/sumit-service';
import { createSubscription, activateSubscription } from '@shared/services/subscription-service';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { sendSubscriptionConfirmation } from '@shared/services/email-service';
import { SumitPaymentForm } from '@shared/components';
import { prepareFormData } from '../utils';

export const SumitSubscriptionPaymentForm = ({ plan }) => {
  const [error, setError] = useState('');
  const { user, updateSubscription } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('forms');

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

  const processPayment = async (token) => {
    const paymentResponse = await sumitService.createSubscriptionPayment(
      token,
      {
        costumerName: user?.name,
        costumerEmail: user?.email
      },
      {
        name: `Monthly ${plan.name} Subscription`,
        amount: plan.price,
        description: 'Monthly subscription plan',
        durationMonths: 1,
        recurrence: 48
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Create pending subscription
      const pendingSubscription = await createPendingSubscription();

      // 2. Get token from Sumit
      const formData = prepareFormData(e.target);
      const token = await sumitService.getSumitToken(formData);

      // 3. Process payment with Sumit
      const paymentResponse = await processPayment(token);
      if (!paymentResponse.data) {
        throw new Error('Invalid payment response');
      }
      // 4. Activate subscription
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
      langNavigate('/profile');
    } catch (error) {
      console.error('Subscription process error:', error);
      setError(error.message || 'Failed to complete subscription process');
    }
  };
  return <SumitPaymentForm onSubmit={handleSubmit} error={error} totalAmount={plan.price} />;
};

export default SumitSubscriptionPaymentForm;
