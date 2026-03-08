/**
 * Pricing Section Component for Studioz
 * Free-forever model with progressive tiered platform fees.
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

const TIER_KEYS = ['tier1', 'tier2', 'tier3'] as const;

export const PricingSection: React.FC<PricingSectionProps> = ({ className = '' }) => {
  const { t, i18n } = useTranslation('forOwners');
  const navigate = useNavigate();
  const isRtl = i18n.language === 'he';

  const features = [
    t('pricing.freeForever.features.unlimitedListings'),
    t('pricing.freeForever.features.remoteProjects'),
    t('pricing.freeForever.features.calendarSync'),
    t('pricing.freeForever.features.payments'),
    t('pricing.freeForever.features.analytics'),
    t('pricing.freeForever.features.reports'),
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

        {/* ─── Fee Tiers Explainer ─── */}
        <div className="pricing-section__fee-tiers">
          <motion.h3
            className="pricing-section__fee-tiers-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t('pricing.feeTiers.title')}{' '}
            <span className="pricing-section__title-accent">
              {t('pricing.feeTiers.titleAccent')}
            </span>
          </motion.h3>
          <motion.p
            className="pricing-section__fee-tiers-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t('pricing.feeTiers.subtitle')}
          </motion.p>

          <div className="pricing-section__tiers-grid">
            {TIER_KEYS.map((key, i) => (
              <motion.div
                key={key}
                className="pricing-tier-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="pricing-tier-card__rate">
                  {t(`pricing.feeTiers.${key}.rate`)}
                </span>
                <span className="pricing-tier-card__range">
                  {t(`pricing.feeTiers.${key}.range`)}
                </span>
                <span className="pricing-tier-card__label">
                  {t(`pricing.feeTiers.${key}.label`)}
                </span>
                <p className="pricing-tier-card__desc">
                  {t(`pricing.feeTiers.${key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="pricing-section__example"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="pricing-section__example-label">
              {t('pricing.feeTiers.example.title')}
            </span>
            <p className="pricing-section__example-text">
              {t('pricing.feeTiers.example.description')}
            </p>
          </motion.div>

          <motion.p
            className="pricing-section__marginal-note"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t('pricing.feeTiers.marginalNote')}
          </motion.p>
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
