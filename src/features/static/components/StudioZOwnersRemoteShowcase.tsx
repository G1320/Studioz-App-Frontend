/**
 * StudioZOwnersRemoteShowcase
 * A marketing section for studio owners explaining the Remote Projects feature.
 * Highlights: global reach, async workflow, project management.
 * Fully translated with i18n support.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { ClockIcon, MusicNoteIcon, SmsIcon, ShieldIcon, ArrowBackIcon } from '@shared/components/icons';
import './_studioZ-owners-remote-showcase.scss';

interface FeatureConfig {
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
}

const FEATURE_CONFIGS: FeatureConfig[] = [
  {
    icon: ClockIcon,
    titleKey: 'remoteShowcase.features.async.title',
    descKey: 'remoteShowcase.features.async.description'
  },
  {
    icon: MusicNoteIcon,
    titleKey: 'remoteShowcase.features.pricing.title',
    descKey: 'remoteShowcase.features.pricing.description'
  },
  {
    icon: SmsIcon,
    titleKey: 'remoteShowcase.features.chat.title',
    descKey: 'remoteShowcase.features.chat.description'
  },
  {
    icon: ShieldIcon,
    titleKey: 'remoteShowcase.features.payments.title',
    descKey: 'remoteShowcase.features.payments.description'
  }
];

const STAT_KEYS = ['capacity', 'audience', 'schedule', 'pricing'] as const;

export const StudioZOwnersRemoteShowcase: React.FC = () => {
  const { t } = useTranslation('forOwners');
  const navigate = useLanguageNavigate();

  const handleListStudio = () => {
    navigate('/studio/create');
  };

  return (
    <section className="remote-showcase">
      {/* Background Glows */}
      <div className="remote-showcase__glow remote-showcase__glow--right" />
      <div className="remote-showcase__glow remote-showcase__glow--left" />

      <div className="remote-showcase__container">
        <div className="remote-showcase__layout">
          {/* Content Side */}
          <div className="remote-showcase__content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ease: 'easeOut' }}
            >
              <h2 className="remote-showcase__title">
                {t('remoteShowcase.title_line1')} <br />
                <span className="remote-showcase__title-accent">{t('remoteShowcase.title_accent')}</span>
              </h2>
              <p className="remote-showcase__description">{t('remoteShowcase.description')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, ease: 'easeOut' }}
              className="remote-showcase__features"
            >
              {FEATURE_CONFIGS.map((feature, i) => (
                <div key={i} className="remote-showcase__feature">
                  <div className="remote-showcase__feature-icon-wrapper">
                    <feature.icon className="remote-showcase__feature-icon" />
                  </div>
                  <h3 className="remote-showcase__feature-title">{t(feature.titleKey)}</h3>
                  <p className="remote-showcase__feature-desc">{t(feature.descKey)}</p>
                </div>
              ))}
            </motion.div>

            <div className="remote-showcase__cta-wrapper">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, ease: 'easeOut' }}
                className="remote-showcase__cta-btn"
                type="button"
                onClick={handleListStudio}
              >
                {t('remoteShowcase.cta')}
                <ArrowBackIcon className="remote-showcase__cta-icon" />
              </motion.button>
            </div>
          </div>

          {/* Visual Showcase Side */}
          <div className="remote-showcase__visual">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ease: 'easeOut' }}
              className="remote-showcase__visual-wrapper"
            >
              {/* Submission Form Mockup */}
              <div className="remote-showcase__mockup">
                <div className="remote-showcase__mockup-header">
                  <div className="remote-showcase__mockup-header-row">
                    <h4 className="remote-showcase__mockup-title">{t('remoteShowcase.mockup.title')}</h4>
                  </div>
                  <div className="remote-showcase__mockup-stats">
                    <div className="remote-showcase__mockup-stat">
                      <p className="remote-showcase__mockup-stat-label">{t('remoteShowcase.mockup.price_label')}</p>
                      <p className="remote-showcase__mockup-stat-value">{t('remoteShowcase.mockup.price_value')}</p>
                    </div>
                    <div className="remote-showcase__mockup-stat">
                      <p className="remote-showcase__mockup-stat-label">{t('remoteShowcase.mockup.delivery_label')}</p>
                      <p className="remote-showcase__mockup-stat-value">{t('remoteShowcase.mockup.delivery_value')}</p>
                    </div>
                  </div>
                </div>

                <div className="remote-showcase__mockup-body">
                  <div className="remote-showcase__mockup-field">
                    <label className="remote-showcase__mockup-label">
                      {t('remoteShowcase.mockup.project_description_label')}
                    </label>
                    <div className="remote-showcase__mockup-textarea">
                      {t('remoteShowcase.mockup.project_description_placeholder')}
                    </div>
                  </div>
                  <div className="remote-showcase__mockup-field">
                    <label className="remote-showcase__mockup-label">{t('remoteShowcase.mockup.references_label')}</label>
                    <div className="remote-showcase__mockup-input">{t('remoteShowcase.mockup.references_placeholder')}</div>
                  </div>
                  <div className="remote-showcase__mockup-actions">
                    <div className="remote-showcase__mockup-btn remote-showcase__mockup-btn--cancel">
                      {t('remoteShowcase.mockup.cancel_btn')}
                    </div>
                    <div className="remote-showcase__mockup-btn remote-showcase__mockup-btn--submit">
                      {t('remoteShowcase.mockup.submit_btn')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Background Circles */}
              <div className="remote-showcase__deco-circle remote-showcase__deco-circle--outer" />
              <div className="remote-showcase__deco-circle remote-showcase__deco-circle--inner" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Stats Grid */}
        <div className="remote-showcase__stats">
          {STAT_KEYS.map((key) => (
            <div key={key} className="remote-showcase__stat">
              <p className="remote-showcase__stat-label">{t(`remoteShowcase.stats.${key}.label`)}</p>
              <p className="remote-showcase__stat-value">{t(`remoteShowcase.stats.${key}.value`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudioZOwnersRemoteShowcase;
