import { useLanguageNavigate } from '@hooks/utils';
import EmailIcon from '@mui/icons-material/Email';
export const DesktopFooter = () => {
  const langNavigate = useLanguageNavigate();

  return (
    <footer className="desktop-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="links">
            <a onClick={() => langNavigate('/privacy')}>Privacy Policy</a>
            <span className="divider">•</span>
            <a onClick={() => langNavigate('/terms')}>Terms & Conditions</a>
          </div>
        </div>
        <div className="footer-section">
          <p className="footer-impact-statement">
            Studioz.co.il - Your one-stop shop for creative tools and inspiration.
          </p>
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
