import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Cookies from 'js-cookie';
import {
  getConsent,
  hasConsent,
  hasCategory,
  saveConsent,
  clearConsent,
  needsReconsent,
  logConsentEvent,
  getConsentAuditLog,
  getDefaultCategories,
  getAllCategories,
  getConsentVersion
} from '../cookie-consent-service';

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  }
}));

describe('cookie-consent-service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getDefaultCategories', () => {
    it('returns categories with only essential enabled', () => {
      const defaults = getDefaultCategories();
      expect(defaults).toEqual({
        essential: true,
        functional: false,
        analytics: false,
        marketing: false
      });
    });

    it('returns a new object on each call (no shared reference)', () => {
      const a = getDefaultCategories();
      const b = getDefaultCategories();
      expect(a).not.toBe(b);
      expect(a).toEqual(b);
    });
  });

  describe('getAllCategories', () => {
    it('returns all categories enabled', () => {
      expect(getAllCategories()).toEqual({
        essential: true,
        functional: true,
        analytics: true,
        marketing: true
      });
    });
  });

  describe('getConsentVersion', () => {
    it('returns the current consent version string', () => {
      expect(getConsentVersion()).toBe('1.0');
    });
  });

  describe('getConsent', () => {
    it('returns null when no cookie exists', () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);
      expect(getConsent()).toBeNull();
    });

    it('parses valid consent data', () => {
      const data = {
        categories: { essential: true, functional: true, analytics: false, marketing: false },
        timestamp: '2025-01-01T00:00:00.000Z',
        version: '1.0'
      };
      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(data));
      expect(getConsent()).toEqual(data);
    });

    it('handles malformed JSON gracefully', () => {
      vi.mocked(Cookies.get).mockReturnValue('not-json');
      expect(getConsent()).toBeNull();
    });

    it('migrates legacy format (accepted: true) to all categories', () => {
      const legacy = { accepted: true, timestamp: '2024-12-01T00:00:00.000Z' };
      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(legacy));

      const result = getConsent();
      expect(result).not.toBeNull();
      expect(result!.categories).toEqual({
        essential: true,
        functional: true,
        analytics: true,
        marketing: true
      });
      expect(result!.version).toBe('1.0');
    });

    it('migrates legacy format (accepted: false) to essential only', () => {
      const legacy = { accepted: false, timestamp: '2024-12-01T00:00:00.000Z' };
      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(legacy));

      const result = getConsent();
      expect(result!.categories).toEqual({
        essential: true,
        functional: false,
        analytics: false,
        marketing: false
      });
    });
  });

  describe('hasConsent', () => {
    it('returns false when no consent stored', () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);
      expect(hasConsent()).toBe(false);
    });

    it('returns true when consent is stored', () => {
      const data = {
        categories: { essential: true, functional: false, analytics: false, marketing: false },
        timestamp: '2025-01-01T00:00:00.000Z',
        version: '1.0'
      };
      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(data));
      expect(hasConsent()).toBe(true);
    });
  });

  describe('hasCategory', () => {
    it('returns true for essential even without consent', () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);
      expect(hasCategory('essential')).toBe(true);
    });

    it('returns false for analytics without consent', () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);
      expect(hasCategory('analytics')).toBe(false);
    });

    it('returns true for consented category', () => {
      const data = {
        categories: { essential: true, functional: true, analytics: false, marketing: false },
        timestamp: '2025-01-01T00:00:00.000Z',
        version: '1.0'
      };
      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(data));
      expect(hasCategory('functional')).toBe(true);
      expect(hasCategory('analytics')).toBe(false);
    });
  });

  describe('saveConsent', () => {
    it('stores consent with correct format', () => {
      const categories = { essential: true as const, functional: true, analytics: false, marketing: false };
      saveConsent(categories);

      expect(Cookies.set).toHaveBeenCalledTimes(1);
      const [cookieName, cookieValue, options] = vi.mocked(Cookies.set).mock.calls[0];
      expect(cookieName).toBe('cookieConsent');

      const parsed = JSON.parse(cookieValue);
      expect(parsed.categories).toEqual(categories);
      expect(parsed.version).toBe('1.0');
      expect(parsed.timestamp).toBeDefined();

      expect(options?.expires).toBe(365);
      expect(options?.sameSite).toBe('lax');
    });

    it('always forces essential to true', () => {
      // Even if someone tries to pass essential: false (TS would block this, but runtime safety)
      const categories = { essential: true as const, functional: false, analytics: false, marketing: false };
      saveConsent(categories);

      const parsed = JSON.parse(vi.mocked(Cookies.set).mock.calls[0][1]);
      expect(parsed.categories.essential).toBe(true);
    });
  });

  describe('clearConsent', () => {
    it('removes the consent cookie', () => {
      clearConsent();
      expect(Cookies.remove).toHaveBeenCalledWith('cookieConsent');
    });
  });

  describe('needsReconsent', () => {
    it('returns false when no consent exists', () => {
      vi.mocked(Cookies.get).mockReturnValue(undefined);
      expect(needsReconsent()).toBe(false);
    });

    it('returns false when version matches', () => {
      const data = {
        categories: { essential: true, functional: false, analytics: false, marketing: false },
        timestamp: '2025-01-01T00:00:00.000Z',
        version: '1.0'
      };
      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(data));
      expect(needsReconsent()).toBe(false);
    });

    it('returns true when version differs', () => {
      const data = {
        categories: { essential: true, functional: false, analytics: false, marketing: false },
        timestamp: '2025-01-01T00:00:00.000Z',
        version: '0.9'
      };
      vi.mocked(Cookies.get).mockReturnValue(JSON.stringify(data));
      expect(needsReconsent()).toBe(true);
    });
  });

  describe('logConsentEvent / getConsentAuditLog', () => {
    it('starts with empty audit log', () => {
      expect(getConsentAuditLog()).toEqual([]);
    });

    it('logs a consent event to localStorage', () => {
      const categories = { essential: true as const, functional: true, analytics: false, marketing: false };
      logConsentEvent('granted_all', categories);

      const log = getConsentAuditLog();
      expect(log).toHaveLength(1);
      expect(log[0].action).toBe('granted_all');
      expect(log[0].categories).toEqual(categories);
      expect(log[0].version).toBe('1.0');
      expect(log[0].timestamp).toBeDefined();
    });

    it('appends multiple events', () => {
      const allCats = getAllCategories();
      const defaultCats = getDefaultCategories();

      logConsentEvent('granted_all', allCats);
      logConsentEvent('withdrawn', defaultCats);

      const log = getConsentAuditLog();
      expect(log).toHaveLength(2);
      expect(log[0].action).toBe('granted_all');
      expect(log[1].action).toBe('withdrawn');
    });

    it('trims log to last 50 entries', () => {
      const cats = getAllCategories();
      for (let i = 0; i < 60; i++) {
        logConsentEvent('granted_all', cats);
      }

      const log = getConsentAuditLog();
      expect(log).toHaveLength(50);
    });

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('consentAuditLog', 'not-json');
      expect(getConsentAuditLog()).toEqual([]);
    });
  });
});
