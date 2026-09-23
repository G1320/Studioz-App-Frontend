import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, AutoAwesomeIcon, BoltIcon, BugIcon, LightbulbIcon, SendIcon } from '@shared/components/icons';
import { useSentryFeedback } from '@shared/hooks/utils';
import './_changelog.scss';

// --- Types ---

type ChangeType = 'feature' | 'improvement' | 'fix';

interface ChangeItem {
  id: string;
  type: ChangeType;
  descriptionKey: string;
}

interface Release {
  version: string;
  dateKey: string;
  titleKey: string;
  descriptionKey: string;
  changes: ChangeItem[];
}

interface MonthGroup {
  monthKey: string;
  releases: Release[];
}

// --- Changelog Data ---

const CHANGELOG_DATA: MonthGroup[] = [
  {
    monthKey: 'months.sep2026',
    releases: [
      {
        version: 'sep-owner-shell',
        dateKey: 'releases.sep2026.ownerShell.date',
        titleKey: 'releases.sep2026.ownerShell.title',
        descriptionKey: 'releases.sep2026.ownerShell.description',
        changes: [
          {
            id: 'sep-o1',
            type: 'improvement',
            descriptionKey: 'releases.sep2026.ownerShell.changes.pageHeaders'
          },
          {
            id: 'sep-o2',
            type: 'feature',
            descriptionKey: 'releases.sep2026.ownerShell.changes.statsPage'
          },
          {
            id: 'sep-o3',
            type: 'improvement',
            descriptionKey: 'releases.sep2026.ownerShell.changes.listControls'
          },
          {
            id: 'sep-o4',
            type: 'improvement',
            descriptionKey: 'releases.sep2026.ownerShell.changes.projectChrome'
          },
          {
            id: 'sep-o5',
            type: 'improvement',
            descriptionKey: 'releases.sep2026.ownerShell.changes.features'
          }
        ]
      },
      {
        version: 'sep-audio-review',
        dateKey: 'releases.sep2026.audioReview.date',
        titleKey: 'releases.sep2026.audioReview.title',
        descriptionKey: 'releases.sep2026.audioReview.description',
        changes: [
          { id: 'sep-a1', type: 'feature', descriptionKey: 'releases.sep2026.audioReview.changes.review' },
          {
            id: 'sep-a2',
            type: 'feature',
            descriptionKey: 'releases.sep2026.audioReview.changes.notifications'
          },
          {
            id: 'sep-a3',
            type: 'improvement',
            descriptionKey: 'releases.sep2026.audioReview.changes.resolution'
          }
        ]
      },
      {
        version: 'sep-project-workspace',
        dateKey: 'releases.sep2026.projectWorkspace.date',
        titleKey: 'releases.sep2026.projectWorkspace.title',
        descriptionKey: 'releases.sep2026.projectWorkspace.description',
        changes: [
          { id: 'sep-p1', type: 'feature', descriptionKey: 'releases.sep2026.projectWorkspace.changes.artwork' },
          { id: 'sep-p2', type: 'improvement', descriptionKey: 'releases.sep2026.projectWorkspace.changes.filters' },
          { id: 'sep-p3', type: 'feature', descriptionKey: 'releases.sep2026.projectWorkspace.changes.layouts' }
        ]
      },
      {
        version: 'sep-dashboard-navigation',
        dateKey: 'releases.sep2026.dashboardNavigation.date',
        titleKey: 'releases.sep2026.dashboardNavigation.title',
        descriptionKey: 'releases.sep2026.dashboardNavigation.description',
        changes: [
          {
            id: 'sep-d1',
            type: 'feature',
            descriptionKey: 'releases.sep2026.dashboardNavigation.changes.projectActivity'
          },
          {
            id: 'sep-d2',
            type: 'improvement',
            descriptionKey: 'releases.sep2026.dashboardNavigation.changes.desktopHeader'
          }
        ]
      }
    ]
  },
  {
    monthKey: 'months.aug2026',
    releases: [
      {
        version: 'aug-project-collaboration',
        dateKey: 'releases.aug2026.collaboration.date',
        titleKey: 'releases.aug2026.collaboration.title',
        descriptionKey: 'releases.aug2026.collaboration.description',
        changes: [
          {
            id: 'aug-c1',
            type: 'feature',
            descriptionKey: 'releases.aug2026.collaboration.changes.invites'
          },
          {
            id: 'aug-c2',
            type: 'feature',
            descriptionKey: 'releases.aug2026.collaboration.changes.permissions'
          },
          {
            id: 'aug-c3',
            type: 'improvement',
            descriptionKey: 'releases.aug2026.collaboration.changes.loginReturn'
          }
        ]
      },
      {
        version: 'aug-audio-portfolio',
        dateKey: 'releases.aug2026.audioPortfolio.date',
        titleKey: 'releases.aug2026.audioPortfolio.title',
        descriptionKey: 'releases.aug2026.audioPortfolio.description',
        changes: [
          {
            id: 'aug-p1',
            type: 'feature',
            descriptionKey: 'releases.aug2026.audioPortfolio.changes.player'
          },
          {
            id: 'aug-p2',
            type: 'feature',
            descriptionKey: 'releases.aug2026.audioPortfolio.changes.comments'
          },
          {
            id: 'aug-p3',
            type: 'feature',
            descriptionKey: 'releases.aug2026.audioPortfolio.changes.portfolio'
          },
          {
            id: 'aug-p4',
            type: 'improvement',
            descriptionKey: 'releases.aug2026.audioPortfolio.changes.covers'
          }
        ]
      }
    ]
  },
  {
    monthKey: 'months.jun2026',
    releases: [
      {
        version: 'jun-accessibility-compliance',
        dateKey: 'releases.jun2026.compliance.date',
        titleKey: 'releases.jun2026.compliance.title',
        descriptionKey: 'releases.jun2026.compliance.description',
        changes: [
          {
            id: 'jun-c1',
            type: 'feature',
            descriptionKey: 'releases.jun2026.compliance.changes.statement'
          },
          {
            id: 'jun-c2',
            type: 'improvement',
            descriptionKey: 'releases.jun2026.compliance.changes.legal'
          },
          {
            id: 'jun-c3',
            type: 'fix',
            descriptionKey: 'releases.jun2026.compliance.changes.loginLayout'
          }
        ]
      }
    ]
  },
  {
    monthKey: 'months.may2026',
    releases: [
      {
        version: 'may-payments-bookings',
        dateKey: 'releases.may2026.paymentsBookings.date',
        titleKey: 'releases.may2026.paymentsBookings.title',
        descriptionKey: 'releases.may2026.paymentsBookings.description',
        changes: [
          {
            id: 'may-p1',
            type: 'feature',
            descriptionKey: 'releases.may2026.paymentsBookings.changes.multiCard'
          },
          {
            id: 'may-p2',
            type: 'feature',
            descriptionKey: 'releases.may2026.paymentsBookings.changes.defaultCard'
          },
          {
            id: 'may-p3',
            type: 'improvement',
            descriptionKey: 'releases.may2026.paymentsBookings.changes.cancellationPolicy'
          },
          {
            id: 'may-p4',
            type: 'fix',
            descriptionKey: 'releases.may2026.paymentsBookings.changes.calendar'
          }
        ]
      }
    ]
  },
  {
    monthKey: 'months.apr2026',
    releases: [
      {
        version: 'apr-remote-project-workflow',
        dateKey: 'releases.apr2026.remoteWorkflow.date',
        titleKey: 'releases.apr2026.remoteWorkflow.title',
        descriptionKey: 'releases.apr2026.remoteWorkflow.description',
        changes: [
          {
            id: 'apr-r1',
            type: 'feature',
            descriptionKey: 'releases.apr2026.remoteWorkflow.changes.realtime'
          },
          {
            id: 'apr-r2',
            type: 'feature',
            descriptionKey: 'releases.apr2026.remoteWorkflow.changes.payments'
          },
          {
            id: 'apr-r3',
            type: 'feature',
            descriptionKey: 'releases.apr2026.remoteWorkflow.changes.paidRevisions'
          },
          {
            id: 'apr-r4',
            type: 'feature',
            descriptionKey: 'releases.apr2026.remoteWorkflow.changes.notifications'
          },
          {
            id: 'apr-r5',
            type: 'improvement',
            descriptionKey: 'releases.apr2026.remoteWorkflow.changes.editing'
          }
        ]
      }
    ]
  },
  {
    monthKey: 'months.mar2026',
    releases: [
      {
        version: 'mar-business-operations',
        dateKey: 'releases.mar2026.businessOps.date',
        titleKey: 'releases.mar2026.businessOps.title',
        descriptionKey: 'releases.mar2026.businessOps.description',
        changes: [
          {
            id: 'mar-b1',
            type: 'feature',
            descriptionKey: 'releases.mar2026.businessOps.changes.billing'
          },
          {
            id: 'mar-b2',
            type: 'feature',
            descriptionKey: 'releases.mar2026.businessOps.changes.calendar'
          },
          {
            id: 'mar-b3',
            type: 'improvement',
            descriptionKey: 'releases.mar2026.businessOps.changes.notifications'
          }
        ]
      },
      {
        version: 'mar-trust-support',
        dateKey: 'releases.mar2026.trustSupport.date',
        titleKey: 'releases.mar2026.trustSupport.title',
        descriptionKey: 'releases.mar2026.trustSupport.description',
        changes: [
          {
            id: 'mar-t1',
            type: 'feature',
            descriptionKey: 'releases.mar2026.trustSupport.changes.status'
          },
          {
            id: 'mar-t2',
            type: 'feature',
            descriptionKey: 'releases.mar2026.trustSupport.changes.infoPages'
          },
          {
            id: 'mar-t3',
            type: 'improvement',
            descriptionKey: 'releases.mar2026.trustSupport.changes.localization'
          }
        ]
      }
    ]
  },
  {
    monthKey: 'months.feb2026',
    releases: [
      {
        version: 'feb-stats-dashboard-ux',
        dateKey: 'releases.feb2026.statsPolish.date',
        titleKey: 'releases.feb2026.statsPolish.title',
        descriptionKey: 'releases.feb2026.statsPolish.description',
        changes: [
          { id: 'sp1', type: 'improvement', descriptionKey: 'releases.feb2026.statsPolish.changes.studioChart' },
          { id: 'sp2', type: 'improvement', descriptionKey: 'releases.feb2026.statsPolish.changes.readableNumbers' },
          { id: 'sp3', type: 'improvement', descriptionKey: 'releases.feb2026.statsPolish.changes.accessibility' },
          { id: 'sp4', type: 'improvement', descriptionKey: 'releases.feb2026.statsPolish.changes.customerModal' }
        ]
      },
      {
        version: 'feb-accessibility',
        dateKey: 'releases.feb2026.accessibility.date',
        titleKey: 'releases.feb2026.accessibility.title',
        descriptionKey: 'releases.feb2026.accessibility.description',
        changes: [
          { id: 'a11y1', type: 'feature', descriptionKey: 'releases.feb2026.accessibility.changes.toolbar' },
          { id: 'a11y2', type: 'feature', descriptionKey: 'releases.feb2026.accessibility.changes.saved' }
        ]
      },
      {
        version: 'feb-remote-projects',
        dateKey: 'releases.feb2026.remoteProjects.date',
        titleKey: 'releases.feb2026.remoteProjects.title',
        descriptionKey: 'releases.feb2026.remoteProjects.description',
        changes: [
          { id: 'rp1', type: 'feature', descriptionKey: 'releases.feb2026.remoteProjects.changes.workflow' },
          { id: 'rp2', type: 'feature', descriptionKey: 'releases.feb2026.remoteProjects.changes.chat' },
          { id: 'rp3', type: 'feature', descriptionKey: 'releases.feb2026.remoteProjects.changes.uploads' },
          { id: 'rp4', type: 'feature', descriptionKey: 'releases.feb2026.remoteProjects.changes.payments' }
        ]
      }
    ]
  },
  {
    monthKey: 'months.jan2026',
    releases: [
      {
        version: 'jan-theme-support',
        dateKey: 'releases.jan2026.theme.date',
        titleKey: 'releases.jan2026.theme.title',
        descriptionKey: 'releases.jan2026.theme.description',
        changes: [
          { id: '0a', type: 'feature', descriptionKey: 'releases.jan2026.theme.changes.toggle' },
          { id: '0b', type: 'feature', descriptionKey: 'releases.jan2026.theme.changes.lightMode' },
          { id: '0c', type: 'improvement', descriptionKey: 'releases.jan2026.theme.changes.notifications' },
          { id: '0d', type: 'improvement', descriptionKey: 'releases.jan2026.theme.changes.search' },
          { id: '0e', type: 'improvement', descriptionKey: 'releases.jan2026.theme.changes.smooth' }
        ]
      },
      {
        version: 'jan-dashboard-analytics',
        dateKey: 'releases.jan2026.dashboard.date',
        titleKey: 'releases.jan2026.dashboard.title',
        descriptionKey: 'releases.jan2026.dashboard.description',
        changes: [
          { id: '1', type: 'feature', descriptionKey: 'releases.jan2026.dashboard.changes.stats' },
          { id: '2', type: 'feature', descriptionKey: 'releases.jan2026.dashboard.changes.activity' },
          { id: '3', type: 'improvement', descriptionKey: 'releases.jan2026.dashboard.changes.realtime' }
        ]
      },
      {
        version: 'jan-payments',
        dateKey: 'releases.jan2026.payments.date',
        titleKey: 'releases.jan2026.payments.title',
        descriptionKey: 'releases.jan2026.payments.description',
        changes: [
          { id: '4', type: 'feature', descriptionKey: 'releases.jan2026.payments.changes.savedCards' },
          { id: '5', type: 'feature', descriptionKey: 'releases.jan2026.payments.changes.coupons' },
          { id: '6', type: 'improvement', descriptionKey: 'releases.jan2026.payments.changes.flow' }
        ]
      },
      {
        version: 'jan-booking',
        dateKey: 'releases.jan2026.booking.date',
        titleKey: 'releases.jan2026.booking.title',
        descriptionKey: 'releases.jan2026.booking.description',
        changes: [
          { id: '7', type: 'feature', descriptionKey: 'releases.jan2026.booking.changes.howItWorks' },
          { id: '8', type: 'feature', descriptionKey: 'releases.jan2026.booking.changes.calendar' },
          { id: '9', type: 'improvement', descriptionKey: 'releases.jan2026.booking.changes.availability' },
          { id: '10', type: 'fix', descriptionKey: 'releases.jan2026.booking.changes.timeFix' }
        ]
      },
      {
        version: 'jan-studio-management',
        dateKey: 'releases.jan2026.studioMgmt.date',
        titleKey: 'releases.jan2026.studioMgmt.title',
        descriptionKey: 'releases.jan2026.studioMgmt.description',
        changes: [
          { id: '11', type: 'feature', descriptionKey: 'releases.jan2026.studioMgmt.changes.portfolio' },
          { id: '12', type: 'feature', descriptionKey: 'releases.jan2026.studioMgmt.changes.equipment' },
          { id: '13', type: 'improvement', descriptionKey: 'releases.jan2026.studioMgmt.changes.forms' }
        ]
      },
      {
        version: 'jan-reservations',
        dateKey: 'releases.jan2026.reservations.date',
        titleKey: 'releases.jan2026.reservations.title',
        descriptionKey: 'releases.jan2026.reservations.description',
        changes: [
          { id: '14', type: 'feature', descriptionKey: 'releases.jan2026.reservations.changes.edit' },
          { id: '15', type: 'feature', descriptionKey: 'releases.jan2026.reservations.changes.search' },
          { id: '16', type: 'improvement', descriptionKey: 'releases.jan2026.reservations.changes.status' }
        ]
      }
    ]
  },
  {
    monthKey: 'months.dec2025',
    releases: [
      {
        version: 'dec-onboarding',
        dateKey: 'releases.dec2025.onboarding.date',
        titleKey: 'releases.dec2025.onboarding.title',
        descriptionKey: 'releases.dec2025.onboarding.description',
        changes: [
          { id: '17', type: 'feature', descriptionKey: 'releases.dec2025.onboarding.changes.steps' },
          { id: '18', type: 'feature', descriptionKey: 'releases.dec2025.onboarding.changes.validation' },
          { id: '19', type: 'improvement', descriptionKey: 'releases.dec2025.onboarding.changes.guidance' }
        ]
      },
      {
        version: 'dec-landing',
        dateKey: 'releases.dec2025.landing.date',
        titleKey: 'releases.dec2025.landing.title',
        descriptionKey: 'releases.dec2025.landing.description',
        changes: [
          { id: '20', type: 'feature', descriptionKey: 'releases.dec2025.landing.changes.citySelect' },
          { id: '21', type: 'feature', descriptionKey: 'releases.dec2025.landing.changes.categories' },
          { id: '22', type: 'feature', descriptionKey: 'releases.dec2025.landing.changes.forOwners' }
        ]
      },
      {
        version: 'dec-forms',
        dateKey: 'releases.dec2025.forms.date',
        titleKey: 'releases.dec2025.forms.title',
        descriptionKey: 'releases.dec2025.forms.description',
        changes: [
          { id: '23', type: 'feature', descriptionKey: 'releases.dec2025.forms.changes.stepped' },
          { id: '24', type: 'feature', descriptionKey: 'releases.dec2025.forms.changes.policies' },
          { id: '25', type: 'improvement', descriptionKey: 'releases.dec2025.forms.changes.dualLang' }
        ]
      },
      {
        version: 'dec-discovery',
        dateKey: 'releases.dec2025.discovery.date',
        titleKey: 'releases.dec2025.discovery.title',
        descriptionKey: 'releases.dec2025.discovery.description',
        changes: [
          { id: '26', type: 'feature', descriptionKey: 'releases.dec2025.discovery.changes.filters' },
          { id: '27', type: 'improvement', descriptionKey: 'releases.dec2025.discovery.changes.cards' },
          { id: '28', type: 'improvement', descriptionKey: 'releases.dec2025.discovery.changes.sharing' }
        ]
      }
    ]
  },
  {
    monthKey: 'months.nov2025',
    releases: [
      {
        version: 'nov-support',
        dateKey: 'releases.nov2025.support.date',
        titleKey: 'releases.nov2025.support.title',
        descriptionKey: 'releases.nov2025.support.description',
        changes: [
          { id: '29', type: 'feature', descriptionKey: 'releases.nov2025.support.changes.chat' },
          { id: '30', type: 'feature', descriptionKey: 'releases.nov2025.support.changes.notifications' }
        ]
      },
      {
        version: 'nov-booking-settings',
        dateKey: 'releases.nov2025.bookingSettings.date',
        titleKey: 'releases.nov2025.bookingSettings.title',
        descriptionKey: 'releases.nov2025.bookingSettings.description',
        changes: [
          { id: '31', type: 'feature', descriptionKey: 'releases.nov2025.bookingSettings.changes.instantBook' },
          { id: '32', type: 'feature', descriptionKey: 'releases.nov2025.bookingSettings.changes.addons' },
          { id: '33', type: 'improvement', descriptionKey: 'releases.nov2025.bookingSettings.changes.pricing' }
        ]
      }
    ]
  }
];

