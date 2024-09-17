import { useUserContext } from '@/contexts';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';



export const DesktopFooter = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

   const handleNavigate = (path:string) => {
     user?._id ? navigate(path) : toast.error('Please log in to access this feature');
   };


  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/store">Services</Link>
            </li>
            <li>
              <a onClick={() => handleNavigate('/create-studio')}>List your studio</a>
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

export default DesktopFooter;
