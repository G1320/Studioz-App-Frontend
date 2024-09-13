import { useState } from 'react';
import { Button } from '@/components';

interface GenericMultiDropdownProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  title?: string;
}

const GenericMultiDropdown = <T,>({
  data,
  renderItem,
  className = '',
  title = 'Show',
}: GenericMultiDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!data || !renderItem) return null;

  return (
    <div className={`generic-dropdown generic-multi-dropdown ${className}`}>
      <Button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {title}
      </Button>
      {isOpen && (
        <div className="multi-dropdown-content">
          {data.map((entry, index) => (
            <div key={index}>{renderItem(entry)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenericMultiDropdown;
