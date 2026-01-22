/**
 * ScrollDrivenShowcase Component
 * Interactive feature showcase with clickable navigation dots.
 * Features:
 * - Phone mockup with cross-fading screenshots
 * - Clickable dots to navigate between features
 * - Hebrew RTL support
 * - Smooth animations with Framer Motion
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CreditCard, BarChart3, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './_scroll-driven-showcase.scss';

interface Feature {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  image: string;
}

const FEATURES: Feature[] = [
  {
    id: 'calendar',
    titleKey: 'showcase.calendar.title',
    descriptionKey: 'showcase.calendar.description',
    icon: Calendar,
    color: '#f7c041',
    image: 'https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/3a367b33-67cb-40f8-95ff-6e999870beae/1769012590264-b28e14a0/Studioz-calendar.PNG'
  },
  {
    id: 'stats',
    titleKey: 'showcase.stats.title',
    descriptionKey: 'showcase.stats.description',
    icon: BarChart3,
    color: '#0ea5e9',
    image: 'https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/3a367b33-67cb-40f8-95ff-6e999870beae/1769012593593-19b82447/Studioz-stats.PNG'
  },
  {
    id: 'service',
    titleKey: 'showcase.service.title',
    descriptionKey: 'showcase.service.description',
    icon: Sparkles,
    color: '#10b981',
    image: 'https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/3a367b33-67cb-40f8-95ff-6e999870beae/1769012593305-ffadc3ba/Studioz-Service-Details.PNG'
  },
  {
    id: 'payments',
    titleKey: 'showcase.payments.title',
    descriptionKey: 'showcase.payments.description',
    icon: CreditCard,
    color: '#6366f1',
    image: 'https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/3a367b33-67cb-40f8-95ff-6e999870beae/1769012592283-95784a84/Studioz-Service-Detail-PaymentStep-Saved-Cards.PNG'
  }
];

export const ScrollDrivenShowcase: React.FC = () => {
  const { t } = useTranslation('forOwners');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFeature = FEATURES[activeIndex];
  const Icon = activeFeature.icon;

  return (
    <section className="feature-showcase">
      <div className="feature-showcase__container">
        
        {/* Text Side */}
        <div className="feature-showcase__text-side">
          <div className="feature-showcase__text-content">
            {/* Feature Content with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="feature-showcase__feature"
              >
                <div className="feature-showcase__feature-header">
                  <div 
                    className="feature-showcase__feature-icon-wrapper"
                    style={{ borderColor: activeFeature.color }}
                  >
                    <Icon 
                      className="feature-showcase__feature-icon" 
                      style={{ color: activeFeature.color }} 
                    />
                  </div>
                  <span className="feature-showcase__feature-index">
                    0{activeIndex + 1}
                  </span>
                </div>
                <h2 className="feature-showcase__feature-title">
                  {t(activeFeature.titleKey)}
                </h2>
                <p className="feature-showcase__feature-description">
                  {t(activeFeature.descriptionKey)}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="feature-showcase__dots">
              {FEATURES.map((feature, idx) => (
                <button
                  key={feature.id}
                  type="button"
                  className={`feature-showcase__dot ${idx === activeIndex ? 'feature-showcase__dot--active' : ''}`}
                  style={{ 
                    backgroundColor: idx === activeIndex ? feature.color : undefined 
                  }}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={t(feature.titleKey)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Phone Side */}
        <div className="feature-showcase__phone-side">
          <div className="feature-showcase__phone-container">
            {/* Phone Frame */}
            <div className="feature-showcase__phone-frame">
              <div className="feature-showcase__phone-notch" />
              <div className="feature-showcase__phone-screen">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeFeature.id}
                    src={activeFeature.image}
                    alt={t(activeFeature.titleKey)}
                    className="feature-showcase__phone-image"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Decorative Glow */}
            <motion.div 
              className="feature-showcase__deco-glow"
              animate={{ 
                background: `radial-gradient(ellipse at center, ${activeFeature.color}20 0%, transparent 70%)`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollDrivenShowcase;
