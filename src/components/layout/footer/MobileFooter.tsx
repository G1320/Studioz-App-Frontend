import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import SearchIcon from '@mui/icons-material/Search';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

export const MobileFooter = () => {
  return (
    <footer className="mobile-footer">
      <nav className="footer-grid">
        {/* Row 1: Icons */}
        <Link to="/" className="footer-icon-link">
          <HomeIcon />
        </Link>
        <Link to="/services" className="footer-icon-link">
          <MiscellaneousServicesIcon />
        </Link>
        <Link to="/search" className="footer-icon-link">
          <SearchIcon />
        </Link>
        <Link to="/create-studio" className="footer-icon-link">
          <AddBusinessIcon />
        </Link>
        {/* Row 2: Text */}
        <Link to="/" className="footer-text-link">
          Home
        </Link>
        <Link to="/services" className="footer-text-link">
          Services
        </Link>
        <Link to="/search" className="footer-text-link">
          Search
        </Link>
        <Link to="/create-studio" className="footer-text-link">
          List Studio
        </Link>
      </nav>
    </footer>
  );
};
