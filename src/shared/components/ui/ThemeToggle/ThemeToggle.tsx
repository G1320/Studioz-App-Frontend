import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@shared/contexts/ThemeContext';
import './styles/_theme-toggle.scss';

interface ThemeToggleProps {
  /** Show as icon only (default) or with dropdown */
  variant?: 'icon' | 'dropdown';
  /** Size of the toggle */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}

export function ThemeToggle({ variant = 'icon', size = 'md', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`theme-toggle theme-toggle--${size} ${className}`}
        aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="theme-toggle__icon theme-toggle__icon--sun">
          <Sun size={iconSize} />
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--moon">
          <Moon size={iconSize} />
        </span>
      </button>
    );
  }

  // Dropdown variant for settings pages
  const themes: { value: Theme; label: string; icon: JSX.Element }[] = [
    { value: 'light', label: 'Light', icon: <Sun size={iconSize} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={iconSize} /> },
    { value: 'system', label: 'System', icon: <Monitor size={iconSize} /> },
  ];

  return (
    <div className={`theme-toggle-dropdown ${className}`}>
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={`theme-toggle-dropdown__option ${theme === value ? 'is-active' : ''}`}
          aria-pressed={theme === value}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;
