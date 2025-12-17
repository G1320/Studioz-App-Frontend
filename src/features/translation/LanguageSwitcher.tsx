import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { PopupDropdown } from '@shared/components/drop-downs';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const changeLanguage = (lang: string) => {
    const currentPath = window.location.pathname;
    let newPath;

    if (currentPath === '/' || currentPath === '/en' || currentPath === '/he') {
      newPath = `/${lang}`;
    } else {
      if (currentPath.match(/^\/[a-z]{2}\//)) {
        newPath = currentPath.replace(/^\/[a-z]{2}\//, `/${lang}/`);
      } else {
        newPath = `/${lang}${currentPath}`;
      }
    }

    i18n.changeLanguage(lang);
    navigate(newPath, { replace: true });
  };

  return (
    <section className="lang-switcher">
      <PopupDropdown
        trigger={
          <IconButton
            className="header-icon-button"
            aria-label="language-switcher"
            aria-haspopup="true"
            disableRipple
          >
            <LanguageIcon />
          </IconButton>
        }
        className="lang-switcher"
        anchor="bottom-right"
        minWidth="120px"
        maxWidth="150px"
      >
        <div className="lang-switcher__menu">
          <button
            className={`lang-switcher__option ${i18n.language === 'en' ? 'lang-switcher__option--active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button
            className={`lang-switcher__option ${i18n.language === 'he' ? 'lang-switcher__option--active' : ''}`}
            onClick={() => changeLanguage('he')}
          >
            עברית
          </button>
        </div>
      </PopupDropdown>
    </section>
  );
};
