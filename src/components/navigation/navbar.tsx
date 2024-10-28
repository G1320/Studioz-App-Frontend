import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@contexts/index';
import { toast } from 'sonner';

export function Navbar() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();

    if (!user?._id) {
      toast.error('Please log in to access this feature');
    } else if (path === '/wishlists' && (!user?.wishlists || user?.wishlists.length === 0)) {
      navigate('/create-wishlist');
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="navbar">
      <a href="/services">Services</a>
      <a href="/wishlists" onClick={(e) => handleNavigate(e, '/wishlists')}>
        Wishlists
      </a>
      <a href="/create-studio" onClick={(e) => handleNavigate(e, '/create-studio')}>
        Create
      </a>
    </nav>
  );
}
