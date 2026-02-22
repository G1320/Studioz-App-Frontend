import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../../tests/utils/testUtils';
import { CookiePreferencesModal } from '../CookiePreferencesModal';

const mockClosePreferences = vi.fn();
const mockAcceptAll = vi.fn();
const mockSavePreferences = vi.fn();

vi.mock('@core/contexts', () => ({
  useCookieConsent: () => ({
    showPreferences: true,
    closePreferences: mockClosePreferences,
    acceptAll: mockAcceptAll,
    savePreferences: mockSavePreferences,
    consent: null
  })
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'preferences.title': 'Cookie Preferences',
        'preferences.description': 'Manage your cookie preferences below.',
        'preferences.close': 'Close',
        'preferences.categories.essential.title': 'Essential',
        'preferences.categories.essential.services': 'Auth0, Theme',
        'preferences.categories.essential.description': 'Required for the website to function.',
        'preferences.categories.essential.alwaysOn': 'Always On',
        'preferences.categories.functional.title': 'Functional',
        'preferences.categories.functional.services': 'Brevo Chat, PayPal',
        'preferences.categories.functional.description': 'Enhanced functionality.',
        'preferences.categories.analytics.title': 'Analytics',
        'preferences.categories.analytics.services': 'Google Analytics, Clarity',
        'preferences.categories.analytics.description': 'Help us understand usage.',
        'preferences.categories.marketing.title': 'Marketing',
        'preferences.categories.marketing.services': 'Meta Pixel',
        'preferences.categories.marketing.description': 'Relevant advertisements.',
        'preferences.savePreferences': 'Save Preferences',
        'preferences.acceptAll': 'Accept All',
        'banner.privacyLink': 'Privacy Policy'
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' }
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children
}));

describe('CookiePreferencesModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the modal with title', () => {
    render(<CookiePreferencesModal />);
    expect(screen.getByText('Cookie Preferences')).toBeInTheDocument();
  });

  it('has role="dialog" and aria-modal', () => {
    render(<CookiePreferencesModal />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Cookie Preferences');
  });

  it('renders all four cookie categories', () => {
    render(<CookiePreferencesModal />);
    expect(screen.getByText('Essential')).toBeInTheDocument();
    expect(screen.getByText('Functional')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });

  it('shows "Always On" for essential category (no toggle)', () => {
    render(<CookiePreferencesModal />);
    expect(screen.getByText('Always On')).toBeInTheDocument();
  });

  it('renders toggle switches for non-essential categories', () => {
    render(<CookiePreferencesModal />);
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(3); // functional, analytics, marketing
  });

  it('toggles switch state on click', () => {
    render(<CookiePreferencesModal />);
    const switches = screen.getAllByRole('switch');
    const functionalToggle = switches[0];

    // Initially off
    expect(functionalToggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(functionalToggle);
    expect(functionalToggle).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(functionalToggle);
    expect(functionalToggle).toHaveAttribute('aria-checked', 'false');
  });

  it('calls acceptAll when Accept All button is clicked', () => {
    render(<CookiePreferencesModal />);
    fireEvent.click(screen.getByText('Accept All'));
    expect(mockAcceptAll).toHaveBeenCalledTimes(1);
  });

  it('calls savePreferences with current toggle states', () => {
    render(<CookiePreferencesModal />);

    // Enable analytics
    const switches = screen.getAllByRole('switch');
    fireEvent.click(switches[1]); // analytics

    fireEvent.click(screen.getByText('Save Preferences'));
    expect(mockSavePreferences).toHaveBeenCalledWith({
      essential: true,
      functional: false,
      analytics: true,
      marketing: false
    });
  });

  it('calls closePreferences when close button is clicked', () => {
    render(<CookiePreferencesModal />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockClosePreferences).toHaveBeenCalledTimes(1);
  });

  it('calls closePreferences when overlay is clicked', () => {
    render(<CookiePreferencesModal />);
    const overlay = document.querySelector('.cookie-prefs-overlay');
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockClosePreferences).toHaveBeenCalledTimes(1);
    }
  });

  it('does not close when modal content is clicked', () => {
    render(<CookiePreferencesModal />);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(mockClosePreferences).not.toHaveBeenCalled();
  });

  it('closes on Escape key press', () => {
    render(<CookiePreferencesModal />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockClosePreferences).toHaveBeenCalledTimes(1);
  });

  it('renders privacy policy link', () => {
    render(<CookiePreferencesModal />);
    const link = screen.getByText('Privacy Policy');
    expect(link).toHaveAttribute('href', '/en/privacy');
  });

  it('renders service names for each category', () => {
    render(<CookiePreferencesModal />);
    expect(screen.getByText('Auth0, Theme')).toBeInTheDocument();
    expect(screen.getByText('Brevo Chat, PayPal')).toBeInTheDocument();
    expect(screen.getByText('Google Analytics, Clarity')).toBeInTheDocument();
    expect(screen.getByText('Meta Pixel')).toBeInTheDocument();
  });
});
