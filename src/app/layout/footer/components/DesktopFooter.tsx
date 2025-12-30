import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import EmailIcon from '@mui/icons-material/Email';

export const DesktopFooter = () => {
  const { t, i18n } = useTranslation('common');
  const langNavigate = useLanguageNavigate();
  const currentLang = i18n.language || 'en';

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
                <a onClick={() => langNavigate('/studios')}>{t('footer.browse')}</a>
              </li>
              <li>
                <a onClick={() => langNavigate('/for-owners')}>{t('footer.how_it_works')}</a>
              </li>
              <li>
                <a onClick={() => langNavigate('/subscription')}>{t('footer.pricing')}</a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="desktop-footer__links">
            <h3>{t('footer.company')}</h3>
            <ul>
              <li>
                <a onClick={() => langNavigate('/terms')}>{t('footer.terms')}</a>
              </li>
              <li>
                <a onClick={() => langNavigate('/privacy')}>{t('footer.privacy')}</a>
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
          </div>
        </div>

        <div className="desktop-footer__bottom">
          © {new Date().getFullYear()} Studioz. {t('footer.rights')}
        </div>
      </div>

      {/* SEO Keywords - Visually hidden but crawlable by search engines */}
      <div className="seo-keywords" aria-hidden="true">
        <span>
          {currentLang === 'he' ? (
            <>
              השכרת אולפן, אולפן מוזיקה, אולפן פודקאסט, אולפן הקלטות, אולפן מיקס, אולפן מאסטרינג, אולפן צילום, אולפן
              וידאו, אולפן סאונד, אולפן אודיו, אולפן הפקת מוזיקה, אולפן הקלטת קול, אולפן הקלטת כלים, אולפן חזרות להקה,
              אולפן הפקת סרטים, אולפן פוסט פרודקשן, אולפן עיצוב סאונד, אולפן פולי, אולפן דיבוב, שירותי הפקה מרחוק,
              הזמנת אולפן, השכרת אולפן ישראל, אולפן מוזיקה תל אביב, אולפן הקלטות ירושלים, השכרת אולפן פודקאסט, שירותי
              מיקס, שירותי מאסטרינג, שירותי הנדסת אודיו, השכרת ציוד אולפן, אולפן הקלטות מקצועי, אולפן ביתי, אולפן
              מסחרי, השכרת חלל אולפן, חלל אולפן יצירתי, שירותי הפקת מוזיקה, פוסט פרודקשן אודיו, מיקס סאונד, מאסטרינג
              אודיו, הקלטת מוזיקה, הקלטת פודקאסט, הפקת וידאו, אולפן צילום, אולפן צילום וידאו, אולפן להשכרה, השכרת
              אולפן במחיר נוח, אולפן מקצועי, אולפן עם ציוד, ביקורות אולפן, דירוגי אולפן, אולפן הקלטות הטוב ביותר,
              אולפן מוזיקה מוביל
            </>
          ) : (
            <>
              studio rental, music studio, podcast studio, recording studio, mixing studio, mastering studio, photo
              studio, video studio, sound studio, audio studio, music production studio, vocal recording studio,
              instrument recording studio, band rehearsal studio, film production studio, post production studio, sound
              design studio, foley studio, voiceover studio, dubbing studio, remote production services, studio booking,
              studio reservation, studio hire, studio rental Israel, music studio Tel Aviv, recording studio Jerusalem,
              podcast studio rental, mixing services, mastering services, audio engineering services, studio equipment
              rental, professional recording studio, home studio, commercial studio, studio space rental, creative
              studio space, music production services, audio post production, sound mixing, audio mastering, music
              recording, podcast recording, video production, photo shoot studio, video shoot studio, studio for rent,
              affordable studio rental, professional studio, studio with equipment, studio reviews, studio ratings, best
              recording studio, top music studio
            </>
          )}
        </span>
      </div>
    </footer>
  );
};
