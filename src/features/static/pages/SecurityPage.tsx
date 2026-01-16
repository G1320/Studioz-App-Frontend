/**
 * StudioZ Security Page
 *
 * A comprehensive trust and security page for StudioZ.
 * Explains PCI compliance through providers, tokenization, and data storage policies.
 */

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import {
  ShieldIcon,
  LockIcon,
  CreditCardIcon,
  FileTextIcon,
  CheckCircleIcon,
  CancelIcon,
  ArrowForwardIcon,
  FingerprintIcon,
  PublicIcon,
  StorageIcon
} from '@shared/components/icons';
import '../styles/_security-page.scss';

/**
 * Animation variants for Framer Motion
 */
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

/**
 * Section Header Component
 */
interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, subtitle }) => (
  <div className="security-section-header">
    <div className="security-section-header__title-row">
      <div className="security-section-header__icon">{icon}</div>
      <h2 className="security-section-header__title">{title}</h2>
    </div>
    <p className="security-section-header__subtitle">{subtitle}</p>
  </div>
);

/**
 * Security Card Component
 */
interface SecurityCardProps {
  title: string;
  description: string;
  points: string[];
}

const SecurityCard: React.FC<SecurityCardProps> = ({ title, description, points }) => (
  <motion.div whileHover={{ y: -5 }} className="security-card">
    <h3 className="security-card__title">{title}</h3>
    <p className="security-card__description">{description}</p>
    <ul className="security-card__points">
      {points.map((point, i) => (
        <li key={i} className="security-card__point">
          <CheckCircleIcon className="security-card__point-icon" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

/**
 * Feature Highlight Component
 */
interface FeatureHighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({ icon, title, description }) => (
  <div className="security-feature">
    <div className="security-feature__icon">{icon}</div>
    <div className="security-feature__content">
      <h4 className="security-feature__title">{title}</h4>
      <p className="security-feature__description">{description}</p>
    </div>
  </div>
);

/**
 * Data Item Component
 */
interface DataItemProps {
  text: string;
  stored: boolean;
}

const DataItem: React.FC<DataItemProps> = ({ text, stored }) => (
  <div className={`security-data-item ${stored ? 'security-data-item--stored' : 'security-data-item--not-stored'}`}>
    <span>{text}</span>
    {stored ? (
      <CheckCircleIcon className="security-data-item__icon security-data-item__icon--success" />
    ) : (
      <CancelIcon className="security-data-item__icon security-data-item__icon--danger" />
    )}
  </div>
);

/**
 * Main Security Page Component
 */
const SecurityPage: React.FC = () => {
  const { t } = useTranslation('security');
  const navigate = useLanguageNavigate();

  const handleContactSecurity = () => {
    // Navigate to contact or open email
    window.location.href = 'mailto:security@studioz.co.il';
  };

  // Data we store
  const storedData = [
    t('dataMatrix.stored.customerInfo'),
    t('dataMatrix.stored.lastFourDigits'),
    t('dataMatrix.stored.paymentRefId'),
    t('dataMatrix.stored.invoiceRecords')
  ];

  // Data we never store
  const neverStoredData = [
    t('dataMatrix.neverStored.fullCardNumbers'),
    t('dataMatrix.neverStored.cvv'),
    t('dataMatrix.neverStored.expirationDates'),
    t('dataMatrix.neverStored.rawCredentials')
  ];

  // Payment security points
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

  return (
    <div className="security-page">
      {/* Hero Section */}
      <section className="security-hero">
        <div className="security-hero__background">
          <div className="security-hero__glow security-hero__glow--primary" />
          <div className="security-hero__glow security-hero__glow--secondary" />
        </div>

        <div className="security-hero__content">
          <motion.div {...fadeInUp} className="security-hero__badge">
            <ShieldIcon />
            <span>{t('hero.badge')}</span>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="security-hero__title"
          >
            {t('hero.title.line1')} <br />
            <span className="security-hero__title--highlight">{t('hero.title.line2')}</span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="security-hero__subtitle"
          >
            {t('hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className="security-main">
        {/* Payment Security Section */}
        <section className="security-section">
          <SectionHeader
            icon={<LockIcon />}
            title={t('payment.title')}
            subtitle={t('payment.subtitle')}
          />

          <div className="security-cards-grid">
            <SecurityCard
              title={t('payment.tokenization.title')}
              description={t('payment.tokenization.description')}
              points={tokenizationPoints}
            />
            <SecurityCard
              title={t('payment.storage.title')}
              description={t('payment.storage.description')}
              points={storagePoints}
            />
          </div>
        </section>

        {/* Data Matrix Section */}
        <section className="security-section">
          <div className="security-data-matrix">
            <div className="security-data-matrix__header">
              <h2 className="security-data-matrix__title">{t('dataMatrix.title')}</h2>
              <p className="security-data-matrix__subtitle">{t('dataMatrix.subtitle')}</p>
            </div>

            <div className="security-data-matrix__grid">
              <div className="security-data-matrix__column">
                <div className="security-data-matrix__label security-data-matrix__label--success">
                  <CheckCircleIcon />
                  <span>{t('dataMatrix.whatWeStore')}</span>
                </div>
                <div className="security-data-matrix__items">
                  {storedData.map((item) => (
                    <DataItem key={item} text={item} stored={true} />
                  ))}
                </div>
              </div>

              <div className="security-data-matrix__column">
                <div className="security-data-matrix__label security-data-matrix__label--danger">
                  <CancelIcon />
                  <span>{t('dataMatrix.whatWeNeverStore')}</span>
                </div>
                <div className="security-data-matrix__items">
                  {neverStoredData.map((item) => (
                    <DataItem key={item} text={item} stored={false} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Invoicing Section */}
        <section className="security-section security-section--narrow">
          <SectionHeader
            icon={<FileTextIcon />}
            title={t('invoicing.title')}
            subtitle={t('invoicing.subtitle')}
          />

          <div className="security-features">
            <FeatureHighlight
              icon={<FingerprintIcon />}
              title={t('invoicing.features.tokenAuth.title')}
              description={t('invoicing.features.tokenAuth.description')}
            />
            <FeatureHighlight
              icon={<PublicIcon />}
              title={t('invoicing.features.webhooks.title')}
              description={t('invoicing.features.webhooks.description')}
            />
            <FeatureHighlight
              icon={<StorageIcon />}
              title={t('invoicing.features.auditTrail.title')}
              description={t('invoicing.features.auditTrail.description')}
            />
          </div>
        </section>
      </main>

      {/* CTA Footer */}
      <footer className="security-footer">
        <div className="security-footer__card">
          <div className="security-footer__content">
            <h2 className="security-footer__title">{t('cta.title')}</h2>
            <p className="security-footer__subtitle">{t('cta.subtitle')}</p>
          </div>
          <button onClick={handleContactSecurity} className="security-footer__button">
            <span>{t('cta.button')}</span>
            <ArrowForwardIcon />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default SecurityPage;
