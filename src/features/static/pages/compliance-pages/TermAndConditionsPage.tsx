import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './styles/_index.scss';

const DEFINITION_KEYS = [
  'account',
  'booking',
  'company',
  'content',
  'country',
  'device',
  'listing',
  'platform',
  'renter',
  'service',
  'serviceFee',
  'studioOwner',
  'studio',
  'user',
  'website'
] as const;

const STUDIO_OWNER_OBLIGATION_KEYS = [
  'accuracy',
  'legal',
  'availability',
  'condition',
  'insurance',
  'taxes',
  'accessibility'
] as const;

const RENTER_OBLIGATION_KEYS = [
  'rules',
  'care',
  'timing',
  'damage',
  'legal',
  'occupancy'
] as const;

const CONSUMER_RIGHT_KEYS = ['timeframe', 'refund', 'method'] as const;

const PLATFORM_CANCELLATION_KEYS = ['renter', 'studioOwner', 'noShow', 'force'] as const;

const CONTENT_RESTRICTION_KEYS = [
  'unlawful',
  'defamatory',
  'spam',
  'malware',
  'infringement',
  'impersonation',
  'privacy',
  'false'
] as const;

const INDEMNIFICATION_KEYS = ['breach', 'content', 'use', 'violation', 'rights'] as const;

