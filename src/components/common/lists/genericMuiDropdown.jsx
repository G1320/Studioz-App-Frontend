import React, { useState } from 'react';
import Button from '../buttons/genericButton';
import { Menu, MenuItem } from '@mui/material';

const GenericMuiDropdown = ({ data, renderItem, className, title = 'Show' }) => {
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
        {data.map((entry, index) => (
          <MenuItem key={index} onClick={handleClose}>
            {renderItem(entry)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default GenericMuiDropdown;
