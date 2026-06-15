import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './styles/_index.scss';

const WEBSITE_MEASURE_KEYS = [
  'bilingual',
  'semantic',
  'skipLinks',
  'toolbar',
  'aria',
  'routeAnnouncer',
  'forms',
  'modals',
  'images',
  'keyboard',
  'motion',
  'cookies',
  'privacy'
] as const;

const BROWSER_KEYS = ['chrome', 'firefox', 'safari', 'edge'] as const;

const ASSISTIVE_KEYS = ['voiceover', 'nvda', 'talkback', 'keyboard'] as const;

const LIMITATION_KEYS = [
  'partialConformance',
  'contrast',
  'iconButtons',
  'fieldsets',
  'tables',
  'thirdParty',
  'userContent',
  'automatedTesting'
] as const;

const REQUEST_ITEM_KEYS = [
  'description',
  'page',
  'browser',
  'assistive',
  'contact'
] as const;

const ASSESSMENT_METHOD_KEYS = [
  'selfEvaluation',
  'codeReview',
  'manualTesting',
  'documentation'
] as const;

const AccessibilityStatementPage = () => {
  const { t } = useTranslation('accessibilityStatement');

  return (
    <>
      <Helmet>
        <title>{t('meta.title')} | Studioz</title>
      </Helmet>

      <section className="privacy-policy-container">
        <div className="privacy-policy-content">
          <header className="privacy-policy-header">
            <h1>{t('meta.title')}</h1>
            <p className="last-updated">{t('meta.lastUpdated')}</p>
          </header>

          <p>{t('intro.paragraph1')}</p>
          <p>{t('intro.paragraph2')}</p>

          <nav className="privacy-policy-toc" aria-label={t('toc.title')}>
            <h2>{t('toc.title')}</h2>
            <ol>
              <li><a href="#general">{t('toc.general')}</a></li>
              <li><a href="#commitment">{t('toc.commitment')}</a></li>
              <li><a href="#conformance">{t('toc.conformance')}</a></li>
              <li><a href="#website-measures">{t('toc.websiteMeasures')}</a></li>
              <li><a href="#physical-access">{t('toc.physicalAccess')}</a></li>
              <li><a href="#assistive-tech">{t('toc.assistiveTech')}</a></li>
              <li><a href="#known-limitations">{t('toc.knownLimitations')}</a></li>
              <li><a href="#feedback">{t('toc.feedback')}</a></li>
              <li><a href="#coordinator">{t('toc.coordinator')}</a></li>
              <li><a href="#assessment">{t('toc.assessment')}</a></li>
              <li><a href="#enforcement">{t('toc.enforcement')}</a></li>
              <li><a href="#related">{t('toc.related')}</a></li>
            </ol>
          </nav>

          <h2 id="general">{t('general.title')}</h2>
          <p>{t('general.paragraph1')}</p>
          <p>{t('general.paragraph2')}</p>
          <ul>
            <li>{t('general.companyName')}</li>
            <li>{t('general.address')}</li>
            <li>
              {t('general.website')}{' '}
              <a href={t('general.websiteUrl')} rel="external noopener" target="_blank">
                {t('general.websiteUrl')}
              </a>
            </li>
            <li>
              <a href={`mailto:${t('coordinator.email')}`}>{t('general.serviceEmail')}</a>
            </li>
          </ul>

          <h2 id="commitment">{t('commitment.title')}</h2>
          <p>{t('commitment.paragraph1')}</p>
          <p>{t('commitment.paragraph2')}</p>

          <h2 id="conformance">{t('conformance.title')}</h2>
          <p>{t('conformance.paragraph1')}</p>
          <p>
            <strong>{t('conformance.statusLabel')}</strong> {t('conformance.status')}
          </p>
          <p>{t('conformance.paragraph2')}</p>

          <h2 id="website-measures">{t('websiteMeasures.title')}</h2>
          <p>{t('websiteMeasures.intro')}</p>
          <ul>
            {WEBSITE_MEASURE_KEYS.map((key) => (
              <li key={key}>{t(`websiteMeasures.items.${key}`)}</li>
            ))}
          </ul>

          <h2 id="physical-access">{t('physicalAccess.title')}</h2>
          <p>{t('physicalAccess.paragraph1')}</p>
          <p>{t('physicalAccess.paragraph2')}</p>

          <h2 id="assistive-tech">{t('assistiveTech.title')}</h2>
          <p>{t('assistiveTech.intro')}</p>
          <h3>{t('assistiveTech.browsers.title')}</h3>
          <ul>
            {BROWSER_KEYS.map((key) => (
              <li key={key}>{t(`assistiveTech.browsers.items.${key}`)}</li>
            ))}
          </ul>
          <h3>{t('assistiveTech.assistive.title')}</h3>
          <ul>
            {ASSISTIVE_KEYS.map((key) => (
              <li key={key}>{t(`assistiveTech.assistive.items.${key}`)}</li>
            ))}
          </ul>
          <p>{t('assistiveTech.note')}</p>

          <h2 id="known-limitations">{t('knownLimitations.title')}</h2>
          <p>{t('knownLimitations.intro')}</p>
          <ul>
            {LIMITATION_KEYS.map((key) => (
              <li key={key}>{t(`knownLimitations.items.${key}`)}</li>
            ))}
          </ul>
          <p>{t('knownLimitations.closing')}</p>

          <h2 id="feedback">{t('feedback.title')}</h2>
          <p>{t('feedback.paragraph1')}</p>
          <p>{t('feedback.paragraph2')}</p>
          <ul>
            {REQUEST_ITEM_KEYS.map((key) => (
              <li key={key}>{t(`feedback.requestItems.${key}`)}</li>
            ))}
          </ul>
          <p>{t('feedback.paragraph3')}</p>
          <p>{t('feedback.paragraph4')}</p>

          <h2 id="coordinator">{t('coordinator.title')}</h2>
          <p>{t('coordinator.intro')}</p>
          <address className="accessibility-coordinator-contact">
            <p>
              <strong>{t('coordinator.nameLabel')}</strong> {t('coordinator.name')}
            </p>
            <p>
              <strong>{t('coordinator.emailLabel')}</strong>{' '}
              <a href={`mailto:${t('coordinator.email')}`}>{t('coordinator.email')}</a>
            </p>
            <p>
              <strong>{t('coordinator.phoneLabel')}</strong>{' '}
              <a href={`tel:${t('coordinator.phoneTel')}`}>{t('coordinator.phone')}</a>
            </p>
            <p>
              <strong>{t('coordinator.addressLabel')}</strong> {t('coordinator.address')}
            </p>
            <p>
              <strong>{t('coordinator.responseTimeLabel')}</strong> {t('coordinator.responseTime')}
            </p>
          </address>

          <h2 id="assessment">{t('assessment.title')}</h2>
          <p>{t('assessment.paragraph1')}</p>
          <ul>
            {ASSESSMENT_METHOD_KEYS.map((key) => (
              <li key={key}>{t(`assessment.methods.${key}`)}</li>
            ))}
          </ul>
          <p>
            <strong>{t('assessment.lastAuditLabel')}</strong> {t('assessment.lastAudit')}
          </p>
          <p>
            <strong>{t('assessment.nextReviewLabel')}</strong> {t('assessment.nextReview')}
          </p>

          <h2 id="enforcement">{t('enforcement.title')}</h2>
          <p>{t('enforcement.paragraph1')}</p>
          <p>
            <strong>{t('enforcement.commissionName')}</strong>
            {' — '}
            <a href={t('enforcement.commissionUrl')} rel="external noopener" target="_blank">
              {t('enforcement.commissionLinkText')}
            </a>
          </p>
          <p>{t('enforcement.paragraph2')}</p>

          <h2 id="related">{t('related.title')}</h2>
          <ul>
            <li>
              <Link to="../privacy">{t('related.privacy')}</Link>
            </li>
            <li>
              <Link to="../terms">{t('related.terms')}</Link>
            </li>
          </ul>
          <p>{t('related.termsAccessibilityNote')}</p>
        </div>
      </section>
    </>
  );
};

export default AccessibilityStatementPage;
