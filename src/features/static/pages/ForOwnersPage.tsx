import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { useTheme } from '@shared/contexts/ThemeContext';
import { trackEvent } from '@shared/utils/analytics';
import {
  ArrowForwardIcon,
  CloseIcon,
  SyncIcon,
  ShieldIcon,
  AutoAwesomeIcon,
  DashboardIcon,
  PublicIcon
} from '@shared/components/icons';
import { GenericModal } from '@shared/components/modal';
import { ThemeToggle } from '@shared/components';
import { PricingSection } from '../components/PricingSection';
import { ScrollDrivenShowcase } from '../components/ScrollDrivenShowcase';
import { ScheduleControlSection } from '../components/ScheduleControlSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { StudioZOwnersRemoteShowcase } from '../components/StudioZOwnersRemoteShowcase';

/**
 * Hook to lazy load heavy content when visible
 */
const useLazyLoad = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// Hero animation now handled via CSS for faster initial paint
// Framer Motion still used for interactive elements (hover effects) below the fold

/**
 * Main Owners Page Component for Studioz
 */
const ForOwnersPage: React.FC = () => {
  const { t } = useTranslation('forOwners');
  const navigate = useLanguageNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const hasTrackedViewContent = useRef(false);

  // Lazy load the dashboard video - autoplay when scrolled into view
  const { ref: videoRef, isVisible: isVideoVisible } = useLazyLoad(0.2);

  // Track ViewContent event when page loads (once)
  useEffect(() => {
    if (!hasTrackedViewContent.current) {
      hasTrackedViewContent.current = true;
      trackEvent('ViewContent', {
        content_name: 'For Owners Landing Page',
        content_category: 'Landing Page',
        content_type: 'page',
        currency: 'ILS',
        value: 0
      });
    }
  }, []);

  // Handle hash navigation (scroll to section on page load)
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(elementId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  const handleListStudio = () => {
    // Track Lead event when user clicks CTA
    trackEvent('Lead', {
      content_name: 'For Owners CTA Click',
      content_category: 'Conversion'
    });
    navigate('/studio/create');
  };

  const [howItWorksVideoKey, setHowItWorksVideoKey] = useState(0);

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    setHowItWorksVideoKey((k) => k + 1);
  };

  // const stats = [
  //   { label: t('stats.active_studios'), value: '500+' },
  //   { label: t('stats.monthly_bookings'), value: '2.5k+' },
  //   { label: t('stats.owner_earnings'), value: '₪2M+' },
  //   { label: t('stats.cities'), value: '15+' }
  // ];

  const features = [
    {
      icon: <SyncIcon />,
      title: t('features.calendar.title'),
      description: t('features.calendar.description'),
      colorClass: 'owners-feature--blue'
    },
    {
      icon: <ShieldIcon />,
      title: t('features.noShows.title'),
      description: t('features.noShows.description'),
      colorClass: 'owners-feature--primary'
    },
    {
      icon: <AutoAwesomeIcon />,
      title: t('features.autopilot.title'),
      description: t('features.autopilot.description'),
      colorClass: 'owners-feature--purple'
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
        {/* Background Image */}
        <div className="owners-hero__background">
          <picture>
            <source
              srcSet="/images/optimized/Landing-Studio1320-1-640w.webp 640w, /images/optimized/Landing-Studio1320-1-960w.webp 960w, /images/optimized/Landing-Studio1320-1.webp 1320w"
              sizes="100vw"
              type="image/webp"
            />
            <img
              src="/images/optimized/Landing-Studio1320-1.webp"
              alt=""
              className="owners-hero__image"
              loading="eager"
              fetchPriority="high"
              width={1320}
              height={880}
              decoding="async"
            />
          </picture>
          <div className="owners-hero__overlay" />
        </div>

        <div className="owners-hero__glow owners-hero__glow--primary" />
        <div className="owners-hero__glow owners-hero__glow--blue" />

        <div className="owners-container">
          {/* CSS animation instead of Framer Motion for faster LCP */}
          <div className="owners-hero__content owners-hero__content--animated">
            <h1 className="owners-hero__title">
              {t('hero.title_part1')} <br />
              <span className="owners-hero__accent">{t('hero.title_accent')}</span>
            </h1>
            <p className="owners-hero__description">{t('hero.description')}</p>
            <div className="owners-hero__buttons">
              <button className="owners-btn owners-btn--primary" onClick={handleListStudio} type="button">
                {t('hero.cta_primary')} <ArrowForwardIcon />
              </button>
              <button className="owners-btn owners-btn--secondary" onClick={scrollToHowItWorks} type="button">
                {t('hero.cta_secondary')}
              </button>
            </div>
            <p className="owners-hero__free-badge">✓ {t('hero.free_note')}</p>
          </div>
        </div>
      </section>

      {/* How It Works (how to order) — bottom of fold for better flow */}
      <HowItWorksSection videoRestartKey={howItWorksVideoKey} />

      {/* Schedule Control (קבל הזמנות / רק כשמתאים לך) — second section after How It Works */}
      <ScheduleControlSection />

      {/* Asset Showcase (Design that converts) — no video back-to-back with How It Works */}
      <section className="owners-showcase">
        <div className="owners-container">
          <div className="owners-showcase__grid">
            {/* Text Content */}
            <motion.div
              className="owners-showcase__text"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
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

              {/* Theme toggle — same as menu, try both themes and see screenshots update */}
              <div className="owners-showcase__theme-cta">
                <p className="owners-showcase__theme-cta-text">{t('showcase.try_theme_cta')}</p>
                <ThemeToggle variant="dropdown" size="sm" />
              </div>
            </motion.div>

            {/* Mobile Screenshots — only the ones matching current theme */}
            <motion.div
              className="owners-showcase__images owners-showcase__images--mobile"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="owners-showcase__images-glow" />
              <div className="owners-showcase__images-grid">
                {isDark ? (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05, zIndex: 20 }}
                      className="owners-showcase__image-wrapper owners-showcase__image-wrapper--mobile"
                      onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Details-1-Dark.webp')}
                    >
                      <img
                        src="/images/optimized/Studioz-Studio-Details-1-Dark-315w.webp"
                        srcSet="/images/optimized/Studioz-Studio-Details-1-Dark-315w.webp 315w, /images/optimized/Studioz-Studio-Details-1-Dark-630w.webp 630w"
                        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 42vw, 380px"
                        alt="Studio Details Dark Mode 1"
                        loading="lazy"
                        width={315}
                        height={683}
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
                        src="/images/optimized/Studioz-Studio-Details-2-Dark-315w.webp"
                        srcSet="/images/optimized/Studioz-Studio-Details-2-Dark-315w.webp 315w, /images/optimized/Studioz-Studio-Details-2-Dark-630w.webp 630w"
                        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 42vw, 380px"
                        alt="Studio Details Dark Mode 2"
                        loading="lazy"
                        width={315}
                        height={683}
                      />
                      <div className="owners-showcase__image-overlay">
                        <span>{t('showcase.view_original')}</span>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05, zIndex: 20 }}
                      className="owners-showcase__image-wrapper owners-showcase__image-wrapper--mobile"
                      onClick={() => setSelectedImage('/images/optimized/Studioz-Studio-Details-1-Light.webp')}
                    >
                      <img
                        src="/images/optimized/Studioz-Studio-Details-1-Light-315w.webp"
                        srcSet="/images/optimized/Studioz-Studio-Details-1-Light-315w.webp 315w, /images/optimized/Studioz-Studio-Details-1-Light-630w.webp 630w"
                        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 42vw, 380px"
                        alt="Studio Details Light Mode 1"
                        loading="lazy"
                        width={315}
                        height={683}
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
                        src="/images/optimized/Studioz-Studio-Detail-2-Light-315w.webp"
                        srcSet="/images/optimized/Studioz-Studio-Detail-2-Light-315w.webp 315w, /images/optimized/Studioz-Studio-Detail-2-Light-630w.webp 630w"
                        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 42vw, 380px"
                        alt="Studio Details Light Mode 2"
                        loading="lazy"
                        width={315}
                        height={683}
                      />
                      <div className="owners-showcase__image-overlay">
                        <span>{t('showcase.view_original')}</span>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview (ניהול מרכזי) — after Design section so the two videos aren't back-to-back */}
      <section className="owners-dashboard" ref={videoRef}>
        <div className="owners-container">
          <div className="owners-dashboard__card">
            <div className="owners-dashboard__browser">
              <div className="owners-dashboard__browser-header">
                <div className="owners-dashboard__browser-dots">
                  <span className="owners-dashboard__dot owners-dashboard__dot--red" />
                  <span className="owners-dashboard__dot owners-dashboard__dot--yellow" />
                  <span className="owners-dashboard__dot owners-dashboard__dot--green" />
                </div>
              </div>
              <div className="owners-dashboard__browser-content">
                {isVideoVisible ? (
                  <iframe
                    src="https://player.mediadelivery.net/embed/583287/5f666f52-d513-4099-b25e-0bf6cfdc7845?autoplay=true&loop=true&muted=true&preload=true&playsinline=true&controls=false&showSpeed=false&showCaptions=false&showHeatmap=false&showPlaylist=false&showShareButton=false"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                    className="owners-dashboard__video"
                    title={t('dashboard.title')}
                  />
                ) : (
                  <div className="owners-dashboard__video-skeleton">
                    <img
                      src="/images/optimized/Studioz-Dashboard-Calendar.webp"
                      alt=""
                      className="owners-dashboard__video-thumbnail"
                      width={1920}
                      height={1080}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="owners-dashboard__text">
              <h3>{t('dashboard.title')}</h3>
              <p>{t('dashboard.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Remote Projects Showcase */}
      <StudioZOwnersRemoteShowcase />

      {/* Scroll-Driven Feature Showcase */}
      <ScrollDrivenShowcase />

      {/* Features Section */}
      <section className="owners-features">
        <div className="owners-container">
          <div className="owners-features__header">
            <h2 className="owners-section-title">
              {t('features.title')} <span className="owners-hero__accent">{t('features.titleAccent')}</span>
            </h2>
            <p className="owners-section-subtitle">{t('features.subtitle')}</p>
          </div>

          <div className="owners-features__grid owners-features__grid--three">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  colorClass={feature.colorClass}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
          {selectedImage && <img src={selectedImage} alt="Studio page preview" className="owners-lightbox__image" />}
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
