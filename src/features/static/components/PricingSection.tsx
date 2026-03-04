/**
 * Pricing Section Component for StudioZ
 * Free-forever model: single offering with platform fee (9%) on approved sessions.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@shared/components/icons';
import { trackEvent } from '@shared/utils/analytics';
import '../styles/_pricing-section.scss';

interface PricingSectionProps {
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ className = '' }) => {
  const { t, i18n } = useTranslation('forOwners');
  const navigate = useNavigate();
  const isRtl = i18n.language === 'he';

  const features = [
    t('pricing.freeForever.features.unlimitedListings'),
    t('pricing.freeForever.features.calendarSync'),
    t('pricing.freeForever.features.payments'),
    t('pricing.freeForever.features.analytics'),
    t('pricing.freeForever.features.invoicing'),
    t('pricing.freeForever.features.support'),
  ];

  const handleGetStarted = () => {
    trackEvent('Lead', {
      content_name: 'Pricing CTA - Get Started',
      content_category: 'Conversion'
    });
    navigate('/studio/create');
  };

  return (
    <section
      className={`pricing-section ${className}`}
      id="pricing"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="pricing-section__container">
        <div className="pricing-section__header">
          <motion.h2
            className="pricing-section__title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('pricing.freeForever.title')}{' '}
            <br className="pricing-section__title-break" />
            <span className="pricing-section__title-accent">
              {t('pricing.freeForever.titleAccent')}
            </span>
          </motion.h2>
          <motion.p
            className="pricing-section__subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t('pricing.freeForever.subtitle')}
          </motion.p>
         
        </div>

        <div className="pricing-section__grid pricing-section__grid--single">
          <motion.div
            className="pricing-card pricing-card--featured pricing-card--free-forever"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="pricing-card__content">
              <div className="pricing-card__label">
                {t('pricing.freeForever.badge')}
              </div>
              <div className="pricing-card__price-container">
                <span className="pricing-card__price">₪0</span>
                <span className="pricing-card__period">{t('pricing.freeForever.period')}</span>
              </div>
              <p className="pricing-card__description">
                {t('pricing.freeForever.valueProp')}
              </p>
              <ul className="pricing-card__features">
                {features.map((feature, index) => (
                  <li key={index} className="pricing-card__feature">
                    <CheckCircleIcon className="pricing-card__feature-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="pricing-card__cta"
              onClick={handleGetStarted}
              type="button"
            >
              {t('pricing.freeForever.cta')}
            </button>
          </motion.div>
        </div>

        <motion.p
          className="pricing-section__comparison"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {t('pricing.freeForever.comparison')}
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
