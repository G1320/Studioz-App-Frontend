import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import {
  CalendarIcon,
  CreditCardIcon,
  PublicIcon,
  ArrowForwardIcon,
  ClockIcon,
  DashboardIcon,
  PeopleIcon,
  CloseIcon
} from '@shared/components/icons';
import { GenericModal } from '@shared/components/modal';
import { PricingSection } from '../components/PricingSection';
import { ScrollDrivenShowcase } from '../components/ScrollDrivenShowcase';
import { ScheduleControlSection } from '../components/ScheduleControlSection';
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

  // const studioFeatures = [
  //   t('studio_preview.feature1'),
  //   // t('studio_preview.feature2'),
  //   t('studio_preview.feature3'),
  //   t('studio_preview.feature4'),
  //   t('studio_preview.feature5')
  // ];

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
          <div className="owners-dashboard__card">
            {/* Browser mockup */}
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
                  src="https://player.mediadelivery.net/embed/583287/c555da73-b4c4-4a47-a98f-b6c098fef525?autoplay=true&loop=true&muted=true&preload=true&playsinline=true&showSpeed=false&showCaptions=false&showHeatmap=false&showPlaylist=false&showShareButton=false"
                  loading="lazy"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  className="owners-dashboard__video"
                  title={t('dashboard.title')}
                />
              </div>
            </div>
            {/* Text inside card */}
            <div className="owners-dashboard__text">
              <h3>{t('dashboard.title')}</h3>
              <p>{t('dashboard.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll-Driven Feature Showcase */}
      <ScrollDrivenShowcase />

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

            {/* Mobile Screenshots Grid */}
            <div className="owners-showcase__images owners-showcase__images--mobile">
              <div className="owners-showcase__images-glow" />
              <div className="owners-showcase__images-grid">
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  className="owners-showcase__image-wrapper owners-showcase__image-wrapper--mobile"
                  onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Details-1-Dark.webp')}
                >
                  <img
                    src="/images/optimized/Studioz-Studio-Details-1-Dark.webp"
                    alt="Studio Details Dark Mode 1"
                    loading="lazy"
                  />
                  <div className="owners-showcase__image-overlay">
                    <span>{t('showcase.view_original')}</span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  className="owners-showcase__image-wrapper owners-showcase__image-wrapper--mobile"
                  onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Details-2-Dark.webp')}
                >
                  <img
                    src="/images/optimized/Studioz-Studio-Details-2-Dark.webp"
                    alt="Studio Details Dark Mode 2"
                    loading="lazy"
                  />
                  <div className="owners-showcase__image-overlay">
                    <span>{t('showcase.view_original')}</span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  className="owners-showcase__image-wrapper owners-showcase__image-wrapper--mobile"
                  onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Details-1-Light.webp')}
                >
                  <img
                    src="/images/optimized/Studioz-Studio-Details-1-Light.webp"
                    alt="Studio Details Light Mode 1"
                    loading="lazy"
                  />
                  <div className="owners-showcase__image-overlay">
                    <span>{t('showcase.view_original')}</span>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  className="owners-showcase__image-wrapper owners-showcase__image-wrapper--mobile"
                  onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Detail-2-Light.webp')}
                >
                  <img
                    src="/images/optimized/Studioz-Studio-Detail-2-Light.webp"
                    alt="Studio Details Light Mode 2"
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

      {/* Schedule Control Section */}
      <ScheduleControlSection />

      {/* Pricing Section */}
      <PricingSection />

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
        <div 
          className="owners-lightbox__content"
          onClick={() => setSelectedImage(null)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Escape' && setSelectedImage(null)}
        >
          {/* Background overlay */}
          <div className="owners-lightbox__backdrop" aria-hidden="true" />
          <button
            className="owners-lightbox__close"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
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
