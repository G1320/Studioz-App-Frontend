import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../../../tests/utils/testUtils';
import PrivacyPolicyPage from '../PrivacyPolicyPage';

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <div data-testid="helmet">{children}</div>,
  HelmetProvider: ({ children }: { children: React.ReactNode }) => children
}));

vi.mock('@core/contexts/CookieConsentContext', () => ({
  useCookieConsent: () => ({
    openPreferences: vi.fn()
  })
}));

// Create a comprehensive mock for all i18n keys used by the page
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      if (options?.returnObjects) {
        // Return mock service objects for cookie category tables
        if (key.includes('.services')) {
          return { service1: 'Service 1' };
        }
        return {};
      }

      const translations: Record<string, string> = {
        'meta.title': 'Privacy Policy',
        'meta.lastUpdated': 'Last updated: February 2025',
        'toc.title': 'Table of Contents',
        'toc.interpretationAndDefinitions': 'Interpretation and Definitions',
        'toc.collectingAndUsing': 'Collecting and Using Your Personal Data',
        'toc.trackingTechnologies': 'Tracking Technologies',
        'toc.cookieCategories': 'Cookie Categories',
        'toc.useOfData': 'Use of Your Personal Data',
        'toc.retention': 'Retention',
        'toc.dataRetention': 'Data Retention Periods',
        'toc.transfer': 'Transfer',
        'toc.deleteData': 'Delete Your Data',
        'toc.disclosure': 'Disclosure',
        'toc.security': 'Security',
        'toc.thirdPartyServices': 'Third-Party Services',
        'toc.amendment13': 'Your Rights (Amendment 13)',
        'toc.childrenPrivacy': "Children's Privacy",
        'toc.dpo': 'Data Protection Officer',
        'toc.links': 'Links to Other Websites',
        'toc.changes': 'Changes',
        'toc.contact': 'Contact Us',
        'intro.paragraph1': 'This Privacy Policy describes Our policies.',
        'intro.paragraph2': 'We use Your Personal data.',
        'interpretationAndDefinitions.title': 'Interpretation and Definitions',
        'interpretationAndDefinitions.interpretation.title': 'Interpretation',
        'interpretationAndDefinitions.interpretation.description': 'The words have defined meanings.',
        'interpretationAndDefinitions.definitions.title': 'Definitions',
        'interpretationAndDefinitions.definitions.intro': 'For the purposes:',
        'interpretationAndDefinitions.definitions.account.term': 'Account',
        'interpretationAndDefinitions.definitions.account.definition': 'means a unique account.',
        'interpretationAndDefinitions.definitions.website.term': 'Website',
        'interpretationAndDefinitions.definitions.website.definition': 'refers to Studioz',
        'interpretationAndDefinitions.definitions.website.url': 'https://www.studioz.co.il',
        'dataCollection.title': 'Collecting and Using Your Personal Data',
        'dataCollection.typesOfData.title': 'Types of Data Collected',
        'cookieCategories.title': 'Cookie Categories',
        'cookieCategories.description': 'Below is a detailed breakdown.',
        'cookieCategories.tableHeaders.category': 'Category',
        'cookieCategories.tableHeaders.services': 'Services',
        'cookieCategories.tableHeaders.purpose': 'Purpose',
        'cookieCategories.tableHeaders.duration': 'Duration',
        'cookieCategories.essential.name': 'Essential',
        'cookieCategories.essential.purpose': 'Required for function.',
        'cookieCategories.essential.duration': 'Session',
        'cookieCategories.functional.name': 'Functional',
        'cookieCategories.functional.purpose': 'Enhanced functionality.',
        'cookieCategories.functional.duration': 'Persistent',
        'cookieCategories.analytics.name': 'Analytics',
        'cookieCategories.analytics.purpose': 'Help understand usage.',
        'cookieCategories.analytics.duration': '26 months',
        'cookieCategories.marketing.name': 'Marketing',
        'cookieCategories.marketing.purpose': 'Relevant ads.',
        'cookieCategories.marketing.duration': '90 days',
        'amendment13.title': 'Your Rights Under Israeli Law (Amendment 13)',
        'amendment13.intro': 'In accordance with Amendment 13.',
        'amendment13.rights.access.title': 'Right of Access',
        'amendment13.rights.access.description': 'You have the right to request access.',
        'amendment13.rights.correction.title': 'Right of Correction',
        'amendment13.rights.correction.description': 'You have the right to correct.',
        'amendment13.rights.deletion.title': 'Right of Deletion',
        'amendment13.rights.deletion.description': 'You have the right to delete.',
        'amendment13.rights.objection.title': 'Right of Objection',
        'amendment13.rights.objection.description': 'You have the right to object.',
        'amendment13.rights.portability.title': 'Right to Data Portability',
        'amendment13.rights.portability.description': 'You have the right to portability.',
        'amendment13.rights.withdrawConsent.title': 'Right to Withdraw Consent',
        'amendment13.rights.withdrawConsent.description': 'You have the right to withdraw.',
        'childrenPrivacy.title': "Children's Privacy",
        'childrenPrivacy.paragraph1': 'Our Service does not address under 13.',
        'dpo.title': 'Data Protection Officer',
        'dpo.description': 'We have appointed a DPO.',
        'dpo.contactLabel': 'Email:',
        'dpo.email': 'admin@studioz.online',
        'contact.title': 'Contact Us',
        'contact.description': 'If you have questions.',
        'contact.emailLabel': 'By email:',
        'contact.email': 'info@studioz.online',
        'contact.addressLabel': 'By mail:',
        'contact.address': 'Allenby 70, Tel Aviv',
        'contact.websiteLabel': 'Website:',
        'contact.website': 'https://www.studioz.co.il'
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' }
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children
}));

