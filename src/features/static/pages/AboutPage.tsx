import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  ArrowForwardIcon,
  VisibilityIcon,
  AutoAwesomeIcon,
  SpeedIcon,
  BalanceIcon,
  SearchIcon,
  CalendarIcon,
  MicIcon
} from '@shared/components/icons';
import '../styles/_info-pages.scss';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};

const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation('about');
  const isRtl = i18n.language === 'he';

  const values = [
    { key: 'transparency', icon: <VisibilityIcon /> },
    { key: 'quality', icon: <AutoAwesomeIcon /> },
    { key: 'simplicity', icon: <SpeedIcon /> },
    { key: 'fairness', icon: <BalanceIcon /> }
  ];

  const steps = [
    { key: 'step1', icon: <SearchIcon />, number: '01' },
    { key: 'step2', icon: <CalendarIcon />, number: '02' },
    { key: 'step3', icon: <MicIcon />, number: '03' }
  ];

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
            {t('hero.title')} <br />
            <span className="info-page__accent">{t('hero.titleAccent')}</span>
          </motion.h1>
          <motion.p className="info-page__hero-subtitle" {...fadeInUp} transition={{ delay: 0.1 }}>
            {t('hero.subtitle')}
          </motion.p>
        </div>
      </section>

      <main className="info-page__main">
        {/* Mission */}
        <section className="info-page__section">
          <div className="info-page__container">
            <motion.h2 className="info-page__section-title" {...fadeInUp}>
              {t('mission.title')}
            </motion.h2>
            <motion.p className="info-page__section-description" {...fadeInUp} transition={{ delay: 0.1 }}>
              {t('mission.description')}
            </motion.p>
            <div className="info-page__cards-grid info-page__cards-grid--two">
              {['point1', 'point2'].map((key, i) => (
                <motion.div
                  key={key}
                  className="info-page__card"
                  {...fadeInUp}
                  transition={{ delay: i * 0.1 }}
                >
                  <h3 className="info-page__card-title">{t(`mission.${key}.title`)}</h3>
                  <p className="info-page__card-description">{t(`mission.${key}.description`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="info-page__section">
          <div className="info-page__container">
            <motion.h2 className="info-page__section-title" {...fadeInUp}>
              {t('values.title')}
            </motion.h2>
            <div className="info-page__cards-grid info-page__cards-grid--four">
              {values.map(({ key, icon }, i) => (
                <motion.div
                  key={key}
                  className="info-page__value-card"
                  {...fadeInUp}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="info-page__value-icon">{icon}</div>
                  <h3 className="info-page__value-title">{t(`values.${key}.title`)}</h3>
                  <p className="info-page__value-description">{t(`values.${key}.description`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="info-page__section">
          <div className="info-page__container">
            <motion.h2 className="info-page__section-title" {...fadeInUp}>
              {t('howItWorks.title')}
            </motion.h2>
            <div className="info-page__steps">
              {steps.map(({ key, icon, number }, i) => (
                <motion.div
                  key={key}
                  className="info-page__step"
                  {...fadeInUp}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="info-page__step-number">{number}</div>
                  <div className="info-page__step-icon">{icon}</div>
                  <h3 className="info-page__step-title">{t(`howItWorks.${key}.title`)}</h3>
                  <p className="info-page__step-description">{t(`howItWorks.${key}.description`)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Contact CTA */}
      <footer className="info-page__footer">
        <div className="info-page__container">
          <div className="info-page__cta-card">
            <div className="info-page__cta-content">
              <h2 className="info-page__cta-title">{t('contact.title')}</h2>
              <p className="info-page__cta-description">{t('contact.description')}</p>
            </div>
            <a href={`mailto:${t('contact.email')}`} className="info-page__cta-button">
              <span>{t('contact.button')}</span>
              <ArrowForwardIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
