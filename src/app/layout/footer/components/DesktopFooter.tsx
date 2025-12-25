import { useLanguageNavigate } from '@shared/hooks/utils';
import EmailIcon from '@mui/icons-material/Email';
import { useTranslation } from 'react-i18next';
export const DesktopFooter = () => {
  const langNavigate = useLanguageNavigate();
  const { t, i18n } = useTranslation('common');
  const currentLang = i18n.language || 'en';

  return (
    <footer id="main-footer" className="desktop-footer" aria-label={t('navigation.footer', 'Footer')}>
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
      {/* SEO Keywords - Visually hidden but crawlable by search engines */}
      <div className="seo-keywords" aria-hidden="true">
        <span>
          {currentLang === 'he' ? (
            <>
              השכרת אולפן, אולפן מוזיקה, אולפן פודקאסט, אולפן הקלטות, אולפן מיקס, אולפן מאסטרינג, 
              אולפן צילום, אולפן וידאו, אולפן סאונד, אולפן אודיו, אולפן הפקת מוזיקה, 
              אולפן הקלטת קול, אולפן הקלטת כלים, אולפן חזרות להקה, 
              אולפן הפקת סרטים, אולפן פוסט פרודקשן, אולפן עיצוב סאונד, 
              אולפן פולי, אולפן דיבוב, שירותי הפקה מרחוק, 
              הזמנת אולפן, השכרת אולפן ישראל, 
              אולפן מוזיקה תל אביב, אולפן הקלטות ירושלים, השכרת אולפן פודקאסט, 
              שירותי מיקס, שירותי מאסטרינג, שירותי הנדסת אודיו, 
              השכרת ציוד אולפן, אולפן הקלטות מקצועי, אולפן ביתי, 
              אולפן מסחרי, השכרת חלל אולפן, חלל אולפן יצירתי, 
              שירותי הפקת מוזיקה, פוסט פרודקשן אודיו, מיקס סאונד, 
              מאסטרינג אודיו, הקלטת מוזיקה, הקלטת פודקאסט, הפקת וידאו, 
              אולפן צילום, אולפן צילום וידאו, אולפן להשכרה, 
              השכרת אולפן במחיר נוח, אולפן מקצועי, אולפן עם ציוד, 
              ביקורות אולפן, דירוגי אולפן, אולפן הקלטות הטוב ביותר, אולפן מוזיקה מוביל
            </>
          ) : (
            <>
              studio rental, music studio, podcast studio, recording studio, mixing studio, mastering studio, 
              photo studio, video studio, sound studio, audio studio, music production studio, 
              vocal recording studio, instrument recording studio, band rehearsal studio, 
              film production studio, post production studio, sound design studio, 
              foley studio, voiceover studio, dubbing studio, remote production services, 
              studio booking, studio reservation, studio hire, studio rental Israel, 
              music studio Tel Aviv, recording studio Jerusalem, podcast studio rental, 
              mixing services, mastering services, audio engineering services, 
              studio equipment rental, professional recording studio, home studio, 
              commercial studio, studio space rental, creative studio space, 
              music production services, audio post production, sound mixing, 
              audio mastering, music recording, podcast recording, video production, 
              photo shoot studio, video shoot studio, studio for rent, 
              affordable studio rental, professional studio, studio with equipment, 
              studio reviews, studio ratings, best recording studio, top music studio
            </>
          )}
        </span>
      </div>
    </footer>
  );
};
