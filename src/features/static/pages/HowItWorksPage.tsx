import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import '../styles/_how-it-works-page.scss';

/**
 * Animation variants for Framer Motion
 */
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Step Card Component
 */
interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: string;
  index: number;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, stepNumber, index }) => (
  <motion.div
    className="how-it-works__step-card"
    variants={fadeInUp}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="how-it-works__step-glow" />
    <span className="how-it-works__step-number">{stepNumber}</span>
    <div className="how-it-works__step-icon">{icon}</div>
    <h3 className="how-it-works__step-title">{title}</h3>
    <p className="how-it-works__step-description">{description}</p>
  </motion.div>
);

/**
 * Video Player Component - Bunny Stream Embed
 */
interface VideoPlayerProps {
  embedUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ embedUrl }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="how-it-works__video-player">
      {/* Screen Studio Style Frame Bar */}
      <div className="how-it-works__video-frame">
        <div className="how-it-works__video-dot how-it-works__video-dot--red" />
        <div className="how-it-works__video-dot how-it-works__video-dot--yellow" />
        <div className="how-it-works__video-dot how-it-works__video-dot--green" />
      </div>

      {/* Loading Overlay */}
      {isLoading && embedUrl && (
        <div className="how-it-works__video-loading-overlay">
          <div className="how-it-works__video-spinner" />
        </div>
      )}

      {embedUrl ? (
        <iframe
          src={`${embedUrl}?autoplay=false&loop=true&muted=true&preload=true`}
          className="how-it-works__video-iframe"
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
        />
      ) : (
        <div className="how-it-works__video-placeholder">
          <PlayArrowIcon className="how-it-works__video-placeholder-icon" />
          <p>Video Coming Soon</p>
        </div>
      )}
    </div>
  );
};

/**
 * How It Works Page Component
 */
export interface HowItWorksPageProps {
  videoEmbedUrl?: string;
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ videoEmbedUrl }) => {
  const { t } = useTranslation('howItWorks');
  const navigate = useLanguageNavigate();

  const handleFindStudio = () => {
    navigate('/studios');
  };

  const steps = [
    {
      stepNumber: '01',
      icon: <SearchIcon />,
      title: t('steps.search.title'),
      description: t('steps.search.description')
    },
    {
      stepNumber: '02',
      icon: <CalendarMonthIcon />,
      title: t('steps.schedule.title'),
      description: t('steps.schedule.description')
    },
    // {
    //   stepNumber: '03',
    //   icon: <CreditCardIcon />,
    //   title: t('steps.book.title'),
    //   description: t('steps.book.description')
    // },
    {
      stepNumber: '03',
      icon: <CheckCircleIcon />,
      title: t('steps.create.title'),
      description: t('steps.create.description')
    }
  ];

  return (
    <div className="how-it-works-page">
      {/* Header Section */}
      <section className="how-it-works__header">
        <motion.div
          className="how-it-works__header-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="how-it-works__title">
            {t('title.prefix')} <span className="how-it-works__title-accent">{t('title.highlight')}</span>
          </h1>
          <p className="how-it-works__subtitle">{t('subtitle')}</p>
        </motion.div>
      </section>

      {/* Video Section */}
      <section className="how-it-works__video-section">
        <div className="how-it-works__video-glow how-it-works__video-glow--primary" />
        <div className="how-it-works__video-glow how-it-works__video-glow--secondary" />

        <motion.div
          className="how-it-works__video-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <VideoPlayer embedUrl={videoEmbedUrl} />
        </motion.div>

        {/* Decorative blurs */}
        <div className="how-it-works__blur how-it-works__blur--right" />
        <div className="how-it-works__blur how-it-works__blur--left" />
      </section>

      {/* Steps Grid */}
      <section className="how-it-works__steps-section">
        <motion.div
          className="how-it-works__steps-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <StepCard
              key={step.stepNumber}
              stepNumber={step.stepNumber}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="how-it-works__cta-section">
        <div className="how-it-works__cta-glow" />

        <motion.div
          className="how-it-works__cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <button className="how-it-works__cta-button" onClick={handleFindStudio}>
            <span>{t('cta.button')}</span>
            <div className="how-it-works__cta-icon">
              <PlayArrowIcon />
            </div>
          </button>
          <p className="how-it-works__cta-subtext">{t('cta.subtext')}</p>
        </motion.div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
