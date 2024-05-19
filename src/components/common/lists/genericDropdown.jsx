import React, { useState } from 'react';
import Button from '../buttons/genericButton';

const GenericDropdown = ({ data, renderItem, className, title = 'Show' }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!data || !renderItem) return null;

  return (
    <div className={`generic-dropdown ${className}`}>
      <Button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {title}
      </Button>
      {isOpen && (
        <div className="dropdown-content">
          {data.map((entry, index) => (
            <div key={index}>{renderItem(entry)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenericDropdown;
