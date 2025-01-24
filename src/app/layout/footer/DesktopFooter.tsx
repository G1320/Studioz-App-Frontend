import { useLanguageNavigate } from '@shared/hooks/utils';
import EmailIcon from '@mui/icons-material/Email';
import { useTranslation } from 'react-i18next';
export const DesktopFooter = () => {
  const langNavigate = useLanguageNavigate();
  const { t } = useTranslation('common');

  return (
    <footer className="desktop-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="links">
            <a onClick={() => langNavigate('/privacy')}>{t('footer.privacy')}</a>
            <span className="divider">•</span>
            <a onClick={() => langNavigate('/terms')}>{t('footer.terms')}</a>
          </div>
        </div>
        <div className="footer-section">
          <p className="footer-impact-statement">{t('footer.impact')}</p>
        </div>
        <div className="footer-section">
          <div className="contact-info">
            <EmailIcon />
            <a href="mailto:info@studioz.online">info@studioz.online</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Studioz. All rights reserved.</p>
      </div>
    </footer>
  );
};
