import { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { Button } from '@/components';

interface GenericMuiDropdownProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  title: string;
}

export const GenericMuiDropdown = <T,>({ data, renderItem, className = '', title }: GenericMuiDropdownProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e: MouseEvent) => {
    e.stopPropagation();
    const isPreviewButton =
      e.target instanceof HTMLButtonElement && (e.target.textContent === '+' || e.target.textContent === 'Remove');
    // If it's the plus or remove button, don't close the menu
    if (!isPreviewButton) {
      setAnchorEl(null);
    }
  };

  if (!data || !renderItem) return null;

  const getLinkDetails = () => {
    if (!title || title === 'Cart (0)') {
      return { to: '/services', text: 'Add something to your cart' };
    }
    const suffix = title.slice(6, 1);
    return { to: `/create-${suffix || 'wishlist'}`, text: `Create A ${suffix || 'Wishlist'}` };
  };

  const { to, text } = getLinkDetails();

  return (
    <div className={`generic-dropdown ${className}`}>
      <Button className="dropdown-toggle" onClick={handleClick}>
        <div className="dropdown-button-title">{title}</div>
      </Button>
      <Menu
        slotProps={{ paper: { style: { backgroundColor: '#411c61' } } }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {data.length === 0 ? (
          <MenuItem onClick={handleClose}>
            <Link to={to}>{text}</Link>
          </MenuItem>
        ) : (
          data.map((entry, index) => (
            <MenuItem key={index} onClick={handleClose}>
              {renderItem(entry)}
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
};
