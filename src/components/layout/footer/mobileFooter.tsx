import { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

export const MobileFooter = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <footer className={`mobile-footer ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="footer-container">
        <div className="footer-header">
          <h2 className="footer-title">Studioz</h2>
          <button onClick={toggleMenu} className="menu-toggle">
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <div className={`footer-content ${isMenuOpen ? 'show' : ''}`}>
          <nav className="footer-nav">
            <ul>
              <li>
                <Link to="/" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={toggleMenu}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/create-studio" onClick={toggleMenu}>
                  List your Studio
                </Link>
              </li>
            </ul>
          </nav>

          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <TwitterIcon />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
          </div>

          <p className="footer-description">Studioz.co.il - Your one-stop shop for creative tools and inspiration.</p>

          <div className="footer-copyright">
            <p>&copy; 2024 Studioz. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