const TermAndConditionsPage = () => {
  const { t, i18n } = useTranslation('termsAndConditions');

  return (
    <>
      <Helmet>
        <title>{t('meta.title')} | Studioz</title>
      </Helmet>

      <section className="terms-container">
        <div className="terms-content">
          {/* Header */}
          <header className="terms-header">
            <h1>{t('meta.title')}</h1>
            <p className="last-updated">{t('meta.lastUpdated')}</p>
          </header>

          {/* Intro */}
          <p>{t('intro.paragraph1')}</p>
          <p>{t('intro.paragraph2')}</p>

          {/* Table of Contents */}
          <nav className="terms-toc" aria-label={t('toc.title')}>
            <h2>{t('toc.title')}</h2>
            <ol>
              <li><a href="#interpretation">{t('toc.interpretationAndDefinitions')}</a></li>
              <li><a href="#acknowledgment">{t('toc.acknowledgment')}</a></li>
              <li><a href="#platform">{t('toc.thePlatform')}</a></li>
              <li><a href="#accounts">{t('toc.userAccounts')}</a></li>
              <li><a href="#studio-owner">{t('toc.studioOwnerTerms')}</a></li>
              <li><a href="#renter">{t('toc.renterTerms')}</a></li>
              <li><a href="#bookings">{t('toc.bookings')}</a></li>
              <li><a href="#cancellation">{t('toc.cancellation')}</a></li>
              <li><a href="#fees">{t('toc.feesAndPayments')}</a></li>
              <li><a href="#user-content">{t('toc.userContent')}</a></li>
              <li><a href="#content-restrictions">{t('toc.contentRestrictions')}</a></li>
              <li><a href="#intellectual-property">{t('toc.intellectualProperty')}</a></li>
              <li><a href="#liability">{t('toc.limitationOfLiability')}</a></li>
              <li><a href="#disclaimer">{t('toc.disclaimer')}</a></li>
              <li><a href="#indemnification">{t('toc.indemnification')}</a></li>
              <li><a href="#governing-law">{t('toc.governingLaw')}</a></li>
              <li><a href="#disputes">{t('toc.disputeResolution')}</a></li>
              <li><a href="#force-majeure">{t('toc.forceMajeure')}</a></li>
              <li><a href="#privacy">{t('toc.privacy')}</a></li>
              <li><a href="#accessibility">{t('toc.accessibility')}</a></li>
              <li><a href="#severability">{t('toc.severabilityAndWaiver')}</a></li>
              <li><a href="#changes">{t('toc.changesToTerms')}</a></li>
              <li><a href="#contact">{t('toc.contactUs')}</a></li>
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

          {/* 2. Acknowledgment */}
          <h2 id="acknowledgment">{t('acknowledgment.title')}</h2>
          <p>{t('acknowledgment.paragraph1')}</p>
          <p>{t('acknowledgment.paragraph2')}</p>
          <p>{t('acknowledgment.paragraph3')}</p>
          <p>{t('acknowledgment.paragraph4')}</p>
          <p>
            {t('acknowledgment.paragraph5')}{' '}
            <Link to={`/${i18n.language}/privacy`}>
              {t('privacy.linkText')}
            </Link>
          </p>

          {/* 3. The Platform */}
          <h2 id="platform">{t('thePlatform.title')}</h2>
          <p>{t('thePlatform.paragraph1')}</p>
          <p>{t('thePlatform.paragraph2')}</p>
          <p>{t('thePlatform.paragraph3')}</p>
          <p>{t('thePlatform.paragraph4')}</p>

          {/* 4. User Accounts */}
          <h2 id="accounts">{t('userAccounts.title')}</h2>
          <p>{t('userAccounts.paragraph1')}</p>
          <p>{t('userAccounts.paragraph2')}</p>
          <p>{t('userAccounts.paragraph3')}</p>
          <p>{t('userAccounts.paragraph4')}</p>
          <p>{t('userAccounts.paragraph5')}</p>

          {/* 5. Studio Owner Terms */}
          <h2 id="studio-owner">{t('studioOwnerTerms.title')}</h2>
          <h3>{t('studioOwnerTerms.obligations.title')}</h3>
          <p>{t('studioOwnerTerms.obligations.description')}</p>
          <ul>
            {STUDIO_OWNER_OBLIGATION_KEYS.map(key => (
              <li key={key}>{t(`studioOwnerTerms.obligations.items.${key}`)}</li>
            ))}
          </ul>
          <h3>{t('studioOwnerTerms.listings.title')}</h3>
          <p>{t('studioOwnerTerms.listings.paragraph1')}</p>
          <p>{t('studioOwnerTerms.listings.paragraph2')}</p>

          {/* 6. Renter Terms */}
          <h2 id="renter">{t('renterTerms.title')}</h2>
          <h3>{t('renterTerms.obligations.title')}</h3>
          <p>{t('renterTerms.obligations.description')}</p>
          <ul>
            {RENTER_OBLIGATION_KEYS.map(key => (
              <li key={key}>{t(`renterTerms.obligations.items.${key}`)}</li>
            ))}
          </ul>

          {/* 7. Bookings and Reservations */}
          <h2 id="bookings">{t('bookings.title')}</h2>
          <p>{t('bookings.paragraph1')}</p>
          <p>{t('bookings.paragraph2')}</p>
          <p>{t('bookings.paragraph3')}</p>

          {/* 8. Cancellation Policy */}
          <h2 id="cancellation">{t('cancellation.title')}</h2>
          <h3>{t('cancellation.consumerRights.title')}</h3>
          <p>{t('cancellation.consumerRights.paragraph1')}</p>
          <ul>
            {CONSUMER_RIGHT_KEYS.map(key => (
              <li key={key}>{t(`cancellation.consumerRights.items.${key}`)}</li>
            ))}
          </ul>
          <h3>{t('cancellation.platformPolicy.title')}</h3>
          <p>{t('cancellation.platformPolicy.paragraph1')}</p>
          <ul>
            {PLATFORM_CANCELLATION_KEYS.map(key => (
              <li key={key}>{t(`cancellation.platformPolicy.items.${key}`)}</li>
            ))}
          </ul>

          {/* 9. Fees and Payments */}
          <h2 id="fees">{t('feesAndPayments.title')}</h2>
          <h3>{t('feesAndPayments.serviceFees.title')}</h3>
          <p>{t('feesAndPayments.serviceFees.paragraph1')}</p>
          <p>{t('feesAndPayments.serviceFees.paragraph2')}</p>
          <p>{t('feesAndPayments.serviceFees.paragraph3')}</p>
          <h3>{t('feesAndPayments.payments.title')}</h3>
          <p>{t('feesAndPayments.payments.paragraph1')}</p>
          <p>{t('feesAndPayments.payments.paragraph2')}</p>
          <p>{t('feesAndPayments.payments.paragraph3')}</p>
          <h3>{t('feesAndPayments.taxes.title')}</h3>
          <p>{t('feesAndPayments.taxes.paragraph1')}</p>
          <p>{t('feesAndPayments.taxes.paragraph2')}</p>

          {/* 10. User Content */}
          <h2 id="user-content">{t('userContent.title')}</h2>
          <h3>{t('userContent.posting.title')}</h3>
          <p>{t('userContent.posting.paragraph1')}</p>
          <p>{t('userContent.posting.paragraph2')}</p>
          <p>{t('userContent.posting.paragraph3')}</p>
          <h3>{t('userContent.reviews.title')}</h3>
          <p>{t('userContent.reviews.paragraph1')}</p>
          <p>{t('userContent.reviews.paragraph2')}</p>
          <p>{t('userContent.reviews.paragraph3')}</p>

          {/* 11. Content Restrictions */}
          <h2 id="content-restrictions">{t('contentRestrictions.title')}</h2>
          <p>{t('contentRestrictions.paragraph1')}</p>
          <ul>
            {CONTENT_RESTRICTION_KEYS.map(key => (
              <li key={key}>{t(`contentRestrictions.items.${key}`)}</li>
            ))}
          </ul>
          <p>{t('contentRestrictions.paragraph2')}</p>

          {/* 12. Intellectual Property */}
          <h2 id="intellectual-property">{t('intellectualProperty.title')}</h2>
          <p>{t('intellectualProperty.paragraph1')}</p>
          <p>{t('intellectualProperty.paragraph2')}</p>
          <p>{t('intellectualProperty.paragraph3')}</p>
          <h3>{t('intellectualProperty.infringement.title')}</h3>
          <p>{t('intellectualProperty.infringement.paragraph1')}</p>
          <p>{t('intellectualProperty.infringement.paragraph2')}</p>
          <p>{t('intellectualProperty.infringement.paragraph3')}</p>
          <h3>{t('intellectualProperty.feedback.title')}</h3>
          <p>{t('intellectualProperty.feedback.paragraph1')}</p>

          {/* 13. Limitation of Liability */}
          <h2 id="liability">{t('limitationOfLiability.title')}</h2>
          <p>{t('limitationOfLiability.paragraph1')}</p>
          <p>{t('limitationOfLiability.paragraph2')}</p>
          <p>{t('limitationOfLiability.paragraph3')}</p>
          <p>{t('limitationOfLiability.paragraph4')}</p>

          {/* 14. Disclaimer */}
          <h2 id="disclaimer">{t('disclaimer.title')}</h2>
          <p>{t('disclaimer.paragraph1')}</p>
          <p>{t('disclaimer.paragraph2')}</p>
          <p>{t('disclaimer.paragraph3')}</p>

          {/* 15. Indemnification */}
          <h2 id="indemnification">{t('indemnification.title')}</h2>
          <p>{t('indemnification.paragraph1')}</p>
          <ul>
            {INDEMNIFICATION_KEYS.map(key => (
              <li key={key}>{t(`indemnification.items.${key}`)}</li>
            ))}
          </ul>

          {/* 16. Governing Law */}
          <h2 id="governing-law">{t('governingLaw.title')}</h2>
          <p>{t('governingLaw.paragraph1')}</p>
          <p>{t('governingLaw.paragraph2')}</p>
          <p>{t('governingLaw.paragraph3')}</p>

          {/* 17. Dispute Resolution */}
          <h2 id="disputes">{t('disputeResolution.title')}</h2>
          <h3>{t('disputeResolution.betweenUsers.title')}</h3>
          <p>{t('disputeResolution.betweenUsers.paragraph1')}</p>
          <p>{t('disputeResolution.betweenUsers.paragraph2')}</p>
          <h3>{t('disputeResolution.withCompany.title')}</h3>
          <p>{t('disputeResolution.withCompany.paragraph1')}</p>
          <p>{t('disputeResolution.withCompany.paragraph2')}</p>

          {/* 18. Force Majeure */}
          <h2 id="force-majeure">{t('forceMajeure.title')}</h2>
          <p>{t('forceMajeure.paragraph1')}</p>
          <p>{t('forceMajeure.paragraph2')}</p>
          <p>{t('forceMajeure.paragraph3')}</p>

          {/* 19. Privacy */}
          <h2 id="privacy">{t('privacy.title')}</h2>
          <p>{t('privacy.paragraph1')}</p>
          <p>{t('privacy.paragraph2')}</p>
          <p>
            <Link to={`/${i18n.language}/privacy`}>
              {t('privacy.linkText')}
            </Link>
          </p>

          {/* 20. Accessibility */}
          <h2 id="accessibility">{t('accessibility.title')}</h2>
          <p>{t('accessibility.paragraph1')}</p>
          <p>{t('accessibility.paragraph2')}</p>

          {/* 21. Severability and Waiver */}
          <h2 id="severability">{t('severabilityAndWaiver.title')}</h2>
          <h3>{t('severabilityAndWaiver.severability.title')}</h3>
          <p>{t('severabilityAndWaiver.severability.paragraph1')}</p>
          <h3>{t('severabilityAndWaiver.waiver.title')}</h3>
          <p>{t('severabilityAndWaiver.waiver.paragraph1')}</p>

          {/* 22. Changes */}
          <h2 id="changes">{t('changesToTerms.title')}</h2>
          <p>{t('changesToTerms.paragraph1')}</p>
          <p>{t('changesToTerms.paragraph2')}</p>
          <p>{t('changesToTerms.paragraph3')}</p>

          {/* 23. Contact Us */}
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

export default TermAndConditionsPage;
