/**
 * StudioZOwnersRemoteShowcase
 * A marketing section for studio owners explaining the Remote Projects feature.
 * Highlights: global reach, async workflow, project management.
 * Uses the real ProjectRequestForm from ItemDetails (projects) for the visual.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { ClockIcon, MusicNoteIcon, SmsIcon, ShieldIcon, ArrowBackIcon } from '@shared/components/icons';
import { ProjectRequestForm } from '@features/entities/remote-projects/components';
import type { Item } from 'src/types/index';
import './_studioZ-owners-remote-showcase.scss';

/** Sample item so the real project request form renders with realistic pricing/delivery. */
const SAMPLE_PROJECT_ITEM: Item = {
  _id: 'for-owners-showcase-sample',
  studio: '',
  studioId: '',
  name: { en: 'Mixing (Remote)', he: 'מיקס (מרוחק)' },
  description: { en: 'Professional remote mixing service.', he: 'שירות מיקס מקצועי מרחוק.' },
  studioName: { en: '', he: '' },
  address: '',
  city: '',
  categories: [],
  subCategories: [],
  inStock: true,
  createdBy: '',
  studioImgUrl: '',
  serviceDeliveryType: 'remote',
  remoteService: true,
  projectPricing: {
    basePrice: 2200,
    depositPercentage: 50,
    estimatedDeliveryDays: 14,
    revisionsIncluded: 3
  },
  price: 2200
} as Item;

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
  const [showcaseTitle, setShowcaseTitle] = useState('');
  const [showcaseBrief, setShowcaseBrief] = useState('');
  const [showcaseLinks, setShowcaseLinks] = useState<string[]>(['']);

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

          {/* Visual Showcase Side – real project request form (same as ItemDetails for projects) */}
          <div className="remote-showcase__visual">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ease: 'easeOut' }}
              className="remote-showcase__visual-wrapper"
            >
              <div className="remote-showcase__project-form-wrap">
                <ProjectRequestForm
                  item={SAMPLE_PROJECT_ITEM}
                  title={showcaseTitle}
                  brief={showcaseBrief}
                  referenceLinks={showcaseLinks}
                  onTitleChange={setShowcaseTitle}
                  onBriefChange={setShowcaseBrief}
                  onReferenceLinksChange={setShowcaseLinks}
                />
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
