import SumitSubscriptionPaymentForm from '@components/payment/SumitSubscriptionPaymentForm';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

const PaypalSubscriptionPage = () => {
  const { t } = useTranslation('subscriptions');

  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      planId: 'starter',
      price: 79,
      period: t('plans.period'),
      highlight: t('plans.starter.highlight'),
      features: [
        t('plans.starter.features.listing'),
        t('plans.starter.features.booking'),
        t('plans.starter.features.calendar'),
        t('plans.starter.features.cancel'),
        t('plans.starter.features.support')
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      planId: 'pro',
      price: 149,
      period: t('plans.period'),
      highlight: t('plans.pro.highlight'),
      features: [
        t('plans.pro.features.listing'),
        t('plans.pro.features.booking'),
        t('plans.pro.features.calendar'),
        t('plans.pro.features.cancel'),
        t('plans.pro.features.support'),
        t('plans.pro.features.payment')
      ]
    }
  ];

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

            <button className="subscribe-button" onClick={() => setSelectedPlan(plan)}>
              {t('buttons.getStarted')}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div id="sumit-container">
          <SumitSubscriptionPaymentForm plan={selectedPlan} />
        </div>
      )}

      <footer className="benefits">
        {/* <h3>{t('benefits.title')}</h3> */}
        <div className="benefit-items">
          {/* <div className="benefit">
            <span className="check-icon">✓</span>
            {t('benefits.trial')}
          </div> */}

          {/* <div className="benefit">
            <span className="check-icon">✓</span>
            {t('benefits.cancel')}
          </div> */}
        </div>
      </footer>
    </div>
  );
};

export default PaypalSubscriptionPage;
