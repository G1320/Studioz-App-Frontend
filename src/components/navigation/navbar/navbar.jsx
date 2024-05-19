import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../contexts/UserContext';
import { toast } from 'sonner';

export function Navbar() {
  const user = useUserContext();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    user.sub ? navigate(path) : toast.error('Please log in to access this feature');
  };

  return (
    <nav className="navbar">
      <Link to="/store">Services</Link>
      <Link onClick={() => handleNavigate('/wishlists')}>Wishlists</Link>
      <Link onClick={() => handleNavigate('/create-studio')}>Create</Link>
    </nav>
  );
}
