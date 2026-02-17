/**
 * Pricing Section Component for StudioZ
 * High-conversion pricing table with bilingual support and subscription integration
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, CloseIcon } from '@shared/components/icons';
import { SumitSubscriptionPaymentForm } from '@features/entities/payments/sumit/forms/SubscriptionPaymentForm';
import { trackEvent } from '@shared/utils/analytics';
import '../styles/_pricing-section.scss';

// Plan interface matching what SumitSubscriptionPaymentForm expects
interface Plan {
  id: string;
  name: string;
  planId: string;
  price: number;
  period: string;
  highlight: string;
  features: string[];
  notIncluded?: string[];
  /** Insert notIncluded items after this feature index (0-based). If undefined, notIncluded is rendered after all features. */
  notIncludedAfterIndex?: number;
  isPopular?: boolean;
  ctaText: string;
}

interface PricingSectionProps {
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ className = '' }) => {
  const { t, i18n } = useTranslation('forOwners');
  const navigate = useNavigate();
  const isRtl = i18n.language === 'he';
  
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const paymentFormRef = useRef<HTMLDivElement>(null);

  const scrollToPaymentForm = () => {
    setTimeout(() => {
      paymentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handlePlanSelect = (plan: Plan) => {
    // Track Lead event when user selects a plan
    trackEvent('Lead', {
      content_name: `Pricing CTA - ${plan.id}`,
      content_category: 'Conversion'
    });

    if (plan.id === 'free') {
      // Free plan navigates directly to create studio
      navigate('/studio/create');
      return;
    }
    
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(null);
    } else {
      setSelectedPlan(plan);
      scrollToPaymentForm();
    }
  };

  // Plans configuration matching subscription page format
  const plans: Plan[] = [
    {
      id: 'free',
      name: t('pricing.tiers.free.name'),
      planId: 'free',
      price: 0,
      period: t('pricing.period'),
      highlight: t('pricing.tiers.free.description'),
      features: [
        t('pricing.tiers.free.features.listing'),
        t('pricing.tiers.free.features.calendar'),
        t('pricing.tiers.free.features.approvals'),
        t('pricing.tiers.free.features.unlimitedSessions'),
        t('pricing.tiers.free.features.support'),
      ],
      notIncluded: [
        t('pricing.tiers.free.excluded.googleSync'),
        t('pricing.tiers.free.excluded.remoteProjects'),
      ],
      notIncludedAfterIndex: 4,
      ctaText: t('pricing.cta.start'),
    },
    {
      id: 'starter',
      name: 'Starter',
      planId: 'starter',
      price: 49,
      period: t('pricing.period'),
      highlight: t('pricing.tiers.starter.description'),
      features: [
        t('pricing.tiers.starter.features.services'),
        t('pricing.tiers.starter.features.unlimitedProjectsSessions'),
        t('pricing.tiers.starter.features.googleSync'),
        t('pricing.tiers.starter.features.invoicing'),
        t('pricing.tiers.starter.features.payments'),
        t('pricing.tiers.starter.features.trial'),
      ],
      isPopular: true,
      ctaText: t('pricing.cta.trial'),
    },
    {
      id: 'pro',
      name: 'Pro',
      planId: 'pro',
      price: 99,
      period: t('pricing.period'),
      highlight: t('pricing.tiers.pro.description'),
      features: [
        t('pricing.tiers.pro.features.multiStudio'),
        t('pricing.tiers.pro.features.unlimitedProjectsSessions'),
        t('pricing.tiers.pro.features.analytics'),
        t('pricing.tiers.pro.features.payments'),
        t('pricing.tiers.pro.features.support'),
        t('pricing.tiers.pro.features.trial'),
      ],
      ctaText: t('pricing.cta.trial'),
    },
  ];

  // Trial days for display
  const trialDays: Record<string, number> = {
    starter: 7,
    pro: 14,
  };

  return (
    <section 
      className={`pricing-section ${className}`} 
      id="pricing" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="pricing-section__container">
        {/* Header */}
        <div className="pricing-section__header">
          <motion.h2
            className="pricing-section__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('pricing.title')} <br className="pricing-section__title-break" />
            <span className="pricing-section__title-accent">{t('pricing.titleAccent')}</span>
          </motion.h2>
          <motion.p
            className="pricing-section__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t('pricing.subtitle')}
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-section__grid">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`pricing-card ${plan.isPopular ? 'pricing-card--featured' : ''} ${selectedPlan?.id === plan.id ? 'pricing-card--selected' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="pricing-card__content">
                {/* Tier Label */}
                <div className="pricing-card__label">
                  {plan.name}
                </div>

                {/* Price */}
                <div className="pricing-card__price-container">
                  <span className="pricing-card__price">₪{plan.price}</span>
                  <span className="pricing-card__period">{plan.period}</span>
                </div>

                {/* Description */}
                <p className="pricing-card__description">
                  {plan.highlight}
                </p>

                {/* Trial Badge */}
                {trialDays[plan.id] && (
                  <div className="pricing-card__trial-badge">
                    {t('pricing.trialBadge', { days: trialDays[plan.id] })}
                  </div>
                )}

                {/* Features */}
                <ul className="pricing-card__features">
                  {plan.features.map((feature, featureIndex) => (
                    <React.Fragment key={featureIndex}>
                      <li className="pricing-card__feature">
                        <CheckCircleIcon className="pricing-card__feature-icon" />
                        <span>{feature}</span>
                      </li>
                      {plan.notIncludedAfterIndex === featureIndex &&
                        plan.notIncluded?.map((label, idx) => (
                          <li key={`excluded-${idx}`} className="pricing-card__feature pricing-card__feature--excluded">
                            <CloseIcon className="pricing-card__feature-icon pricing-card__feature-icon--excluded" />
                            <span className="pricing-card__feature-text--strike">{label}</span>
                          </li>
                        ))}
                    </React.Fragment>
                  ))}
                  {plan.notIncludedAfterIndex === undefined &&
                    plan.notIncluded?.map((label, idx) => (
                      <li key={`excluded-${idx}`} className="pricing-card__feature pricing-card__feature--excluded">
                        <CloseIcon className="pricing-card__feature-icon pricing-card__feature-icon--excluded" />
                        <span className="pricing-card__feature-text--strike">{label}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                className="pricing-card__cta"
                onClick={() => handlePlanSelect(plan)}
                type="button"
              >
                {plan.ctaText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Payment Form */}
        <AnimatePresence>
          {selectedPlan && selectedPlan.id !== 'free' && (
            <motion.div
              ref={paymentFormRef}
              className="pricing-section__payment"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="pricing-section__payment-wrapper">
                <SumitSubscriptionPaymentForm plan={selectedPlan} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PricingSection;
