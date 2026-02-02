/**
 * StudioZOwnersRemoteShowcase
 * A marketing section for studio owners explaining the Remote Projects feature.
 * Highlights: global reach, async workflow, project management.
 * Light mode, Hebrew localization.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { ClockIcon, MusicNoteIcon, SmsIcon, ShieldIcon, ArrowBackIcon } from '@shared/components/icons';
import './_studioZ-owners-remote-showcase.scss';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

interface Stat {
  value: string;
  label: string;
}

const FEATURES: Feature[] = [
  {
    icon: ClockIcon,
    title: 'עבודה בקצב שלך',
    desc: 'עבוד לפי לוח הזמנים שלך. לקוחות מעלים קבצים, אתה מספק תוצאות כשאתה מוכן.'
  },
  {
    icon: MusicNoteIcon,
    title: 'תמחור מבוסס פרויקט',
    desc: 'קבע מחירים מותאמים אישית לפרויקטים מלאים, לא רק לפי שעה.'
  },
  {
    icon: SmsIcon,
    title: 'צ׳אט מובנה',
    desc: 'נהל את כל הפידבקים והיסטוריית הקבצים בשרשור מקצועי אחד.'
  },
  {
    icon: ShieldIcon,
    title: 'תשלומים מאובטחים',
    desc: 'מקדמות ותשלומים  אוטומטיים בעת קבלת או מסירת הפרויקט.'
  }
];

const STATS: Stat[] = [
  { value: '+100%', label: 'הגדלת קיבולת' },
  { value: 'ארצי', label: 'קהל לקוחות' },
  { value: 'גמיש', label: 'לוח זמנים' },
  { value: 'שלך', label: 'מבנה התמחור' }
];

export const StudioZOwnersRemoteShowcase: React.FC = () => {
  const navigate = useLanguageNavigate();

  const handleListStudio = () => {
    navigate('/studio/create');
  };

  return (
    <section className="remote-showcase" dir="rtl">
      {/* Background Glows */}
      <div className="remote-showcase__glow remote-showcase__glow--right" />
      <div className="remote-showcase__glow remote-showcase__glow--left" />

      <div className="remote-showcase__container">
        <div className="remote-showcase__layout">
          {/* Content Side */}
          <div className="remote-showcase__content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ease: 'easeOut' }}
            >
              <h2 className="remote-showcase__title">
                הגדל את ההכנסות <br />
                <span className="remote-showcase__title-accent">מעבר לכותלי הסטודיו</span>
              </h2>
              <p className="remote-showcase__description">
                הצע שירותי מיקס, מאסטרינג ופוסט-פרודקשן לאמנים בכל הארץ. הסטודיו שלך לא חייב להיות פתוח כדי שתמשיך לעבוד
                ולהרוויח.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, ease: 'easeOut' }}
              className="remote-showcase__features"
            >
              {FEATURES.map((feature, i) => (
                <div key={i} className="remote-showcase__feature">
                  <div className="remote-showcase__feature-icon-wrapper">
                    <feature.icon className="remote-showcase__feature-icon" />
                  </div>
                  <h3 className="remote-showcase__feature-title">{feature.title}</h3>
                  <p className="remote-showcase__feature-desc">{feature.desc}</p>
                </div>
              ))}
            </motion.div>

            <div className="remote-showcase__cta-wrapper">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, ease: 'easeOut' }}
                className="remote-showcase__cta-btn"
                type="button"
                onClick={handleListStudio}
              >
                רשום את הסטודיו שלך
                <ArrowBackIcon className="remote-showcase__cta-icon" />
              </motion.button>
            </div>
          </div>

          {/* Visual Showcase Side */}
          <div className="remote-showcase__visual">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ease: 'easeOut' }}
              className="remote-showcase__visual-wrapper"
            >
              {/* Submission Form Mockup */}
              <div className="remote-showcase__mockup">
                <div className="remote-showcase__mockup-header">
                  <div className="remote-showcase__mockup-header-row">
                    <h4 className="remote-showcase__mockup-title">מיקס מרחוק (Mixing)</h4>
                  </div>
                  <div className="remote-showcase__mockup-stats">
                    <div className="remote-showcase__mockup-stat">
                      <p className="remote-showcase__mockup-stat-label">מחיר</p>
                      <p className="remote-showcase__mockup-stat-value">₪2,200</p>
                    </div>
                    <div className="remote-showcase__mockup-stat">
                      <p className="remote-showcase__mockup-stat-label">זמן מסירה</p>
                      <p className="remote-showcase__mockup-stat-value">14 ימים</p>
                    </div>
                  </div>
                </div>

                <div className="remote-showcase__mockup-body">
                  <div className="remote-showcase__mockup-field">
                    <label className="remote-showcase__mockup-label">תיאור הפרויקט</label>
                    <div className="remote-showcase__mockup-textarea">
                      "אני צריך מיקס עוצמתי ל-12 ערוצים של רוק. רפרנס: Foo Fighters - Everlong..."
                    </div>
                  </div>
                  <div className="remote-showcase__mockup-field">
                    <label className="remote-showcase__mockup-label">לינקים לרפרנסים</label>
                    <div className="remote-showcase__mockup-input">https://spotify.com/track/4vNo...</div>
                  </div>
                  <div className="remote-showcase__mockup-actions">
                    <div className="remote-showcase__mockup-btn remote-showcase__mockup-btn--cancel">ביטול</div>
                    <div className="remote-showcase__mockup-btn remote-showcase__mockup-btn--submit">שלח בקשה</div>
                  </div>
                </div>
              </div>

              {/* Decorative Background Circles */}
              <div className="remote-showcase__deco-circle remote-showcase__deco-circle--outer" />
              <div className="remote-showcase__deco-circle remote-showcase__deco-circle--inner" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Stats Grid */}
        <div className="remote-showcase__stats">
          {STATS.map((stat, i) => (
            <div key={i} className="remote-showcase__stat">
              <p className="remote-showcase__stat-label">{stat.label}</p>
              <p className="remote-showcase__stat-value">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudioZOwnersRemoteShowcase;
