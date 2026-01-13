import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BoltIcon from '@mui/icons-material/Bolt';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SendIcon from '@mui/icons-material/Send';
import './_changelog.scss';

// --- Types ---

type ChangeType = 'feature' | 'improvement' | 'fix';

interface ChangeItem {
  id: string;
  type: ChangeType;
  description: string;
}

interface Release {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: ChangeItem[];
}

interface MonthGroup {
  month: string;
  monthKey: string;
  releases: Release[];
}

// --- Changelog Data ---

const CHANGELOG_DATA: MonthGroup[] = [
  {
    month: 'ינואר 2026',
    monthKey: '2026-01',
    releases: [
      {
        version: 'jan-char-counter',
        date: '13 בינואר, 2026',
        title: 'מונה תווים בטפסים',
        description: 'הוספנו מונה תווים לשדות שם, כותרת משנה ותיאור בטפסי יצירת ועריכת סטודיו ושירות.',
        changes: [
          { id: '1', type: 'feature', description: 'מונה תווים בזמן אמת בשדות טקסט' },
          { id: '2', type: 'improvement', description: 'קובץ קבועים מרכזי לניהול מגבלות תווים' },
        ],
      },
      {
        version: 'jan-pixel',
        date: '13 בינואר, 2026',
        title: 'Meta Pixel ומעקב המרות',
        description: 'הטמענו את Meta Pixel למעקב המרות ואנליטיקס מתקדם.',
        changes: [
          { id: '3', type: 'feature', description: 'מעקב אירועי רכישה והרשמה' },
          { id: '4', type: 'feature', description: 'יוטיליטי אנליטיקס מרכזי לאירועים' },
        ],
      },
      {
        version: 'jan-dashboard',
        date: '12 בינואר, 2026',
        title: 'לוח בקרה משופר למנהלים',
        description: 'שיפורים משמעותיים בלוח הבקרה למנהלי סטודיו כולל סטטיסטיקות בזמן אמת.',
        changes: [
          { id: '5', type: 'feature', description: 'טאב סטטיסטיקות חדש בלוח הבקרה' },
          { id: '6', type: 'feature', description: 'חישוב הכנסות ומגמות אוטומטי' },
          { id: '7', type: 'improvement', description: 'רענון נתוני הזמנות כל 30 שניות' },
          { id: '8', type: 'fix', description: 'תיקון תצוגת סטטוס הזמנות בפעילות אחרונה' },
        ],
      },
    ],
  },
  {
    month: 'דצמבר 2025',
    monthKey: '2025-12',
    releases: [
      {
        version: 'dec-booking-flow',
        date: '28 בדצמבר, 2025',
        title: 'שיפורי תהליך הזמנה',
        description: 'שיפורים בחוויית ההזמנה כולל כפתור ליצירת הזמנה נוספת.',
        changes: [
          { id: '9', type: 'feature', description: 'כפתור "צור הזמנה נוספת" בכרטיס הזמנה' },
          { id: '10', type: 'improvement', description: 'עיצוב מחודש לכרטיס הזמנה במובייל' },
        ],
      },
      {
        version: 'dec-forms',
        date: '15 בדצמבר, 2025',
        title: 'עדכוני טפסי סטודיו',
        description: 'הסרנו שדות שאינם בשימוש והוספנו אינדיקטור פעיל בתפריט.',
        changes: [
          { id: '11', type: 'improvement', description: 'הסרת מתג 24 שעות מטפסי סטודיו' },
          { id: '12', type: 'feature', description: 'אינדיקטור עמוד פעיל בתפריט הניווט' },
        ],
      },
    ],
  },
];

// --- Components ---

function TypeBadge({ type }: { type: ChangeType }) {
  const icons = {
    feature: <AutoAwesomeIcon className="changelog__badge-icon" />,
    improvement: <BoltIcon className="changelog__badge-icon" />,
    fix: <BugReportIcon className="changelog__badge-icon" />,
  };

  return (
    <span className={`changelog__badge changelog__badge--${type}`}>
      {icons[type]}
    </span>
  );
}

