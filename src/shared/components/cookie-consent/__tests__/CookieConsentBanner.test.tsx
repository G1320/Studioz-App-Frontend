import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../../tests/utils/testUtils';
import { CookieConsentBanner } from '../CookieConsentBanner';

// Mock the context
const mockAcceptAll = vi.fn();
const mockRejectNonEssential = vi.fn();
const mockOpenPreferences = vi.fn();

vi.mock('@core/contexts', () => ({
  useCookieConsent: () => ({
    showBanner: true,
    acceptAll: mockAcceptAll,
    rejectNonEssential: mockRejectNonEssential,
    openPreferences: mockOpenPreferences
  })
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'banner.ariaLabel': 'Cookie consent',
        'banner.description': 'We use cookies to improve your experience.',
        'banner.privacyLink': 'Privacy Policy',
        'banner.acceptAll': 'Accept All',
        'banner.necessaryOnly': 'Necessary Only',
        'banner.managePreferences': 'Manage Preferences'
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' }
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children
}));

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when showBanner is true', () => {
    render(<CookieConsentBanner />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('displays three action buttons', () => {
    render(<CookieConsentBanner />);
    expect(screen.getByText('Accept All')).toBeInTheDocument();
    expect(screen.getByText('Necessary Only')).toBeInTheDocument();
    expect(screen.getByText('Manage Preferences')).toBeInTheDocument();
  });

  it('displays the description text', () => {
    render(<CookieConsentBanner />);
    expect(screen.getByText('We use cookies to improve your experience.')).toBeInTheDocument();
  });

  it('displays a privacy policy link', () => {
    render(<CookieConsentBanner />);
    const link = screen.getByText('Privacy Policy');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/en/privacy');
  });

  it('calls acceptAll when Accept All is clicked', () => {
    render(<CookieConsentBanner />);
    fireEvent.click(screen.getByText('Accept All'));
    expect(mockAcceptAll).toHaveBeenCalledTimes(1);
  });

  it('calls rejectNonEssential when Necessary Only is clicked', () => {
    render(<CookieConsentBanner />);
    fireEvent.click(screen.getByText('Necessary Only'));
    expect(mockRejectNonEssential).toHaveBeenCalledTimes(1);
  });

  it('calls openPreferences when Manage Preferences is clicked', () => {
    render(<CookieConsentBanner />);
    fireEvent.click(screen.getByText('Manage Preferences'));
    expect(mockOpenPreferences).toHaveBeenCalledTimes(1);
  });

  it('has proper ARIA attributes', () => {
    render(<CookieConsentBanner />);
    const banner = screen.getByRole('region');
    expect(banner).toHaveAttribute('aria-label', 'Cookie consent');
    expect(banner).toHaveAttribute('aria-describedby', 'cookie-banner-desc');
  });

});
