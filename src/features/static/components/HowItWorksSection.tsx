import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SearchIcon, CalendarIcon, CheckCircleIcon } from '@shared/components/icons';
import { VideoPlayer } from '@shared/components';
import './_how-it-works-section.scss';

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
    className="how-it-works-section__step-card"
    variants={fadeInUp}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <div className="how-it-works-section__step-glow" />
    <span className="how-it-works-section__step-number">{stepNumber}</span>
    <div className="how-it-works-section__step-icon">{icon}</div>
    <h3 className="how-it-works-section__step-title">{title}</h3>
    <p className="how-it-works-section__step-description">{description}</p>
  </motion.div>
);

// Video embed URL for the how it works demo
const VIDEO_EMBED_URL = 'https://player.mediadelivery.net/embed/583287/65c4a479-7457-4b84-a0f3-18b2792429b5';

export interface HowItWorksSectionProps {
  /** When this value changes, the demo video remounts and starts from the beginning (e.g. when user clicks View Demo). */
  videoRestartKey?: number;
}

/**
 * How It Works Section Component
 * Embedded section for ForOwnersPage
 */
export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ videoRestartKey = 0 }) => {
  const { t } = useTranslation('howItWorks');

  const steps = [
    {
      stepNumber: '01',
      icon: <SearchIcon />,
      title: t('steps.search.title'),
      description: t('steps.search.description')
    },
    {
      stepNumber: '02',
      icon: <CalendarIcon />,
      title: t('steps.schedule.title'),
      description: t('steps.schedule.description')
    },
    {
      stepNumber: '03',
      icon: <CheckCircleIcon />,
      title: t('steps.create.title'),
      description: t('steps.create.description')
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="owners-container">
        {/* Header */}
        <motion.div
          className="how-it-works-section__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="how-it-works-section__title">
            {t('title.prefix')} <span className="how-it-works-section__title-accent">{t('title.highlight')}</span>
          </h2>
          <p className="how-it-works-section__subtitle">{t('subtitle')}</p>
        </motion.div>

        {/* Video Section — video iframe only mounts when in view to reduce TBT and LCP */}
        <div className="how-it-works-section__video" ref={videoContainerRef}>
          <div className="how-it-works-section__video-glow how-it-works-section__video-glow--primary" />
          <div className="how-it-works-section__video-glow how-it-works-section__video-glow--secondary" />

          <motion.div
            className="how-it-works-section__video-container"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {videoInView ? (
              <VideoPlayer
                key={videoRestartKey}
                embedUrl={VIDEO_EMBED_URL}
                showFrameBar={true}
                placeholderText="Video Coming Soon"
                aspectRatio="3 / 2"
                autoPlay={true}
                muted={true}
                loop={true}
              />
            ) : (
              <div className="how-it-works-section__video-placeholder" style={{ aspectRatio: '3 / 2' }} aria-hidden />
            )}
          </motion.div>
        </div>

        {/* Steps Grid */}
        <motion.div
          className="how-it-works-section__steps-grid"
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
      </div>
    </section>
  );
};
