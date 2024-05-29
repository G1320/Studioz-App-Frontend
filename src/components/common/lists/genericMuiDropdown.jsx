import React, { useState } from 'react';
import Button from '../buttons/genericButton';
import { Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const GenericMuiDropdown = ({ data, renderItem, className, title }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    const isPreviewButton =
      (e.target.nodeName === 'BUTTON' && e.target.textContent === '+') ||
      (e.target.nodeName === 'BUTTON' && e.target.textContent === 'Remove');
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
    const suffix = title.slice(7);
    return { to: `/create-${suffix}`, text: `Create A ${suffix}` };
  };

  const { to, text } = getLinkDetails();

  return (
    <div className={`generic-dropdown ${className}`}>
      <Button className="dropdown-toggle" onClick={handleClick}>
        {title}
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

export default GenericMuiDropdown;
