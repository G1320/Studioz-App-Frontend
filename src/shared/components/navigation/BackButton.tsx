import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/_index.scss';

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ className = '', onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      className={`back-button ${className}`}
      onClick={handleClick}
      aria-label="Go back"
      type="button"
    >
      <ArrowBackIcon aria-hidden="true" />
    </button>
  );
};

