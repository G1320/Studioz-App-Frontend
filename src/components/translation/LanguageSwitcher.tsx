import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem, IconButton } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router-dom';
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const changeLanguage = (lang: string) => {
    const currentPath = window.location.pathname;

    // Create a new path by replacing the language part of the URL
    const newPath = currentPath.replace(/^\/[a-z]{2}\//, `/${lang}/`);

    i18n.changeLanguage(lang);
    handleClose();
    navigate(newPath);
  };

  return (
    <section className="lang-switcher">
      <IconButton
        aria-label="language-switcher"
        aria-controls={open ? 'lang-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          color: '#fff'
        }}
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="lang-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-switcher'
        }}
      >
        <MenuItem sx={{ color: '#fff' }} onClick={() => changeLanguage('en')}>
          English
        </MenuItem>
        <MenuItem sx={{ color: '#fff' }} onClick={() => changeLanguage('he')}>
          עברית
        </MenuItem>
      </Menu>
    </section>
  );
};
