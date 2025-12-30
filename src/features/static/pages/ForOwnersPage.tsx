import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PublicIcon from '@mui/icons-material/Public';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import '../styles/_for-owners-page.scss';

/**
 * Animation variants for Framer Motion
 */
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

/**
 * Main Owners Page Component for Studioz
 */
const ForOwnersPage: React.FC = () => {
  const { t, i18n } = useTranslation('forOwners');
  const navigate = useLanguageNavigate();

  const handleListStudio = () => {
    navigate('/create-studio');
  };

  const handleViewDemo = () => {
    navigate('/studios');
  };

  const stats = [
    { label: t('stats.active_studios'), value: '500+' },
    { label: t('stats.monthly_bookings'), value: '2.5k+' },
    { label: t('stats.owner_earnings'), value: '₪2M+' },
    { label: t('stats.cities'), value: '15+' }
  ];

  const features = [
    {
      icon: <CalendarMonthIcon />,
      title: t('features.booking.title'),
      description: t('features.booking.description'),
      colorClass: 'owners-feature--primary'
    },
    {
      icon: <AccessTimeIcon />,
      title: t('features.calendar.title'),
      description: t('features.calendar.description'),
      colorClass: 'owners-feature--blue'
    },
    {
      icon: <DashboardIcon />,
      title: t('features.page.title'),
      description: t('features.page.description'),
      colorClass: 'owners-feature--purple'
    },
    {
      icon: <PublicIcon />,
      title: t('features.exposure.title'),
      description: t('features.exposure.description'),
      colorClass: 'owners-feature--emerald'
    },
    {
      icon: <PeopleIcon />,
      title: t('features.crm.title'),
      description: t('features.crm.description'),
      colorClass: 'owners-feature--pink'
    },
    {
      icon: <CreditCardIcon />,
      title: t('features.payments.title'),
      description: t('features.payments.description'),
      colorClass: 'owners-feature--orange',
      badge: t('features.payments.badge')
    }
  ];

  const studioFeatures = [
    t('studio_preview.feature1'),
    t('studio_preview.feature2'),
    t('studio_preview.feature3'),
    t('studio_preview.feature4'),
    t('studio_preview.feature5')
  ];

  return (
    <div className="owners-page">
      {/* Hero Section */}
      <section className="owners-hero">
        <div className="owners-hero__glow owners-hero__glow--primary" />
        <div className="owners-hero__glow owners-hero__glow--blue" />

        <div className="owners-container">
          <div className="owners-hero__content">
            <motion.div {...fadeInUp} transition={{ duration: 0.6 }}>
              <h1 className="owners-hero__title">
                {t('hero.title_part1')} <br />
                <span className="owners-hero__accent">{t('hero.title_accent')}</span>
              </h1>
              <p className="owners-hero__description">{t('hero.description')}</p>
              <div className="owners-hero__buttons">
                <button
                  className="owners-btn owners-btn--primary"
                  onClick={handleListStudio}
                  type="button"
                >
                  {t('hero.cta_primary')} <ArrowForwardIcon />
                </button>
                <button
                  className="owners-btn owners-btn--secondary"
                  onClick={handleViewDemo}
                  type="button"
                >
                  {t('hero.cta_secondary')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="owners-stats">
        <div className="owners-container">
          <div className="owners-stats__grid">
            {stats.map((stat, i) => (
              <div key={i} className="owners-stat">
                <div className="owners-stat__value">{stat.value}</div>
                <div className="owners-stat__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="owners-dashboard">
        <div className="owners-container">
          <div className="owners-dashboard__mockup">
            <div className="owners-dashboard__inner">
              <div className="owners-dashboard__content">
                {/* Header */}
                <div className="owners-dashboard__header">
                  <div className="owners-dashboard__tabs">
                    <div className="owners-dashboard__tab owners-dashboard__tab--active" />
                    <div className="owners-dashboard__tab" />
                  </div>
                  <div className="owners-dashboard__actions">
                    <div className="owners-dashboard__action owners-dashboard__action--primary" />
                    <div className="owners-dashboard__action" />
                  </div>
                </div>
                {/* Calendar Grid */}
                <div className="owners-dashboard__calendar">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="owners-dashboard__cell">
                      {i === 12 && (
                        <div className="owners-dashboard__event owners-dashboard__event--primary">
                          <span>{t('dashboard.event1_title')}</span>
                          <small>{t('dashboard.event1_time')}</small>
                        </div>
                      )}
                      {i === 15 && (
                        <div className="owners-dashboard__event owners-dashboard__event--blue">
                          <span>{t('dashboard.event2_title')}</span>
                          <small>{t('dashboard.event2_time')}</small>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Overlay */}
            <div className="owners-dashboard__overlay">
              <h3>{t('dashboard.title')}</h3>
              <p>{t('dashboard.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="owners-features">
        <div className="owners-container">
          <div className="owners-features__header">
            <h2 className="owners-section-title">{t('features.title')}</h2>
            <p className="owners-section-subtitle">{t('features.subtitle')}</p>
          </div>

          <div className="owners-features__grid">
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                colorClass={feature.colorClass}
                badge={feature.badge}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Studio Preview Section */}
      <section className="owners-preview">
        <div className="owners-container">
          <div className="owners-preview__content">
            <div className="owners-preview__text">
              <h2 className="owners-section-title">
                {t('studio_preview.title_part1')} <br />
                <span className="owners-hero__accent">{t('studio_preview.title_accent')}</span>
              </h2>
              <p className="owners-preview__description">{t('studio_preview.description')}</p>
              <ul className="owners-preview__list">
                {studioFeatures.map((item, i) => (
                  <li key={i}>
                    <CheckCircleIcon />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="owners-preview__link" onClick={handleViewDemo} type="button">
                {t('studio_preview.cta')} <ArrowForwardIcon />
              </button>
            </div>
            <div className="owners-preview__image-wrapper">
              <div className="owners-preview__glow" />
              <img
                src="https://pquxfbbxflqvtidtlrhl.supabase.co/storage/v1/object/public/hmac-uploads/brand/91893494-7bbb-41d7-99cc-7cc9c8d44ebc/assets/17f74143-c16b-4ec8-9977-28fe1929edaf.jpg"
                alt="Studio Page Example"
                className="owners-preview__image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="owners-cta">
        <div className="owners-cta__overlay" />
        <div className="owners-container">
          <div className="owners-cta__content">
            <h2 className="owners-cta__title">{t('cta.title')}</h2>
            <p className="owners-cta__description">{t('cta.description')}</p>
            <button className="owners-btn owners-btn--primary owners-btn--large" onClick={handleListStudio} type="button">
              {t('cta.button')}
            </button>
            <p className="owners-cta__note">{t('cta.note')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="owners-footer">
        <div className="owners-container">
          <div className="owners-footer__content">
            <div className="owners-footer__logo">
              <img src="https://www.studioz.co.il/android-chrome-512x512.png" alt="Studioz" />
              <span>Studioz</span>
            </div>
            <div className="owners-footer__links">
              <a href={`/${i18n.language}/terms`}>{t('footer.terms')}</a>
              <a href={`/${i18n.language}/privacy`}>{t('footer.privacy')}</a>
              <a href="mailto:info@studioz.online">{t('footer.contact')}</a>
            </div>
            <div className="owners-footer__copyright">
              © {new Date().getFullYear()} Studioz. {t('footer.rights')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/**
 * Feature Card Component
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, colorClass, badge }) => {
  return (
    <div className={`owners-feature ${colorClass}`}>
      {badge && <div className="owners-feature__badge">{badge}</div>}
      <div className="owners-feature__icon">{icon}</div>
      <h3 className="owners-feature__title">{title}</h3>
      <p className="owners-feature__description">{description}</p>
    </div>
  );
};

export default ForOwnersPage;
