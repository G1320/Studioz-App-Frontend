import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useLanguageNavigate, useSentryFeedback } from '@shared/hooks/utils';
import { EmailIcon } from '@shared/components/icons';

export const DesktopFooter = () => {
  const { t, i18n } = useTranslation('common');
  const langNavigate = useLanguageNavigate();
  const { openFeedback } = useSentryFeedback();
  const location = useLocation();
  const currentLang = i18n.language || 'en';
  const langPrefix = currentLang === 'he' ? '/he' : '/en';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    langNavigate(path);
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: string) => {
    e.preventDefault();
    const isHomePage =
      location.pathname === '/' || location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`;

    if (isHomePage) {
      // Already on home page, just scroll to section
      const element = document.getElementById(anchor);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to home page with hash
      langNavigate(`/#${anchor}`);
    }
  };

  return (
    <footer id="main-footer" className="desktop-footer" aria-label={t('navigation.footer', 'Footer')}>
      <div className="desktop-footer__container">
        <div className="desktop-footer__grid">
          {/* Brand */}
          <div className="desktop-footer__brand">
            <div className="desktop-footer__logo">
              <img src="https://www.studioz.co.il/android-chrome-512x512.png" alt="Studioz Logo" />
              <span>Studioz</span>
            </div>
            <p>{t('footer.tagline')}</p>
          </div>

          {/* Platform Links */}
          <div className="desktop-footer__links">
            <h3>{t('footer.platform')}</h3>
            <ul>
              <li>
                <a href={`${langPrefix}/`} onClick={(e) => handleClick(e, '/')}>
                  {t('footer.home')}
                </a>
              </li>
              <li>
                <a href={`${langPrefix}/#how-it-works`} onClick={(e) => handleAnchorClick(e, 'how-it-works')}>
                  {t('footer.how_it_works')}
                </a>
              </li>

              <li>
                <a href={`${langPrefix}/#pricing`} onClick={(e) => handleAnchorClick(e, 'pricing')}>
                  {t('footer.pricing')}
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="desktop-footer__links">
            <h3>{t('footer.company')}</h3>
            <ul>
              <li>
                <a href={`${langPrefix}/changelog`} onClick={(e) => handleClick(e, '/changelog')}>
                  {t('footer.changelog')}
                </a>
              </li>
              <li>
                <a href={`${langPrefix}/terms`} onClick={(e) => handleClick(e, '/terms')}>
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href={`${langPrefix}/privacy`} onClick={(e) => handleClick(e, '/privacy')}>
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href={`${langPrefix}/security`} onClick={(e) => handleClick(e, '/security')}>
                  {t('footer.security')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="desktop-footer__contact">
            <h3>{t('footer.contact')}</h3>
            <a href="mailto:info@studioz.online" className="desktop-footer__email">
              <EmailIcon />
              <span>info@studioz.online</span>
            </a>
            <button onClick={openFeedback} className="desktop-footer__feedback" type="button">
              {t('footer.feedback', 'Send Feedback')}
            </button>
          </div>
        </div>

        <div className="desktop-footer__bottom">
          © {new Date().getFullYear()} Studioz. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};
