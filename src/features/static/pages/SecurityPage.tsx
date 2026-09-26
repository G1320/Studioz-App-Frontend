import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  ArrowForwardIcon,
  CancelIcon,
  CheckCircleIcon
} from '@shared/components/icons';
import '../styles/_enterprise-page.scss';

const SecurityPage: React.FC = () => {
  const { t, i18n } = useTranslation('security');
  const isRtl = i18n.language === 'he';

  const tokenizationPoints = [
    t('payment.tokenization.points.directToGateway'),
    t('payment.tokenization.points.singleUseToken'),
    t('payment.tokenization.points.zeroExposure'),
    t('payment.tokenization.points.tlsEncryption')
  ];

  const storagePoints = [
    t('payment.storage.points.licensedProcessors'),
    t('payment.storage.points.referenceIds'),
    t('payment.storage.points.lastFourOnly'),
    t('payment.storage.points.securityAudits')
  ];

  const storedData = [
    t('dataMatrix.stored.customerInfo'),
    t('dataMatrix.stored.lastFourDigits'),
    t('dataMatrix.stored.paymentRefId'),
    t('dataMatrix.stored.invoiceRecords')
  ];

  const neverStoredData = [
    t('dataMatrix.neverStored.fullCardNumbers'),
    t('dataMatrix.neverStored.cvv'),
    t('dataMatrix.neverStored.expirationDates'),
    t('dataMatrix.neverStored.rawCredentials')
  ];

  const invoiceFeatures = [
    {
      title: t('invoicing.features.tokenAuth.title'),
      description: t('invoicing.features.tokenAuth.description')
    },
    {
      title: t('invoicing.features.webhooks.title'),
      description: t('invoicing.features.webhooks.description')
    },
    {
      title: t('invoicing.features.auditTrail.title'),
      description: t('invoicing.features.auditTrail.description')
    }
  ];

  return (
    <div className="enterprise-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{t('meta.title', 'Security | Studioz')}</title>
        <meta
          name="description"
          content={t(
            'meta.description',
            'How Studioz protects payments and customer data with tokenization and PCI-compliant processors.'
          )}
        />
      </Helmet>

      <header className="enterprise-page__header">
        <div className="enterprise-page__container">
          <p className="enterprise-page__kicker">{t('hero.badge', 'Security & Compliance')}</p>
          <h1 className="enterprise-page__title">
            {t('hero.title.line1')}{' '}
            <span className="enterprise-page__title-accent">{t('hero.title.line2')}</span>
          </h1>
          <p className="enterprise-page__subtitle">{t('hero.subtitle')}</p>
        </div>
      </header>

      <div className="enterprise-page__main">
        <div className="enterprise-page__container">
          <section className="enterprise-page__section">
            <p className="enterprise-page__section-kicker">{t('payment.kicker', 'Payments')}</p>
            <h2 className="enterprise-page__section-title">{t('payment.title')}</h2>
            <p className="enterprise-page__section-text">{t('payment.subtitle')}</p>
            <div className="enterprise-page__panel">
              <div className="enterprise-page__panel-grid">
                <div className="enterprise-page__cell">
                  <h3 className="enterprise-page__cell-title">{t('payment.tokenization.title')}</h3>
                  <p className="enterprise-page__cell-text">{t('payment.tokenization.description')}</p>
                  <ul className="enterprise-page__list enterprise-page__list--spaced">
                    {tokenizationPoints.map((point) => (
                      <li key={point} className="enterprise-page__list-item">
                        <CheckCircleIcon className="enterprise-page__list-mark" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="enterprise-page__cell">
                  <h3 className="enterprise-page__cell-title">{t('payment.storage.title')}</h3>
                  <p className="enterprise-page__cell-text">{t('payment.storage.description')}</p>
                  <ul className="enterprise-page__list enterprise-page__list--spaced">
                    {storagePoints.map((point) => (
                      <li key={point} className="enterprise-page__list-item">
                        <CheckCircleIcon className="enterprise-page__list-mark" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="enterprise-page__section">
            <p className="enterprise-page__section-kicker">{t('dataMatrix.kicker', 'Data')}</p>
            <h2 className="enterprise-page__section-title">{t('dataMatrix.title')}</h2>
            <p className="enterprise-page__section-text">{t('dataMatrix.subtitle')}</p>
            <div className="enterprise-page__matrix">
              <div className="enterprise-page__matrix-col">
                <p className="enterprise-page__matrix-label enterprise-page__matrix-label--ok">
                  <CheckCircleIcon />
                  <span>{t('dataMatrix.whatWeStore')}</span>
                </p>
                <ul className="enterprise-page__list">
                  {storedData.map((item) => (
                    <li key={item} className="enterprise-page__list-item">
                      <CheckCircleIcon className="enterprise-page__list-mark" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="enterprise-page__matrix-col">
                <p className="enterprise-page__matrix-label enterprise-page__matrix-label--no">
                  <CancelIcon />
                  <span>{t('dataMatrix.whatWeNeverStore')}</span>
                </p>
                <ul className="enterprise-page__list">
                  {neverStoredData.map((item) => (
                    <li key={item} className="enterprise-page__list-item">
                      <CancelIcon className="enterprise-page__list-mark enterprise-page__list-mark--danger" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="enterprise-page__section">
            <p className="enterprise-page__section-kicker">{t('invoicing.kicker', 'Invoicing')}</p>
            <h2 className="enterprise-page__section-title">{t('invoicing.title')}</h2>
            <p className="enterprise-page__section-text">{t('invoicing.subtitle')}</p>
            <div className="enterprise-page__feature-rows">
              {invoiceFeatures.map((feature) => (
                <div key={feature.title} className="enterprise-page__feature-row">
                  <h3 className="enterprise-page__feature-title">{feature.title}</h3>
                  <p className="enterprise-page__feature-text">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="enterprise-page__cta">
            <div>
              <h2 className="enterprise-page__cta-title">{t('cta.title')}</h2>
              <p className="enterprise-page__cta-text">{t('cta.subtitle')}</p>
            </div>
            <a href="mailto:admin@studioz.co.il" className="enterprise-page__cta-button">
              <span>{t('cta.button')}</span>
              <ArrowForwardIcon />
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
