import { useTranslation } from 'react-i18next';

const BenefitsFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="benefits">
      <h3>{t('subscription.benefits.title')}</h3>
      <div className="benefit-items">
        {['freeTrial', 'noCard', 'cancelAnytime'].map((benefit) => (
          <div key={benefit} className="benefit">
            <span className="check-icon">✓</span>
            {t(`subscription.benefits.${benefit}`)}
          </div>
        ))}
      </div>
    </footer>
  );
};

export default BenefitsFooter;
