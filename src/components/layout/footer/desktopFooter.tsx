import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Navbar } from '@/components/navigation';

export const DesktopFooter = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <Navbar />
        </div>
        <div className="footer-section">
          <p className="footer-impact-statement">
            Studioz.co.il - Your one-stop shop for creative tools and inspiration.
          </p>
        </div>
        <div className="footer-section">
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <XIcon />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
      {/* <div className="footer-bottom">
        <p>&copy; 2024 Studioz. All rights reserved.</p>
        <hr />
      </div> */}
    </footer>
  );
};

export default DesktopFooter;
