import { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';
import {
  getConsent,
  saveConsent,
  clearConsent,
  needsReconsent,
  logConsentEvent,
  getAllCategories,
  getDefaultCategories,
  type CookieConsentCategories,
  type CookieConsentData
} from '@shared/services/cookie-consent-service';
import { isBot } from '@shared/utils/botDetection';

interface CookieConsentContextType {
  consent: CookieConsentData | null;
  hasDecided: boolean;
  showBanner: boolean;
  showPreferences: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (categories: CookieConsentCategories) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  hasCategory: (cat: keyof CookieConsentCategories) => boolean;
  withdrawConsent: () => void;
}

interface CookieConsentProviderProps {
  children: ReactNode;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsentData | null>(null);
  const [hasDecided, setHasDecided] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Skip for bots/crawlers
    if (isBot()) {
      setHasDecided(true);
      return;
    }

    const stored = getConsent();
    if (stored && !needsReconsent()) {
      setConsent(stored);
      setHasDecided(true);
    } else {
      // Show banner immediately — no delay (תיקון 13 compliance)
      setShowBanner(true);
    }
  }, []);

  const dispatchConsentChanged = useCallback(() => {
    window.dispatchEvent(new Event('consent-changed'));
  }, []);

  const acceptAll = useCallback(() => {
    const categories = getAllCategories();
    saveConsent(categories);
    logConsentEvent('granted_all', categories);
    setConsent(getConsent());
    setHasDecided(true);
    setShowBanner(false);
    setShowPreferences(false);
    dispatchConsentChanged();
  }, [dispatchConsentChanged]);

  const rejectNonEssential = useCallback(() => {
    const categories = getDefaultCategories();
    saveConsent(categories);
    logConsentEvent('rejected_non_essential', categories);
    setConsent(getConsent());
    setHasDecided(true);
    setShowBanner(false);
    setShowPreferences(false);
    dispatchConsentChanged();
  }, [dispatchConsentChanged]);

  const savePreferencesHandler = useCallback((categories: CookieConsentCategories) => {
    saveConsent(categories);
    logConsentEvent('custom', categories);
    setConsent(getConsent());
    setHasDecided(true);
    setShowBanner(false);
    setShowPreferences(false);
    dispatchConsentChanged();
  }, [dispatchConsentChanged]);

  const openPreferences = useCallback(() => {
    setShowPreferences(true);
  }, []);

  const closePreferences = useCallback(() => {
    setShowPreferences(false);
  }, []);

  const hasCategoryCheck = useCallback((cat: keyof CookieConsentCategories): boolean => {
    if (cat === 'essential') return true;
    if (!consent) return false;
    return consent.categories[cat] === true;
  }, [consent]);

  const withdrawConsentHandler = useCallback(() => {
    const categories = getDefaultCategories();
    logConsentEvent('withdrawn', categories);
    clearConsent();
    setConsent(null);
    setHasDecided(false);
    setShowBanner(true);
    dispatchConsentChanged();
  }, [dispatchConsentChanged]);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasDecided,
        showBanner,
        showPreferences,
        acceptAll,
        rejectNonEssential,
        savePreferences: savePreferencesHandler,
        openPreferences,
        closePreferences,
        hasCategory: hasCategoryCheck,
        withdrawConsent: withdrawConsentHandler
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