// --- Components ---

function TypeBadge({ type }: { type: ChangeType }) {
  const icons = {
    feature: <AutoAwesomeIcon className="changelog__badge-icon" />,
    improvement: <BoltIcon className="changelog__badge-icon" />,
    fix: <BugIcon className="changelog__badge-icon" />
  };

  return <span className={`changelog__badge changelog__badge--${type}`}>{icons[type]}</span>;
}

export const ChangelogPage: React.FC = () => {
  const { t } = useTranslation('changelog');
  const { openFeedback } = useSentryFeedback();
  const [expandedReleases, setExpandedReleases] = useState<string[]>([CHANGELOG_DATA[0]?.releases[0]?.version || '']);

  const toggleRelease = (version: string) => {
    setExpandedReleases((prev) => (prev.includes(version) ? prev.filter((v) => v !== version) : [...prev, version]));
  };

  return (
    <div className="changelog">
      <div className="changelog__container">
        {/* Header */}
        <header className="changelog__header">
          <h1 className="changelog__title">{t('title', 'עדכוני מערכת')}</h1>
          <p className="changelog__subtitle">{t('subtitle', 'כל הפיצ׳רים החדשים, השיפורים והתיקונים')}</p>
        </header>

        {/* Releases List */}
        <div className="changelog__releases">
          {CHANGELOG_DATA.map((group) => (
            <div key={group.monthKey} className="changelog__month-group">
              <h2 className="changelog__month-title">{t(group.monthKey)}</h2>
              {group.releases.map((release) => (
                <article key={release.version} className="changelog__release">
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
                      <span className="changelog__release-date">{t(release.dateKey)}</span>
                      <h3 className="changelog__release-title">{t(release.titleKey)}</h3>
                      <p className="changelog__release-description">{t(release.descriptionKey)}</p>
                    </div>

                    <button
                      className={`changelog__expand-btn ${
                        expandedReleases.includes(release.version) ? 'changelog__expand-btn--expanded' : ''
                      }`}
                      aria-label={expandedReleases.includes(release.version) ? 'Collapse' : 'Expand'}
                    >
                      <ChevronDownIcon />
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expandedReleases.includes(release.version) && (
                    <div className="changelog__changes">
                      <ul className="changelog__changes-list">
                        {release.changes.map((change) => (
                          <li key={change.id} className="changelog__change-item">
                            <TypeBadge type={change.type} />
                            <span className="changelog__change-text">{t(change.descriptionKey)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ))}
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

          <button onClick={openFeedback} className="changelog__suggestion-trigger" type="button">
            <span>{t('suggestion.placeholder', 'שתפו רעיון חדש...')}</span>
            <SendIcon className="changelog__suggestion-trigger-icon" />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ChangelogPage;
