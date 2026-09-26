import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowForwardIcon } from '@shared/components/icons';
import '../styles/_enterprise-page.scss';

const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation('about');
  const isRtl = i18n.language === 'he';

  const values = ['transparency', 'quality', 'simplicity', 'fairness'] as const;
  const steps = [
    { key: 'step1', number: '01' },
    { key: 'step2', number: '02' },
    { key: 'step3', number: '03' }
  ] as const;

  return (
    <div className="enterprise-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <header className="enterprise-page__header">
        <div className="enterprise-page__container">
          <p className="enterprise-page__kicker">{t('hero.kicker', 'About')}</p>
          <h1 className="enterprise-page__title">
            {t('hero.title')}{' '}
            <span className="enterprise-page__title-accent">{t('hero.titleAccent')}</span>
          </h1>
          <p className="enterprise-page__subtitle">{t('hero.subtitle')}</p>
        </div>
      </header>

      <div className="enterprise-page__main">
        <div className="enterprise-page__container">
          <section className="enterprise-page__section">
            <p className="enterprise-page__section-kicker">{t('mission.kicker', 'Mission')}</p>
            <h2 className="enterprise-page__section-title">{t('mission.title')}</h2>
            <p className="enterprise-page__section-text">{t('mission.description')}</p>
            <div className="enterprise-page__panel">
              <div className="enterprise-page__panel-grid">
                {(['point1', 'point2'] as const).map((key) => (
                  <div key={key} className="enterprise-page__cell">
                    <h3 className="enterprise-page__cell-title">{t(`mission.${key}.title`)}</h3>
                    <p className="enterprise-page__cell-text">{t(`mission.${key}.description`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="enterprise-page__section">
            <p className="enterprise-page__section-kicker">{t('values.kicker', 'Principles')}</p>
            <h2 className="enterprise-page__section-title">{t('values.title')}</h2>
            <div className="enterprise-page__panel">
              <div className="enterprise-page__panel-grid enterprise-page__panel-grid--4">
                {values.map((key) => (
                  <div key={key} className="enterprise-page__cell">
                    <h3 className="enterprise-page__cell-title">{t(`values.${key}.title`)}</h3>
                    <p className="enterprise-page__cell-text">{t(`values.${key}.description`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="enterprise-page__section">
            <p className="enterprise-page__section-kicker">{t('howItWorks.kicker', 'Workflow')}</p>
            <h2 className="enterprise-page__section-title">{t('howItWorks.title')}</h2>
            <div className="enterprise-page__steps">
              {steps.map(({ key, number }) => (
                <div key={key} className="enterprise-page__step">
                  <span className="enterprise-page__step-num">{number}</span>
                  <div>
                    <h3 className="enterprise-page__step-title">{t(`howItWorks.${key}.title`)}</h3>
                    <p className="enterprise-page__step-text">{t(`howItWorks.${key}.description`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="enterprise-page__cta">
            <div>
              <h2 className="enterprise-page__cta-title">{t('contact.title')}</h2>
              <p className="enterprise-page__cta-text">{t('contact.description')}</p>
            </div>
            <a href={`mailto:${t('contact.email')}`} className="enterprise-page__cta-button">
              <span>{t('contact.button')}</span>
              <ArrowForwardIcon />
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
