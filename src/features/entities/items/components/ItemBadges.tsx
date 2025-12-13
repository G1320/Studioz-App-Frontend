import { ReactNode } from 'react';
import '../styles/_item-badges.scss';

interface ItemBadgesProps {
  children: ReactNode;
  className?: string;
}

export const ItemBadges: React.FC<ItemBadgesProps> = ({ children, className = '' }) => {
  return <div className={`item-badges ${className}`}>{children}</div>;
};

