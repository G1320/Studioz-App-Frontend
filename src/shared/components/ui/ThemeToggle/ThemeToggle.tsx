import { useTranslation } from 'react-i18next';
import { MoonIcon, SunIcon, MonitorIcon } from '@shared/components/icons';
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
  const { t } = useTranslation('common');
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
          <SunIcon size={iconSize} />
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--moon">
          <MoonIcon size={iconSize} />
        </span>
      </button>
    );
  }

  // Dropdown variant — labels from i18n
  const themes: { value: Theme; labelKey: string; icon: JSX.Element }[] = [
    { value: 'light', labelKey: 'theme.light', icon: <SunIcon size={iconSize} /> },
    { value: 'dark', labelKey: 'theme.dark', icon: <MoonIcon size={iconSize} /> },
    { value: 'system', labelKey: 'theme.system', icon: <MonitorIcon size={iconSize} /> },
  ];

  return (
    <div className={`theme-toggle-dropdown ${className}`}>
      {themes.map(({ value, labelKey, icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={`theme-toggle-dropdown__option ${theme === value ? 'is-active' : ''}`}
          aria-pressed={theme === value}
        >
          {icon}
          <span>{t(labelKey)}</span>
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;
