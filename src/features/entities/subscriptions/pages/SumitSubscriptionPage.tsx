import { SumitSubscriptionPaymentForm } from '@features/entities/payments/sumit/forms';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '@shared/hooks';

export const SumitSubscriptionPage = () => {
  const { t } = useTranslation('subscriptions');
  const { isPro, isStarter } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const paymentFormRef = useRef<HTMLDivElement>(null);

  // Determine current plan
  const getCurrentPlanId = () => {
    if (isPro) return 'pro';
    if (isStarter) return 'starter';
    return 'free'; // No subscription means free plan
  };

  const currentPlanId = getCurrentPlanId();

  const handlePlanSelect = (plan: any) => {
    // If clicking the same plan, deselect it
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(null);
    } else {
      // Set the selected plan (including free)
      setSelectedPlan(plan);
    }
  };

  const scrollToPaymentForm = () => {
    setTimeout(() => {
      paymentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleButtonClick = (e: React.MouseEvent, plan: any) => {
    e.stopPropagation(); // Prevent card click from firing
    // Select plan if not already selected
    if (selectedPlan?.id !== plan.id) {
      setSelectedPlan(plan);
    }
    // Scroll to payment form
    scrollToPaymentForm();
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      planId: 'free',
      price: 0,
      period: t('plans.period'),
      highlight: t('plans.free.highlight'),
      features: [
        t('plans.free.features.listing'),
        // t('plans.free.features.photos'),
        t('plans.free.features.booking'),
        t('plans.free.features.support')
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      planId: 'starter',
      price: 49,
      period: t('plans.period'),
      highlight: t('plans.starter.highlight'),
      features: [
        t('plans.starter.features.listing'),
        t('plans.starter.features.booking'),
        t('plans.starter.features.calendar'),
        t('plans.starter.features.googleCalendar'),
        t('plans.starter.features.cancel'),
        t('plans.starter.features.support')
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      planId: 'pro',
      price: 99,
      period: t('plans.period'),
      highlight: t('plans.pro.highlight'),
      features: [
        t('plans.pro.features.listing'),
        t('plans.pro.features.booking'),
        t('plans.pro.features.calendar'),
        t('plans.pro.features.googleCalendar'),
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
          <div
            key={plan.id}
            className={`plan-card ${plan.id} ${selectedPlan?.id === plan.id ? 'selected' : ''} clickable`}
            onClick={() => handlePlanSelect(plan)}
          >
            {plan.highlight === t('plans.pro.highlight') && (
              <div className="popular-badge">{t('plans.popularBadge')}</div>
            )}
            {currentPlanId === plan.id && <div className="current-plan-badge">{t('plans.currentPlan')}</div>}

            <div className="plan-header">
              <h2>{plan.name}</h2>
              <p className="highlight">{plan.highlight}</p>
            </div>

            <div className="price">
              {plan.price === 0 ? (
                <span className="amount">{t('plans.freeLabel')}</span>
              ) : (
                <>
                  <span className="amount">₪{plan.price}</span>
                  <span className="period">{t('plans.priceLabel', { period: plan.period })}</span>
                </>
              )}
            </div>

            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {plan.id !== 'free' && (
              <button className="subscribe-button" onClick={(e) => handleButtonClick(e, plan)}>
                {t('buttons.getStarted')}
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedPlan && selectedPlan.id !== 'free' && (
        <div id="sumit-container" ref={paymentFormRef}>
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

export default SumitSubscriptionPage;
