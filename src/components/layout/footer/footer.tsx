import { Link } from 'react-router-dom';

 export const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/create-studio">List your Studio</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <p>Studioz.co.il - Your one-stop shop for creative tools and inspiration.</p>
        </div>
        <div className="footer-section">
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              FB
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              TW
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              IG
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Studioz. All rights reserved.</p>
        <hr />
      </div>
    </footer>
  );
};

export default Footer;
