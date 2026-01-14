import { useUserContext } from '@core/contexts';
import { useState } from 'react';
import { sumitService } from '@shared/services/sumit-service';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { SumitPaymentForm } from '@shared/components';
import { prepareFormData } from '../utils';

interface Plan {
  planId: string;
  name: string;
  price: number;
  trialDays?: number;
}

interface TrialSubscriptionPaymentFormProps {
  plan: Plan;
  onSuccess?: (subscription: any) => void;
}

export const TrialSubscriptionPaymentForm = ({ plan, onSuccess }: TrialSubscriptionPaymentFormProps) => {
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, updateSubscription } = useUserContext();
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('subscriptions');

  const trialDays = plan.trialDays || 7;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      // 1. Get token from Sumit (validates card)
      const formData = prepareFormData(e.target as HTMLFormElement);
      const token = await sumitService.getSumitToken(formData);

      // 2. Create trial subscription (saves card, doesn't charge)
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
        throw new Error(response.error || 'Failed to create trial subscription');
      }

      // 3. Update user context
      updateSubscription(response.data?.subscription._id, 'TRIAL');

      console.log('Trial subscription created successfully:', response.data);

      // 4. Callback or navigate
      if (onSuccess) {
        onSuccess(response.data?.subscription);
      } else {
        langNavigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Trial subscription error:', error);
      setError(error.message || 'Failed to start trial. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate trial end date for display
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + trialDays);

  return (
    <div className="trial-subscription-form">
      {/* Trial Info Banner */}
      <div className="trial-info-banner">
        <div className="trial-badge">
          <span className="trial-days">{trialDays}</span>
          <span className="trial-label">{t('trial.daysFree', 'Days Free')}</span>
        </div>
        <div className="trial-details">
          <h3>{t('trial.startYourTrial', 'Start Your Free Trial')}</h3>
          <p>
            {t('trial.description', 'Try {{planName}} free for {{days}} days. Your card will be charged {{price}} ILS on {{date}} unless you cancel.', {
              planName: plan.name,
              days: trialDays,
              price: plan.price,
              date: trialEndDate.toLocaleDateString('he-IL')
            })}
          </p>
        </div>
      </div>

      {/* Payment Form for Card Capture */}
      <SumitPaymentForm
        onSubmit={handleSubmit}
        error={error}
        totalAmount={0} // Show 0 for trial - card is captured but not charged
        planId={plan.planId}
        submitButtonText={t('trial.startTrial', 'Start Free Trial')}
        showCouponInput={false}
        isProcessing={isProcessing}
        showHeader={false}
      />

      {/* Trial Terms */}
      <div className="trial-terms">
        <p>
          {t('trial.terms', 'By starting your trial, you agree to be charged {{price}} ILS monthly after the trial ends. Cancel anytime before {{date}} to avoid charges.', {
            price: plan.price,
            date: trialEndDate.toLocaleDateString('he-IL')
          })}
        </p>
      </div>
    </div>
  );
};

export default TrialSubscriptionPaymentForm;
