import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SettingsIcon } from '@shared/components/icons';
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

/** Critically damped spring — no bounce unless momentum (Apple §4) */
const FAN_SPRING = { type: 'spring' as const, bounce: 0, duration: 0.35 };

export const FanMenu: React.FC<FanMenuProps> = ({ buttons, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const [isRTL, setIsRTL] = useState(() => {
    return document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('dir') === 'rtl';
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDirection = () => {
      const rtl = document.documentElement.dir === 'rtl' || document.documentElement.getAttribute('dir') === 'rtl';
      setIsRTL(rtl);
    };

    checkDirection();

    const observer = new MutationObserver(checkDirection);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir']
    });

    return () => observer.disconnect();
  }, []);

  const buttonPositions = useMemo(() => {
    const spread = 90;
    const radius = 72;
    const startAngle = isRTL ? -45 : 225;
    const angleDirection = isRTL ? 1 : -1;

    return buttons.map((_, index) => {
      const angle = startAngle + (spread / Math.max(1, buttons.length - 1)) * index * angleDirection;
      const angleRad = (angle * Math.PI) / 180;
      const x = Math.cos(angleRad) * radius;
      const y = Math.sin(angleRad) * radius;
      return { x, y };
    });
  }, [buttons.length, isRTL]);

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
        <motion.span
          className="fan-menu__icon-wrap"
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={reduceMotion ? { duration: 0 } : FAN_SPRING}
        >
          <SettingsIcon className="fan-menu__icon" />
        </motion.span>
      </Button>
      <div className="fan-menu__buttons">
        {buttons.map((button, index) => {
          const position = buttonPositions[index];
          return (
            <motion.div
              key={index}
              className="fan-menu__button-wrapper"
              style={
                {
                  '--x': `${position.x}px`,
                  '--y': `${position.y}px`
                } as React.CSSProperties
              }
              initial={false}
              animate={
                isOpen
                  ? { opacity: 1, x: position.x, y: position.y, scale: 1, pointerEvents: 'auto' }
                  : { opacity: 0, x: 0, y: 0, scale: 0.4, pointerEvents: 'none' }
              }
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : { ...FAN_SPRING, delay: isOpen ? index * 0.03 : 0 }
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
