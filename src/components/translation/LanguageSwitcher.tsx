// import { useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { MenuItem, Select, FormControl } from '@mui/material';

// export const LanguageSwitcher = () => {
//   const { i18n } = useTranslation();

//   const changeLanguage = (lang: string) => {
//     i18n.changeLanguage(lang);
//   };

//   return (
//     <section className="lang-switcher">
//       <FormControl>
//         <Select
//           value={i18n.language}
//           onChange={(e) => changeLanguage(e.target.value)}
//           displayEmpty
//           sx={{
//             color: '#fff',
//             backgroundColor: '#333',
//             borderRadius: '4px',
//             '& .MuiSelect-icon': { color: '#fff' }
//           }}
//         >
//           <MenuItem value="en">🇺🇸 English</MenuItem>
//           <MenuItem value="he">🇮🇱 עברית</MenuItem>
//         </Select>
//       </FormControl>
//     </section>
//   );
// };

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem, IconButton } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
    i18n.changeLanguage(lang);
    handleClose();
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
          🇺🇸 English
        </MenuItem>
        <MenuItem sx={{ color: '#fff' }} onClick={() => changeLanguage('he')}>
          🇮🇱 עברית
        </MenuItem>
      </Menu>
    </section>
  );
};
