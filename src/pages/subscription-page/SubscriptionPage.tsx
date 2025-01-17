import { useState, useEffect } from 'react';

import { PAYPAL_CLIENT_ID } from '@config/paypal/paypalConfig';
import { useUserContext } from '@contexts/UserContext';
import { toast } from 'sonner';
import { activateSubscription, createSubscription } from '@services/subscription-service';
// import { sendSubscriptionConfirmation } from '@services/email-service';
import { useTranslation } from 'react-i18next';
const isProduction = import.meta.env.VITE_NODE_ENV === 'production';

const SubscriptionPage = () => {
  const { user, updateSubscription } = useUserContext();
  const { t } = useTranslation('subscriptions');

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [dbSubscription, setDbSubscription] = useState<any>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 79,
      period: t('plans.period'),
      highlight: t('plans.starter.highlight'),
      features: [
        t('plans.starter.features.listing'),
        t('plans.starter.features.booking'),
        t('plans.starter.features.calendar'),
        t('plans.starter.features.support')
      ],
      paypalPlanId: isProduction ? 'P-118012182Y9607940M6FACVY' : 'P-545211905R676864UM6DY3GA'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 149,
      period: t('plans.period'),
      highlight: t('plans.pro.highlight'),
      features: [
        t('plans.pro.features.listing'),
        t('plans.pro.features.booking'),
        t('plans.pro.features.calendar'),
        t('plans.pro.features.support'),
        t('plans.pro.features.payment')
      ],
      paypalPlanId: isProduction ? 'P-63W27369MJ067153MM6FABZQ' : 'P-7RT29383GF5387715M6DY4JI'
    }
  ];

  const handleSubscribe = async (plan: any) => {
    if (!user?._id) {
      toast.error(t('errors.loginRequired'));
      return;
    }
    try {
      // Create subscription in our database first
      const subscription = await createSubscription({
        userId: user._id,
        planId: plan.id
      });
      setDbSubscription(subscription);
      setSelectedPlan(plan);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error(t('errors.initiateFailed'));
    }
  };

  useEffect(() => {
    if (selectedPlan?.paypalPlanId) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.setAttribute('data-sdk-integration-source', 'button-factory');
      script.onload = () => {
        if (window.paypal && window.paypal.Buttons) {
          window.paypal
            .Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'subscribe'
              },
              createSubscription: async function (_data: any, actions: any) {
                return actions.subscription.create({
                  plan_id: selectedPlan.paypalPlanId,
                  application_context: {
                    shipping_preference: 'GET_FROM_FILE'
                  }
                });
              },
              onApprove: async function (data, actions) {
                const subscriptionDetails = await actions.subscription?.get();

                await activateSubscription({
                  subscriptionId: dbSubscription._id,
                  paypalSubscriptionId: data.subscriptionID || '',
                  subscriptionDetails
                });

                // await sendSubscriptionConfirmation(user?.email as string, {
                //   customerName: user?.name as string,
                //   planName: selectedPlan.name,
                //   planPrice: selectedPlan.price,
                //   subscriptionId: data.subscriptionID as string,
                //   startDate: new Date()
                // });

                updateSubscription(dbSubscription._id, 'ACTIVE');
                return Promise.resolve();
              }
            })
            .render('#paypal-button-container');
        }
      };
      document.body.appendChild(script);

      return () => {
        const buttonContainer = document.getElementById('paypal-button-container');
        if (buttonContainer) {
          buttonContainer.innerHTML = '';
        }
      };
    }
  }, [selectedPlan]);
  return (
    <div className="subscription-page">
      <header className="header">
        <h1>{t('header.title')}</h1>
        <p>{t('header.subtitle')}</p>
      </header>

      <div className="plans-container">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.id} ${selectedPlan?.id === plan.id ? 'selected' : ''}`}>
            {plan.highlight === t('plans.pro.highlight') && (
              <div className="popular-badge">{t('plans.popularBadge')}</div>
            )}

            <div className="plan-header">
              <h2>{plan.name}</h2>
              <p className="highlight">{plan.highlight}</p>
            </div>

            <div className="price">
              <span className="amount">₪{plan.price}</span>
              <span className="period">{t('plans.priceLabel', { period: plan.period })}</span>
            </div>

            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="subscribe-button" onClick={() => handleSubscribe(plan)}>
              {t('buttons.getStarted')}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div id="paypal-container">
          <h2>{t('paypal.title', { planName: selectedPlan.name })}</h2>
          <div id="paypal-button-container"></div>
        </div>
      )}

      <footer className="benefits">
        {/* <h3>{t('benefits.title')}</h3> */}
        <div className="benefit-items">
          <div className="benefit">
            <span className="check-icon">✓</span>
            {t('benefits.trial')}
          </div>
          {/* <div className="benefit">
            <span className="check-icon">✓</span>
            {t('benefits.noCard')}
          </div> */}
          <div className="benefit">
            <span className="check-icon">✓</span>
            {t('benefits.cancel')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionPage;
