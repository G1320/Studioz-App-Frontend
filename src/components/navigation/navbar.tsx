import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/contexts';
import { toast } from 'sonner';

export function Navbar() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
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
      <a onClick={() => navigate('/services')}>Services</a>
      <a onClick={() => handleNavigate('/wishlists')}>Wishlists</a>
      <a onClick={() => handleNavigate('/create-studio')}>Create</a>
    </nav>
  );
}
