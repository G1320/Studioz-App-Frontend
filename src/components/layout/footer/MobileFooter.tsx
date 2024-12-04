import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SearchIcon from '@mui/icons-material/Search';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useUserContext } from '@contexts/UserContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@hooks/utils';

export const MobileFooter = () => {
  const { user } = useUserContext();
  const { t, i18n } = useTranslation('common');
  const langNavigate = useLanguageNavigate();

  const currLang = i18n.language || 'en';

  const handleNavigate = (path: string) => {
    if (!user?._id) {
      toast.error(t('errors.login_required'));
    } else {
      langNavigate(path);
    }
  };
  return (
    <footer className="mobile-footer">
      <nav className="footer-grid">
        <Link to={`/${currLang}}/`} className="footer-icon-link">
          <div className="footer-link-content">
            <HomeIcon />
            <span>{t('navigation.home')}</span>
          </div>
        </Link>
        <Link to={`/${currLang}/services`} className="footer-icon-link">
          <div className="footer-link-content">
            <GraphicEqIcon />
            <span>{t('navigation.services')}</span>
          </div>
        </Link>
        <Link to={`/${currLang}/search`} className="footer-icon-link">
          <div className="footer-link-content">
            <SearchIcon />
            <span>{t('navigation.search')}</span>
          </div>
        </Link>
        <Link
          to={`/${currLang}/create-studio`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('/create-studio');
          }}
          className="footer-icon-link"
        >
          <div className="footer-link-content">
            <AddBusinessIcon />
            <span>{t('navigation.list_studio')}</span>
          </div>
        </Link>
      </nav>
    </footer>
  );
};
