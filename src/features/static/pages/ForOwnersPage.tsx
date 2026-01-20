import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import {
  CalendarIcon,
  CreditCardIcon,
  PublicIcon,
  CheckCircleIcon,
  ArrowForwardIcon,
  ClockIcon,
  DashboardIcon,
  PeopleIcon,
  CloseIcon
} from '@shared/components/icons';
import { GenericModal } from '@shared/components/modal';
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
  const { t } = useTranslation('forOwners');
  const navigate = useLanguageNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleListStudio = () => {
    navigate('/studio/create');
  };

  const handleViewDemo = () => {
    navigate('/how-it-works');
  };

  // const stats = [
  //   { label: t('stats.active_studios'), value: '500+' },
  //   { label: t('stats.monthly_bookings'), value: '2.5k+' },
  //   { label: t('stats.owner_earnings'), value: '₪2M+' },
  //   { label: t('stats.cities'), value: '15+' }
  // ];

  const features = [
    {
      icon: <CalendarIcon />,
      title: t('features.booking.title'),
      description: t('features.booking.description'),
      colorClass: 'owners-feature--primary'
    },
    {
      icon: <ClockIcon />,
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
      colorClass: 'owners-feature--orange'
    }
  ];

  const studioFeatures = [
    t('studio_preview.feature1'),
    // t('studio_preview.feature2'),
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
                <button className="owners-btn owners-btn--primary" onClick={handleListStudio} type="button">
                  {t('hero.cta_primary')} <ArrowForwardIcon />
                </button>
                {/* <button className="owners-btn owners-btn--secondary" onClick={handleViewDemo} type="button">
                  {t('hero.cta_secondary')}
                </button> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="owners-stats">
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
      </section> */}

      {/* Dashboard Preview Section */}
      <section className="owners-dashboard">
        <div className="owners-container">
          <div className="owners-dashboard__browser">
            {/* macOS-style browser chrome */}
            <div className="owners-dashboard__browser-header">
              <div className="owners-dashboard__browser-dots">
                <span className="owners-dashboard__dot owners-dashboard__dot--red" />
                <span className="owners-dashboard__dot owners-dashboard__dot--yellow" />
                <span className="owners-dashboard__dot owners-dashboard__dot--green" />
              </div>
            </div>
            {/* Video content */}
            <div className="owners-dashboard__browser-content">
              <iframe
                src="https://player.mediadelivery.net/embed/583287/331d0d73-1047-442a-95f7-40b59db09f5e?autoplay=true&loop=true&muted=true&preload=true&playsinline=true&showSpeed=false&showCaptions=false&showHeatmap=false&showPlaylist=false&showShareButton=false"
                loading="lazy"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                className="owners-dashboard__video"
                title={t('dashboard.title')}
              />
            </div>
          </div>
          {/* Text overlay below */}
          <div className="owners-dashboard__text">
            <h3>{t('dashboard.title')}</h3>
            <p>{t('dashboard.description')}</p>
          </div>
        </div>
      </section>

      {/* Asset Showcase Section */}
      <section className="owners-showcase">
        <div className="owners-container">
          <div className="owners-showcase__grid">
            {/* Text Content */}
            <div className="owners-showcase__text">
              <h2 className="owners-showcase__title">
                {t('showcase.title_part1')} <span className="owners-hero__accent">{t('showcase.title_accent')}</span>
                <br />
                {t('showcase.title_part2')}
              </h2>
              <p className="owners-showcase__description">{t('showcase.description')}</p>

              <div className="owners-showcase__features">
                <div className="owners-showcase__feature-card">
                  <div className="owners-showcase__feature-icon owners-showcase__feature-icon--primary">
                    <DashboardIcon />
                  </div>
                  <div className="owners-showcase__feature-content">
                    <h4>{t('showcase.feature1_title')}</h4>
                    <p>{t('showcase.feature1_description')}</p>
                  </div>
                </div>

                <div className="owners-showcase__feature-card">
                  <div className="owners-showcase__feature-icon owners-showcase__feature-icon--blue">
                    <PublicIcon />
                  </div>
                  <div className="owners-showcase__feature-content">
                    <h4>{t('showcase.feature2_title')}</h4>
                    <p>{t('showcase.feature2_description')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshots Grid */}
            <div className="owners-showcase__images">
              <div className="owners-showcase__images-glow" />
              <div className="owners-showcase__images-grid">
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  className="owners-showcase__image-wrapper"
                  onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Page-Dark-1-V1.webp')}
                >
                  <img
                    src="/images/optimized/Studioz-Studio-Page-Dark-1-V1.webp"
                    alt="Studio Page Dark Mode 1"
                    loading="lazy"
                  />
                  <div className="owners-showcase__image-overlay">
                    <span>{t('showcase.view_original')}</span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  className="owners-showcase__image-wrapper"
                  onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Page-Dark-2-V1.webp')}
                >
                  <img
                    src="/images/optimized/Studioz-Studio-Page-Dark-2-V1.webp"
                    alt="Studio Page Dark Mode 2"
                    loading="lazy"
                  />
                  <div className="owners-showcase__image-overlay">
                    <span>{t('showcase.view_original')}</span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  className="owners-showcase__image-wrapper"
                  onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Page-light-1-V1.webp')}
                >
                  <img
                    src="/images/optimized/Studioz-Studio-Page-light-1-V1.webp"
                    alt="Studio Page Light Mode 1"
                    loading="lazy"
                  />
                  <div className="owners-showcase__image-overlay">
                    <span>{t('showcase.view_original')}</span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  className="owners-showcase__image-wrapper"
                  onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Page-light-2-V1.webp')}
                >
                  <img
                    src="/images/optimized/Studioz-Studio-Page-light-2-V1.webp"
                    alt="Studio Page Light Mode 2"
                    loading="lazy"
                  />
                  <div className="owners-showcase__image-overlay">
                    <span>{t('showcase.view_original')}</span>
                  </div>
                </motion.div>
              </div>
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
            <button
              className="owners-btn owners-btn--primary owners-btn--large"
              onClick={handleListStudio}
              type="button"
            >
              {t('cta.button')}
            </button>
            <p className="owners-cta__note">{t('cta.note')}</p>
          </div>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      <GenericModal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        className="owners-lightbox"
        ariaLabel="Image preview"
      >
        <div className="owners-lightbox__content">
          <button
            className="owners-lightbox__close"
            onClick={() => setSelectedImage(null)}
            type="button"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Studio page preview"
              className="owners-lightbox__image"
            />
          )}
        </div>
      </GenericModal>
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
