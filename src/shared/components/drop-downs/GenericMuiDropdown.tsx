import { useState, MouseEvent, ReactNode } from 'react';
import { Menu, MenuItem } from '@mui/material';

interface GenericMuiDropdownProps<T> {
  data: T[];
  renderItem: (item: T) => ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  count?: number;
  emptyState?: ReactNode;
}

export const GenericMuiDropdown = <T,>({
  data,
  renderItem,
  className = '',
  title,
  icon,
  count,
  emptyState
}: GenericMuiDropdownProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e: MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  if (!data || !renderItem) return null;

  return (
    <div className={`generic-dropdown ${className}`}>
      {icon ? (
        <div className="icon-wrapper" onClick={handleClick}>
          {icon}
          {count !== undefined && <span className="badge">{count}</span>}
        </div>
      ) : (
        <button className="dropdown-toggle" onClick={handleClick}>
          <span>{title}</span>
        </button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{ paper: { style: { backgroundColor: '#411c61' } } }}
      >
        {data.length === 0 ? (
          emptyState ? (
            <MenuItem onClick={handleClose} sx={{ padding: 0 }}>
              {emptyState}
            </MenuItem>
          ) : (
            <MenuItem onClick={handleClose} sx={{ color: '#fff' }}>
              No items available
            </MenuItem>
          )
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
