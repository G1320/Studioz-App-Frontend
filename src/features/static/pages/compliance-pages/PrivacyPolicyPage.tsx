import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useCookieConsent } from '@core/contexts/CookieConsentContext';
import './styles/_index.scss';

const DEFINITION_KEYS = [
  'account',
  'affiliate',
  'company',
  'cookies',
  'country',
  'device',
  'personalData',
  'service',
  'serviceProvider',
  'thirdPartySocialMedia',
  'usageData',
  'website',
  'you'
] as const;

const PERSONAL_DATA_ITEMS = ['email', 'name', 'phone', 'address', 'usageData'] as const;
const SOCIAL_SERVICES = ['google', 'facebook', 'instagram', 'twitter', 'linkedin'] as const;

const PURPOSE_KEYS = [
  'provide',
  'manageAccount',
  'contract',
  'contactYou',
  'provideOffers',
  'manageRequests',
  'businessTransfers',
  'otherPurposes'
] as const;

const SHARING_KEYS = [
  'withServiceProviders',
  'forBusinessTransfers',
  'withAffiliates',
  'withBusinessPartners',
  'withOtherUsers',
  'withConsent'
] as const;

const DISCLOSURE_ITEMS = [
  'legalObligation',
  'protectRights',
  'preventWrongdoing',
  'protectSafety',
  'protectLiability'
] as const;

const RETENTION_CATEGORIES = [
  'accountData',
  'transactions',
  'analytics',
  'communications'
] as const;

const COOKIE_CATEGORIES = ['essential', 'functional', 'analytics', 'marketing'] as const;

const AMENDMENT_RIGHTS = [
  'access',
  'correction',
  'deletion',
  'objection',
  'portability',
  'withdrawConsent'
] as const;