describe('PrivacyPolicyPage', () => {
  it('renders the page title', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('renders last updated date', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByText('Last updated: February 2025')).toBeInTheDocument();
  });

  it('renders table of contents navigation', () => {
    render(<PrivacyPolicyPage />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
  });

  it('renders table of contents links', () => {
    render(<PrivacyPolicyPage />);
    const tocLinks = screen.getByRole('navigation').querySelectorAll('a');
    expect(tocLinks.length).toBe(18);
  });

  it('renders Amendment 13 rights section', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByText('Your Rights Under Israeli Law (Amendment 13)')).toBeInTheDocument();
    expect(screen.getByText('Right of Access')).toBeInTheDocument();
    expect(screen.getByText('Right of Correction')).toBeInTheDocument();
    expect(screen.getByText('Right of Deletion')).toBeInTheDocument();
    expect(screen.getByText('Right of Objection')).toBeInTheDocument();
    expect(screen.getByText('Right to Data Portability')).toBeInTheDocument();
    expect(screen.getByText('Right to Withdraw Consent')).toBeInTheDocument();
  });

  it('renders cookie categories table', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByRole('heading', { name: 'Cookie Categories', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Essential')).toBeInTheDocument();
    expect(screen.getByText('Functional')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });

  it('renders DPO section with email', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByRole('heading', { name: 'Data Protection Officer', level: 2 })).toBeInTheDocument();
    const dpoEmail = screen.getByText('admin@studioz.online');
    expect(dpoEmail).toHaveAttribute('href', 'mailto:admin@studioz.online');
  });

  it('renders contact section with email and address', () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByRole('heading', { name: 'Contact Us', level: 2 })).toBeInTheDocument();
    const contactEmail = screen.getByText('info@studioz.online');
    expect(contactEmail).toHaveAttribute('href', 'mailto:info@studioz.online');
    expect(screen.getByText(/Allenby 70, Tel Aviv/)).toBeInTheDocument();
  });

  it('has proper heading hierarchy (h1 > h2 > h3)', () => {
    render(<PrivacyPolicyPage />);
    const h1s = document.querySelectorAll('h1');
    const h2s = document.querySelectorAll('h2');
    const h3s = document.querySelectorAll('h3');

    expect(h1s).toHaveLength(1); // Page title
    expect(h2s.length).toBeGreaterThan(5); // Multiple section headers
    expect(h3s.length).toBeGreaterThan(3); // Sub-section headers
  });

  it('renders anchor IDs for section navigation', () => {
    render(<PrivacyPolicyPage />);
    expect(document.getElementById('interpretation')).toBeInTheDocument();
    expect(document.getElementById('amendment13')).toBeInTheDocument();
    expect(document.getElementById('cookie-categories')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
  });
});
