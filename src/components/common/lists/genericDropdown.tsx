import { useState } from 'react';
import { Button } from '@/components/index';

interface GenericDropdownProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  title?: string;
}

export const GenericDropdown = <T,>({ data, renderItem, className = '', title = 'Show' }: GenericDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
