import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ExpandMoreIcon, ArrowForwardIcon } from '@shared/components/icons';
import { useLanguageNavigate } from '@shared/hooks/utils';
import '../styles/_info-pages.scss';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};

const QUESTION_KEYS = [
  'how_to_list',
  'cost_to_list',
  'how_fees_work',
  'when_get_paid',
  'invoicing',
  'multiple_studios',
  'calendar_sync',
  'availability',
  'remote_services',
  'cancellation_policy',
  'visibility',
  'support'
] as const;

interface AccordionItemProps {
  questionKey: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ questionKey, isOpen, onToggle }) => {
  const { t } = useTranslation('ownerFaq');

  return (
    <div className={`faq-accordion__item ${isOpen ? 'faq-accordion__item--open' : ''}`}>
      <button className="faq-accordion__trigger" onClick={onToggle} type="button">
        <span className="faq-accordion__question">{t(`questions.${questionKey}.q`)}</span>
        <ExpandMoreIcon className={`faq-accordion__chevron ${isOpen ? 'faq-accordion__chevron--open' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="faq-accordion__content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <p className="faq-accordion__answer">{t(`questions.${questionKey}.a`)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OwnerFaqPage: React.FC = () => {
  const { t, i18n } = useTranslation('ownerFaq');
  const isRtl = i18n.language === 'he';
  const navigate = useLanguageNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="info-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <section className="info-page__hero">
        <div className="info-page__hero-glow" />
        <div className="info-page__container">
          <motion.h1 className="info-page__hero-title" {...fadeInUp}>
            {t('hero.title')}{' '}
            <span className="info-page__accent">{t('hero.titleAccent')}</span>
          </motion.h1>
          <motion.p className="info-page__hero-subtitle" {...fadeInUp} transition={{ delay: 0.1 }}>
            {t('hero.subtitle')}
          </motion.p>
        </div>
      </section>

      <main className="info-page__main">
        <section className="info-page__section">
          <div className="info-page__container info-page__container--narrow">
            <div className="faq-accordion">
              {QUESTION_KEYS.map((key, i) => (
                <AccordionItem
                  key={key}
                  questionKey={key}
                  isOpen={openIndex === i}
                  onToggle={() => handleToggle(i)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="info-page__footer">
        <div className="info-page__container">
          <div className="info-page__cta-card">
            <div className="info-page__cta-content">
              <h2 className="info-page__cta-title">{t('cta.title')}</h2>
              <p className="info-page__cta-description">{t('cta.description')}</p>
            </div>
            <button
              className="info-page__cta-button"
              onClick={() => navigate('/studio/create')}
              type="button"
            >
              <span>{t('cta.button')}</span>
              <ArrowForwardIcon />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OwnerFaqPage;
