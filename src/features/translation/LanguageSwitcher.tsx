import { LanguageIcon } from '@shared/components/icons';
import { IconButton } from '@mui/material';
import { PopupDropdown } from '@shared/components/drop-downs';
import { useLanguageSwitcher } from '@shared/hooks/utils';

export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguageSwitcher();

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
            className={`lang-switcher__option ${currentLanguage === 'en' ? 'lang-switcher__option--active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button
            className={`lang-switcher__option ${currentLanguage === 'he' ? 'lang-switcher__option--active' : ''}`}
            onClick={() => changeLanguage('he')}
          >
            עברית
          </button>
        </div>
      </PopupDropdown>
    </section>
  );
};
