import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { hasConsent, saveConsent } from '@shared/services/cookie-consent-service';
import { isBot } from '@shared/utils/botDetection';

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
    // Skip cookie consent banner for bots/crawlers (prevents banner during Google crawling)
    if (isBot()) {
      setHasConsented(true); // Mark as consented so banner never shows
      setShowBanner(false);
      return;
    }

    // Check consent on mount
    const consent = hasConsent();
    setHasConsented(consent);
    
    // Wait 2.5 seconds before showing banner for a more thoughtful, less intrusive experience
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
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

