import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { hasConsent, saveConsent, getConsent, CookieConsent } from '@shared/services/cookie-consent-service';

interface CookieConsentContextType {
  hasConsented: boolean;
  showBanner: boolean;
  acceptCookies: () => void;
  rejectCookies: () => void;
}

interface CookieConsentProviderProps {
  children: ReactNode;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check consent on mount
    const consent = hasConsent();
    setHasConsented(consent);
    setShowBanner(!consent);
  }, []);

  const acceptCookies = () => {
    saveConsent(true);
    setHasConsented(true);
    setShowBanner(false);
  };

  const rejectCookies = () => {
    saveConsent(false);
    setHasConsented(false);
    setShowBanner(false);
  };

  return (
    <CookieConsentContext.Provider value={{ hasConsented, showBanner, acceptCookies, rejectCookies }}>
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

