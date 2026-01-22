/**
 * ScheduleControlSection
 * A high-impact section showcasing the platform's advanced availability controls.
 * Features a desktop mockup with Hebrew RTL support and light mode aesthetic.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguageNavigate } from '@shared/hooks';
import './_schedule-control-section.scss';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

function FeatureItem({ icon, title, description, delay = 0 }: FeatureItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="schedule-control__feature-item"
    >
      <div className="schedule-control__feature-icon">
        {icon}
      </div>
      <div className="schedule-control__feature-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </motion.div>
  );
}

export const ScheduleControlSection: React.FC = () => {
  const { t } = useTranslation('forOwners');
  const navigate = useLanguageNavigate();

  const handleCTA = () => {
    navigate('/studio/create');
  };

  const features = [
    {
      icon: <CalendarMonthIcon />,
      title: t('schedule_control.feature1_title', 'חוקי זמינות גמישים'),
      description: t('schedule_control.feature1_description', 'הגדר שעות פעילות שונות לכל יום בשבוע או תאריכים ספציפיים שסגורים להזמנות.')
    },
    {
      icon: <AccessTimeIcon />,
      title: t('schedule_control.feature2_title', 'מרווחי זמן אוטומטיים'),
      description: t('schedule_control.feature2_description', 'הוסף Buffer בין סשנים כדי להבטיח זמן להתארגנות, ניקיון ומנוחה.')
    },
    {
      icon: <CheckCircleOutlineIcon />,
      title: t('schedule_control.feature3_title', 'אישור מיידי או ידני'),
      description: t('schedule_control.feature3_description', 'בחר אם לאשר כל הזמנה בעצמך או לאפשר ללקוחות לסגור שעות באופן אוטומטי.')
    }
  ];

  return (
    <section className="schedule-control">
      <div className="schedule-control__container">
        <div className="schedule-control__grid">
          
          {/* Content Side */}
          <div className="schedule-control__content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="schedule-control__title">
                {t('schedule_control.title_line1', 'קבל הזמנות')}<br />
                <span className="schedule-control__title-accent">
                  {t('schedule_control.title_line2', 'רק כשמתאים לך')}
                </span>
              </h2>
              
              <p className="schedule-control__description">
                {t('schedule_control.description', 'הגדר חוקי זמינות מתקדמים, זמני התארגנות ומרווחים בין פגישות. המערכת דואגת שלא יהיו כפילויות ושהיום שלך יתנהל בדיוק כמו שתכננת.')}
              </p>
              
              <div className="schedule-control__features">
                {features.map((feature, index) => (
                  <FeatureItem 
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index * 0.1}
                  />
                ))}
              </div>

              <button 
                className="schedule-control__cta"
                onClick={handleCTA}
                type="button"
              >
                <span>{t('schedule_control.cta', 'התחל לנהל את היומן')}</span>
                <ArrowBackIcon className="schedule-control__cta-icon" />
              </button>
            </motion.div>
          </div>

          {/* Visual Side (Mockup) */}
          <div className="schedule-control__visual">
            <div className="schedule-control__visual-wrapper">
              {/* Decorative Background Elements */}
              <div className="schedule-control__deco-glow schedule-control__deco-glow--primary" />
              <div className="schedule-control__deco-glow schedule-control__deco-glow--secondary" />
              
              {/* Desktop Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="schedule-control__mockup"
              >
                {/* Browser Frame */}
                <div className="schedule-control__browser">
                  {/* Browser Bar */}
                  <div className="schedule-control__browser-bar">
                    <div className="schedule-control__browser-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="schedule-control__browser-address" />
                  </div>
                  
                  {/* Content Area */}
                  <div className="schedule-control__browser-content">
                    <img 
                      src="/images/optimized/Studio-Availability-Controls-desktop-1-V3.webp"
                      alt="Studio Availability Control Interface"
                      loading="lazy"
                    />
                    {/* Subtle Overlay */}
                    <div className="schedule-control__browser-overlay" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ScheduleControlSection;
