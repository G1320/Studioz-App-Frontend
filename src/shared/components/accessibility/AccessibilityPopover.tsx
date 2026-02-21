import { useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAccessibility,
  type AccessibilitySettings
} from '@core/contexts/AccessibilityContext';
import './styles/_accessibility-popover.scss';

// ---------------------------------------------------------------------------
// Inline SVG – universal accessibility icon (person with arms out)
// ---------------------------------------------------------------------------
const AccessibilityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="4" r="2" />
    <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const POPOVER_ID = 'a11y-popover-panel';

const AccessibilityPopover: React.FC = () => {
  const { t } = useTranslation('accessibility');
  const {
    settings,
    updateSetting,
    resetAll,
    isPopoverOpen,
    togglePopover,
    closePopover
  } = useAccessibility();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // -----------------------------------------------------------------------
  // Focus management
  // -----------------------------------------------------------------------
  // When the popover opens, focus the first interactive element inside it.
  useEffect(() => {
    if (isPopoverOpen && popoverRef.current) {
      const firstFocusable = popoverRef.current.querySelector<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isPopoverOpen]);

  // -----------------------------------------------------------------------
  // Keyboard & outside-click handling
  // -----------------------------------------------------------------------
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPopoverOpen) return;

      if (e.key === 'Escape') {
        closePopover();
        triggerRef.current?.focus();
        return;
      }

      // Trap focus inside the popover
      if (e.key === 'Tab' && popoverRef.current) {
        const focusables = popoverRef.current.querySelectorAll<HTMLElement>(
          'button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [isPopoverOpen, closePopover]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        isPopoverOpen &&
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        closePopover();
      }
    },
    [isPopoverOpen, closePopover]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleKeyDown, handleClickOutside]);

  // -----------------------------------------------------------------------
  // Toggle helper for boolean settings
  // -----------------------------------------------------------------------
  const renderToggle = (
    key: keyof Omit<AccessibilitySettings, 'fontSize'>,
    labelKey: string
  ) => {
    const isActive = settings[key] as boolean;
    return (
      <button
        type="button"
        className={`a11y-popover__toggle ${isActive ? 'a11y-popover__toggle--active' : ''}`}
        role="switch"
        aria-checked={isActive}
        onClick={() => updateSetting(key, !isActive)}
      >
        <span className="a11y-popover__toggle-label">{t(labelKey)}</span>
        <span className="a11y-popover__toggle-state" aria-hidden="true">
          {isActive ? t('popover.enabled') : t('popover.disabled')}
        </span>
      </button>
    );
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        className="a11y-trigger"
        onClick={togglePopover}
        aria-label={t('trigger.label')}
        aria-expanded={isPopoverOpen}
        aria-controls={POPOVER_ID}
      >
        <AccessibilityIcon />
      </button>

      {/* Popover panel */}
      {isPopoverOpen && (
        <div
          ref={popoverRef}
          id={POPOVER_ID}
          className="a11y-popover"
          role="dialog"
          aria-label={t('popover.title')}
        >
          {/* Header */}
          <div className="a11y-popover__header">
            <h2 className="a11y-popover__title">{t('popover.title')}</h2>
            <button
              type="button"
              className="a11y-popover__close"
              onClick={() => {
                closePopover();
                triggerRef.current?.focus();
              }}
              aria-label={t('popover.close')}
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="a11y-popover__body">
            {/* Font Size selector */}
            <div className="a11y-popover__section">
              <span className="a11y-popover__section-label">
                {t('popover.fontSize')}
              </span>
              <div className="a11y-popover__font-sizes" role="group" aria-label={t('popover.fontSize')}>
                {([0, 1, 2] as const).map((level) => {
                  const labels = [
                    t('popover.fontDefault'),
                    t('popover.fontLarge'),
                    t('popover.fontLargest')
                  ];
                  const displayLabels = ['A', 'A+', 'A++'];
                  return (
                    <button
                      key={level}
                      type="button"
                      className={`a11y-popover__font-btn ${settings.fontSize === level ? 'a11y-popover__font-btn--active' : ''}`}
                      aria-pressed={settings.fontSize === level}
                      onClick={() => updateSetting('fontSize', level)}
                      title={labels[level]}
                    >
                      {displayLabels[level]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggle settings */}
            <div className="a11y-popover__toggles">
              {renderToggle('highContrast', 'popover.highContrast')}
              {renderToggle('stopAnimations', 'popover.stopAnimations')}
              {renderToggle('highlightLinks', 'popover.highlightLinks')}
              {renderToggle('textSpacing', 'popover.textSpacing')}
              {renderToggle('bigCursor', 'popover.bigCursor')}
              {renderToggle('keyboardHighlight', 'popover.keyboardHighlight')}
            </div>
          </div>

          {/* Footer */}
          <div className="a11y-popover__footer">
            <button
              type="button"
              className="a11y-popover__reset"
              onClick={resetAll}
            >
              {t('popover.resetAll')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityPopover;
