import { useState, useRef, useEffect, useMemo } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from '@shared/components';
import './styles/_fan-menu.scss';

interface FanMenuButton {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  className?: string;
}

interface FanMenuProps {
  buttons: FanMenuButton[];
  className?: string;
}

export const FanMenu: React.FC<FanMenuProps> = ({ buttons, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(() => {
    return document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('dir') === 'rtl';
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Watch for direction changes
  useEffect(() => {
    const checkDirection = () => {
      const rtl = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('dir') === 'rtl';
      setIsRTL(rtl);
    };

    // Check on mount
    checkDirection();

    // Watch for attribute changes
    const observer = new MutationObserver(checkDirection);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir']
    });

    return () => observer.disconnect();
  }, []);

  // Calculate button positions for fan layout
  const buttonPositions = useMemo(() => {
    const spread = 90; // degrees (reduced from 120 for tighter spread)
    const radius = 72; // pixels (4.5rem)

    // For RTL, reverse the direction: start from positive angle and go to negative
    // For LTR, start from negative angle and go to positive
    const startAngle = isRTL ? 45 : -45; // degrees (adjusted for smaller spread)
    const angleDirection = isRTL ? -1 : 1; // Reverse direction for RTL

    return buttons.map((_, index) => {
      const angle = startAngle + (spread / Math.max(1, buttons.length - 1)) * index * angleDirection;
      const angleRad = (angle * Math.PI) / 180;
      const x = Math.cos(angleRad) * radius;
      const y = Math.sin(angleRad) * radius;
      return { x, y, delay: index * 0.05 };
    });
  }, [buttons.length, isRTL]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleButtonClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className={`fan-menu ${className} ${isOpen ? 'fan-menu--open' : ''}`}>
      <Button
        className="fan-menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <SettingsIcon className={`fan-menu__icon ${isOpen ? 'fan-menu__icon--rotated' : ''}`} />
      </Button>
      <div className="fan-menu__buttons">
        {buttons.map((button, index) => {
          const position = buttonPositions[index];
          return (
            <div
              key={index}
              className="fan-menu__button-wrapper"
              style={
                {
                  '--index': index,
                  '--total': buttons.length,
                  '--x': `${position.x}px`,
                  '--y': `${position.y}px`,
                  '--delay': `${position.delay}s`
                } as React.CSSProperties
              }
            >
              <Button
                className={`fan-menu__button ${button.className || ''}`}
                onClick={() => handleButtonClick(button.onClick)}
                aria-label={button.label}
              >
                {button.icon}
              </Button>
              {button.label && <span className="fan-menu__label">{button.label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
