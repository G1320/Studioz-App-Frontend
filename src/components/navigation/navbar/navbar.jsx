import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../contexts/UserContext';
import { toast } from 'sonner';

export function Navbar() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    user?._id ? navigate(path) : toast.error('Please log in to access this feature');
  };

  return (
    <nav className="navbar">
      <a onClick={() => navigate('/store')}>Services</a>
      <a onClick={() => handleNavigate('/wishlists')}>Wishlists</a>
      <a onClick={() => handleNavigate('/create-studio')}>Create</a>
    </nav>
  );
}