const PrivacyPolicyPage = () => {
  const { t } = useTranslation('privacyPolicy');
  const { openPreferences } = useCookieConsent();

  return (
    <>
      <Helmet>
        <title>{t('meta.title')} | Studioz</title>
      </Helmet>

      <section className="privacy-policy-container">
        <div className="privacy-policy-content">
          {/* Header */}
          <header className="privacy-policy-header">
            <h1>{t('meta.title')}</h1>
            <p className="last-updated">{t('meta.lastUpdated')}</p>
          </header>

          {/* Intro */}
          <p>{t('intro.paragraph1')}</p>
          <p>{t('intro.paragraph2')}</p>

          {/* Table of Contents */}
          <nav className="privacy-policy-toc" aria-label={t('toc.title')}>
            <h2>{t('toc.title')}</h2>
            <ol>
              <li><a href="#interpretation">{t('toc.interpretationAndDefinitions')}</a></li>
              <li><a href="#collecting">{t('toc.collectingAndUsing')}</a></li>
              <li><a href="#tracking">{t('toc.trackingTechnologies')}</a></li>
              <li><a href="#cookie-categories">{t('toc.cookieCategories')}</a></li>
              <li><a href="#use-of-data">{t('toc.useOfData')}</a></li>
              <li><a href="#retention">{t('toc.retention')}</a></li>
              <li><a href="#data-retention">{t('toc.dataRetention')}</a></li>
              <li><a href="#transfer">{t('toc.transfer')}</a></li>
              <li><a href="#delete">{t('toc.deleteData')}</a></li>
              <li><a href="#disclosure">{t('toc.disclosure')}</a></li>
              <li><a href="#security">{t('toc.security')}</a></li>
              <li><a href="#third-party">{t('toc.thirdPartyServices')}</a></li>
              <li><a href="#amendment13">{t('toc.amendment13')}</a></li>
              <li><a href="#children">{t('toc.childrenPrivacy')}</a></li>
              <li><a href="#dpo">{t('toc.dpo')}</a></li>
              <li><a href="#links">{t('toc.links')}</a></li>
              <li><a href="#changes">{t('toc.changes')}</a></li>
              <li><a href="#contact">{t('toc.contact')}</a></li>
            </ol>
          </nav>

          {/* 1. Interpretation and Definitions */}
          <h2 id="interpretation">{t('interpretationAndDefinitions.title')}</h2>
          <h3>{t('interpretationAndDefinitions.interpretation.title')}</h3>
          <p>{t('interpretationAndDefinitions.interpretation.description')}</p>

          <h3>{t('interpretationAndDefinitions.definitions.title')}</h3>
          <p>{t('interpretationAndDefinitions.definitions.intro')}</p>
          <ul>
            {DEFINITION_KEYS.map(key => (
              <li key={key}>
                <p>
                  <strong>{t(`interpretationAndDefinitions.definitions.${key}.term`)}</strong>{' '}
                  {t(`interpretationAndDefinitions.definitions.${key}.definition`)}
                  {key === 'website' && (
                    <>
                      {' '}
                      <a
                        href={t('interpretationAndDefinitions.definitions.website.url')}
                        rel="external nofollow noopener"
                        target="_blank"
                      >
                        {t('interpretationAndDefinitions.definitions.website.url')}
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>

          {/* 2. Collecting and Using Your Personal Data */}
          <h2 id="collecting">{t('dataCollection.title')}</h2>
          <h3>{t('dataCollection.typesOfData.title')}</h3>

          <h4>{t('dataCollection.typesOfData.personalData.title')}</h4>
          <p>{t('dataCollection.typesOfData.personalData.description')}</p>
          <ul>
            {PERSONAL_DATA_ITEMS.map(key => (
              <li key={key}>
                <p>{t(`dataCollection.typesOfData.personalData.items.${key}`)}</p>
              </li>
            ))}
          </ul>

          <h4>{t('dataCollection.typesOfData.usageData.title')}</h4>
          <p>{t('dataCollection.typesOfData.usageData.paragraph1')}</p>
          <p>{t('dataCollection.typesOfData.usageData.paragraph2')}</p>
          <p>{t('dataCollection.typesOfData.usageData.paragraph3')}</p>
          <p>{t('dataCollection.typesOfData.usageData.paragraph4')}</p>

          <h4>{t('dataCollection.typesOfData.thirdPartySocialMedia.title')}</h4>
          <p>{t('dataCollection.typesOfData.thirdPartySocialMedia.description')}</p>
          <ul>
            {SOCIAL_SERVICES.map(key => (
              <li key={key}>{t(`dataCollection.typesOfData.thirdPartySocialMedia.services.${key}`)}</li>
            ))}
          </ul>
          <p>{t('dataCollection.typesOfData.thirdPartySocialMedia.paragraph1')}</p>
          <p>{t('dataCollection.typesOfData.thirdPartySocialMedia.paragraph2')}</p>

          {/* 3. Tracking Technologies and Cookies */}
          <h2 id="tracking">{t('trackingTechnologies.title')}</h2>
          <p>{t('trackingTechnologies.description')}</p>
          <ul>
            <li>
              <strong>{t('trackingTechnologies.browserCookies.title')}</strong>{' '}
              {t('trackingTechnologies.browserCookies.description')}
            </li>
            <li>
              <strong>{t('trackingTechnologies.webBeacons.title')}</strong>{' '}
              {t('trackingTechnologies.webBeacons.description')}
            </li>
          </ul>
          <p>
            {t('trackingTechnologies.cookieTypes.description')}{' '}
            {t('trackingTechnologies.cookieTypes.learnMore')}{' '}
            <a
              href={t('trackingTechnologies.cookieTypes.learnMoreUrl')}
              target="_blank"
              rel="external nofollow noopener"
            >
              {t('trackingTechnologies.cookieTypes.learnMoreLink')}
            </a>
          </p>
          <p>{t('trackingTechnologies.usage')}</p>
          <ul>
            {(['necessary', 'acceptance', 'functionality', 'tracking'] as const).map(key => (
              <li key={key}>
                <p><strong>{t(`trackingTechnologies.${key}.title`)}</strong></p>
                <p>{t(`trackingTechnologies.${key}.type`)}</p>
                <p>{t(`trackingTechnologies.${key}.administeredBy`)}</p>
                <p>{t(`trackingTechnologies.${key}.purpose`)}</p>
              </li>
            ))}
          </ul>
          <p>{t('trackingTechnologies.moreInfo')}</p>

          {/* 4. Cookie Categories Table */}
          <h2 id="cookie-categories">{t('cookieCategories.title')}</h2>
          <p>{t('cookieCategories.description')}</p>
          <div className="privacy-policy-table-wrapper">
            <table className="privacy-policy-table">
              <caption className="visually-hidden">{t('cookieCategories.title')}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('cookieCategories.tableHeaders.category')}</th>
                  <th scope="col">{t('cookieCategories.tableHeaders.services')}</th>
                  <th scope="col">{t('cookieCategories.tableHeaders.purpose')}</th>
                  <th scope="col">{t('cookieCategories.tableHeaders.duration')}</th>
                </tr>
              </thead>
              <tbody>
                {COOKIE_CATEGORIES.map(cat => (
                  <tr key={cat}>
                    <td><strong>{t(`cookieCategories.${cat}.name`)}</strong></td>
                    <td>
                      <ul>
                        {Object.keys(
                          (t(`cookieCategories.${cat}.services`, { returnObjects: true }) || {}) as Record<string, string>
                        ).map(svc => (
                          <li key={svc}>{t(`cookieCategories.${cat}.services.${svc}`)}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{t(`cookieCategories.${cat}.purpose`)}</td>
                    <td>{t(`cookieCategories.${cat}.duration`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <button
              type="button"
              className="privacy-policy-manage-btn"
              onClick={openPreferences}
            >
              {t('cookieCategories.manageButton')}
            </button>
          </p>

          {/* 5. Use of Your Personal Data */}
          <h2 id="use-of-data">{t('useOfData.title')}</h2>
          <p>{t('useOfData.description')}</p>
          <ul>
            {PURPOSE_KEYS.map(key => (
              <li key={key}>
                <p>
                  <strong>{t(`useOfData.purposes.${key}.title`)}</strong>
                  {t(`useOfData.purposes.${key}.description`)}
                </p>
              </li>
            ))}
          </ul>

          <p>{t('useOfData.sharing.description')}</p>
          <ul>
            {SHARING_KEYS.map(key => (
              <li key={key}>
                <strong>{t(`useOfData.sharing.${key}.title`)}</strong>{' '}
                {t(`useOfData.sharing.${key}.description`)}
              </li>
            ))}
          </ul>

          {/* 6. Retention */}
          <h2 id="retention">{t('dataRetention.general.title')}</h2>
          <p>{t('dataRetention.general.paragraph1')}</p>
          <p>{t('dataRetention.general.paragraph2')}</p>

          {/* 7. Data Retention Periods */}
          <h2 id="data-retention">{t('dataRetention.title')}</h2>
          <p>{t('dataRetention.description')}</p>
          <div className="privacy-policy-table-wrapper">
            <table className="privacy-policy-table">
              <caption className="visually-hidden">{t('dataRetention.title')}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('cookieCategories.tableHeaders.category')}</th>
                  <th scope="col">{t('cookieCategories.tableHeaders.duration')}</th>
                  <th scope="col">{t('cookieCategories.tableHeaders.purpose')}</th>
                </tr>
              </thead>
              <tbody>
                {RETENTION_CATEGORIES.map(key => (
                  <tr key={key}>
                    <td><strong>{t(`dataRetention.categories.${key}.title`)}</strong></td>
                    <td>{t(`dataRetention.categories.${key}.period`)}</td>
                    <td>{t(`dataRetention.categories.${key}.description`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 8. Transfer */}
          <h2 id="transfer">{t('dataTransfer.title')}</h2>
          <p>{t('dataTransfer.paragraph1')}</p>
          <p>{t('dataTransfer.paragraph2')}</p>
          <p>{t('dataTransfer.paragraph3')}</p>

          {/* 9. Delete Your Personal Data */}
          <h2 id="delete">{t('deleteData.title')}</h2>
          <p>{t('deleteData.paragraph1')}</p>
          <p>{t('deleteData.paragraph2')}</p>
          <p>{t('deleteData.paragraph3')}</p>
          <p>{t('deleteData.paragraph4')}</p>

          {/* 10. Disclosure */}
          <h2 id="disclosure">{t('disclosure.title')}</h2>
          <h3>{t('disclosure.businessTransactions.title')}</h3>
          <p>{t('disclosure.businessTransactions.description')}</p>
          <h3>{t('disclosure.lawEnforcement.title')}</h3>
          <p>{t('disclosure.lawEnforcement.description')}</p>
          <h3>{t('disclosure.otherRequirements.title')}</h3>
          <p>{t('disclosure.otherRequirements.description')}</p>
          <ul>
            {DISCLOSURE_ITEMS.map(key => (
              <li key={key}>{t(`disclosure.otherRequirements.items.${key}`)}</li>
            ))}
          </ul>

          {/* 11. Security */}
          <h2 id="security">{t('dataSecurity.title')}</h2>
          <p>{t('dataSecurity.description')}</p>

          {/* 12. Third-Party Services */}
          <h2 id="third-party">{t('thirdPartyServices.title')}</h2>
          <p>{t('thirdPartyServices.description')}</p>

          <h3>{t('thirdPartyServices.analytics.title')}</h3>
          <p>{t('thirdPartyServices.analytics.description')}</p>
          <ul>
            <li>
              <p><strong>{t('thirdPartyServices.analytics.googleAnalytics.title')}</strong></p>
              <p>{t('thirdPartyServices.analytics.googleAnalytics.description')}</p>
              <p>{t('thirdPartyServices.analytics.googleAnalytics.optOut')}</p>
              <p>
                {t('thirdPartyServices.analytics.googleAnalytics.moreInfo')}{' '}
                <a
                  href={t('thirdPartyServices.analytics.googleAnalytics.privacyUrl')}
                  rel="external nofollow noopener"
                  target="_blank"
                >
                  {t('thirdPartyServices.analytics.googleAnalytics.privacyUrl')}
                </a>
              </p>
            </li>
            <li>
              <p><strong>{t('thirdPartyServices.analytics.microsoftClarity.title')}</strong></p>
              <p>{t('thirdPartyServices.analytics.microsoftClarity.description')}</p>
              <p>
                {t('thirdPartyServices.analytics.microsoftClarity.moreInfo')}{' '}
                <a
                  href={t('thirdPartyServices.analytics.microsoftClarity.privacyUrl')}
                  rel="external nofollow noopener"
                  target="_blank"
                >
                  {t('thirdPartyServices.analytics.microsoftClarity.privacyUrl')}
                </a>
              </p>
            </li>
          </ul>

          <h3>{t('thirdPartyServices.payments.title')}</h3>
          <p>{t('thirdPartyServices.payments.description')}</p>
          <p>{t('thirdPartyServices.payments.noStorage')}</p>
          <ul>
            <li>
              <p><strong>{t('thirdPartyServices.payments.paypal.title')}</strong></p>
              <p>
                {t('thirdPartyServices.payments.paypal.moreInfo')}{' '}
                <a
                  href={t('thirdPartyServices.payments.paypal.privacyUrl')}
                  rel="external nofollow noopener"
                  target="_blank"
                >
                  {t('thirdPartyServices.payments.paypal.privacyUrl')}
                </a>
              </p>
            </li>
          </ul>

          <h3>{t('thirdPartyServices.usagePerformance.title')}</h3>
          <p>{t('thirdPartyServices.usagePerformance.description')}</p>
          <ul>
            <li>
              <p><strong>{t('thirdPartyServices.usagePerformance.googlePlaces.title')}</strong></p>
              <p>{t('thirdPartyServices.usagePerformance.googlePlaces.description')}</p>
              <p>{t('thirdPartyServices.usagePerformance.googlePlaces.dataCollection')}</p>
              <p>
                {t('thirdPartyServices.usagePerformance.googlePlaces.moreInfo')}{' '}
                <a
                  href={t('thirdPartyServices.usagePerformance.googlePlaces.privacyUrl')}
                  rel="external nofollow noopener"
                  target="_blank"
                >
                  {t('thirdPartyServices.usagePerformance.googlePlaces.privacyUrl')}
                </a>
              </p>
            </li>
          </ul>

          {/* 13. Amendment 13 — Your Rights */}
          <h2 id="amendment13">{t('amendment13.title')}</h2>
          <p>{t('amendment13.intro')}</p>
          {AMENDMENT_RIGHTS.map(key => (
            <div key={key}>
              <h3>{t(`amendment13.rights.${key}.title`)}</h3>
              <p>{t(`amendment13.rights.${key}.description`)}</p>
            </div>
          ))}
          <h3>{t('amendment13.exercising.title')}</h3>
          <p>{t('amendment13.exercising.description')}</p>
          <p>{t('amendment13.exercising.verification')}</p>
          <h3>{t('amendment13.responseTime.title')}</h3>
          <p>{t('amendment13.responseTime.description')}</p>

          {/* 14. Children's Privacy */}
          <h2 id="children">{t('childrenPrivacy.title')}</h2>
          <p>{t('childrenPrivacy.paragraph1')}</p>
          <p>{t('childrenPrivacy.paragraph2')}</p>

          {/* 15. DPO */}
          <h2 id="dpo">{t('dpo.title')}</h2>
          <p>{t('dpo.description')}</p>
          <p>
            {t('dpo.contactLabel')}{' '}
            <a href={`mailto:${t('dpo.email')}`}>{t('dpo.email')}</a>
          </p>

          {/* 16. Links */}
          <h2 id="links">{t('links.title')}</h2>
          <p>{t('links.paragraph1')}</p>
          <p>{t('links.paragraph2')}</p>

          {/* 17. Changes */}
          <h2 id="changes">{t('changes.title')}</h2>
          <p>{t('changes.paragraph1')}</p>
          <p>{t('changes.paragraph2')}</p>
          <p>{t('changes.paragraph3')}</p>

          {/* 18. Contact */}
          <h2 id="contact">{t('contact.title')}</h2>
          <p>{t('contact.description')}</p>
          <ul>
            <li>
              {t('contact.emailLabel')}{' '}
              <a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a>
            </li>
            <li>
              {t('contact.addressLabel')} {t('contact.address')}
            </li>
            <li>
              {t('contact.websiteLabel')}{' '}
              <a
                href={t('contact.website')}
                rel="external nofollow noopener"
                target="_blank"
              >
                {t('contact.website')}
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