export const ChangelogPage: React.FC = () => {
  const { t } = useTranslation('changelog');
  const [expandedReleases, setExpandedReleases] = useState<string[]>([
    CHANGELOG_DATA[0]?.releases[0]?.version || ''
  ]);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const toggleRelease = (version: string) => {
    setExpandedReleases(prev =>
      prev.includes(version)
        ? prev.filter(v => v !== version)
        : [...prev, version]
    );
  };

  const handleSubmitSuggestion = () => {
    if (suggestion.trim()) {
      // TODO: Implement suggestion submission
      console.log('Suggestion submitted:', suggestion);
      setSuggestion('');
      setShowSuggestionForm(false);
    }
  };

  return (
    <div className="changelog">
      <div className="changelog__container">
        {/* Header */}
        <header className="changelog__header">
          <h1 className="changelog__title">
            {t('title', 'עדכוני מערכת')}
          </h1>
          <p className="changelog__subtitle">
            {t('subtitle', 'כל הפיצ׳רים החדשים, השיפורים והתיקונים')}
          </p>
        </header>

        {/* Releases List */}
        <div className="changelog__releases">
          {CHANGELOG_DATA.map((group) =>
            group.releases.map((release) => (
              <article
                key={release.version}
                className="changelog__release"
              >
                {/* Release Header */}
                <div
                  className="changelog__release-header"
                  onClick={() => toggleRelease(release.version)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleRelease(release.version);
                    }
                  }}
                  aria-expanded={expandedReleases.includes(release.version)}
                >
                  <div className="changelog__release-content">
                    <span className="changelog__release-date">
                      {release.date}
                    </span>
                    <h3 className="changelog__release-title">
                      {release.title}
                    </h3>
                    <p className="changelog__release-description">
                      {release.description}
                    </p>
                  </div>

                  <button
                    className={`changelog__expand-btn ${
                      expandedReleases.includes(release.version) ? 'changelog__expand-btn--expanded' : ''
                    }`}
                    aria-label={expandedReleases.includes(release.version) ? 'Collapse' : 'Expand'}
                  >
                    <KeyboardArrowDownIcon />
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedReleases.includes(release.version) && (
                  <div className="changelog__changes">
                    <ul className="changelog__changes-list">
                      {release.changes.map((change) => (
                        <li key={change.id} className="changelog__change-item">
                          <TypeBadge type={change.type} />
                          <span className="changelog__change-text">
                            {change.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        {/* Feature Suggestion Section */}
        <section className="changelog__suggestion">
          <div className="changelog__suggestion-header">
            <h3 className="changelog__suggestion-title">
              <LightbulbIcon className="changelog__suggestion-icon" />
              {t('suggestion.title', 'הצעות לפיצ׳רים חדשים')}
            </h3>
            <p className="changelog__suggestion-text">
              {t('suggestion.description', 'האם יש לכם רעיון? אנחנו תמיד שומעים את דעותיכם')}
            </p>
          </div>

          {!showSuggestionForm ? (
            <button
              onClick={() => setShowSuggestionForm(true)}
              className="changelog__suggestion-trigger"
            >
              <span>{t('suggestion.placeholder', 'שתפו רעיון חדש...')}</span>
              <SendIcon className="changelog__suggestion-trigger-icon" />
            </button>
          ) : (
            <div className="changelog__suggestion-form">
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={t('suggestion.textareaPlaceholder', 'תארו לנו את הרעיון שלכם...')}
                className="changelog__suggestion-textarea"
                rows={3}
              />
              <div className="changelog__suggestion-actions">
                <button
                  onClick={() => setShowSuggestionForm(false)}
                  className="changelog__suggestion-cancel"
                >
                  {t('suggestion.cancel', 'ביטול')}
                </button>
                <button
                  onClick={handleSubmitSuggestion}
                  className="changelog__suggestion-submit"
                  disabled={!suggestion.trim()}
                >
                  <SendIcon className="changelog__suggestion-submit-icon" />
                  {t('suggestion.submit', 'שלח הצעה')}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChangelogPage;
