import { ReactNode } from 'react';
import '../styles/_studio-badges.scss';

interface StudioBadgesProps {
  children: ReactNode;
  className?: string;
}

export const StudioBadges: React.FC<StudioBadgesProps> = ({ children, className = '' }) => {
  return <div className={`studio-badges ${className}`}>{children}</div>;
};
