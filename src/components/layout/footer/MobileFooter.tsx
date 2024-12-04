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
  const { t, i18n } = useTranslation('header');
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
        {/* Row 1: Icons */}
        <Link to={`/${currLang}}/`} className="footer-icon-link">
          <HomeIcon />
        </Link>
        <Link to={`/${currLang}/services`} className="footer-icon-link">
          <GraphicEqIcon />
        </Link>
        <Link to={`/${currLang}/search`} className="footer-icon-link">
          <SearchIcon />
        </Link>
        <Link
          to={`/${currLang}/create-studio`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('/create-studio');
          }}
          className="footer-icon-link"
        >
          <AddBusinessIcon />
        </Link>
        {/* Row 2: Text */}
        <Link to={`/${currLang}/`} className="footer-text-link">
          Home
        </Link>
        <Link to={`/${currLang}/services`} className="footer-text-link">
          Services
        </Link>
        <Link to={`/${currLang}/search`} className="footer-text-link">
          Search
        </Link>
        <Link
          to={`/${currLang}/create-studio`}
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('/create-studio');
          }}
          className="footer-text-link"
        >
          List Studio
        </Link>
      </nav>
    </footer>
  );
};
