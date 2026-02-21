import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  ReactNode
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AccessibilitySettings {
  fontSize: 0 | 1 | 2;
  highContrast: boolean;
  stopAnimations: boolean;
  highlightLinks: boolean;
  textSpacing: boolean;
  bigCursor: boolean;
  keyboardHighlight: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetAll: () => void;
  isPopoverOpen: boolean;
  togglePopover: () => void;
  closePopover: () => void;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'studioz-a11y';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 0,
  highContrast: false,
  stopAnimations: false,
  highlightLinks: false,
  textSpacing: false,
  bigCursor: false,
  keyboardHighlight: false
};

/**
 * Maps each boolean setting key to the CSS class applied on `<html>`.
 * Font-size classes are handled separately because the value is numeric.
 */
const BOOL_CLASS_MAP: Record<string, string> = {
  highContrast: 'a11y-high-contrast',
  stopAnimations: 'a11y-stop-animations',
  highlightLinks: 'a11y-highlight-links',
  textSpacing: 'a11y-text-spacing',
  bigCursor: 'a11y-big-cursor',
  keyboardHighlight: 'a11y-keyboard-highlight'
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadSettings(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AccessibilitySettings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // Corrupted or unavailable storage – fall back to defaults
  }
  return { ...DEFAULT_SETTINGS };
}

function persistSettings(settings: AccessibilitySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage full or unavailable – silently ignore
  }
}

function applyClasses(settings: AccessibilitySettings): void {
  const root = document.documentElement;

  // Font-size classes (mutually exclusive)
  root.classList.remove('a11y-font-1', 'a11y-font-2');
  if (settings.fontSize === 1) root.classList.add('a11y-font-1');
  if (settings.fontSize === 2) root.classList.add('a11y-font-2');

  // Boolean setting classes
  for (const [key, cls] of Object.entries(BOOL_CLASS_MAP)) {
    const enabled = settings[key as keyof AccessibilitySettings];
    if (enabled) {
      root.classList.add(cls);
    } else {
      root.classList.remove(cls);
    }
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(
  undefined
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Apply CSS classes whenever settings change
  useEffect(() => {
    applyClasses(settings);
    persistSettings(settings);
  }, [settings]);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(
      key: K,
      value: AccessibilitySettings[K]
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetAll = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  const togglePopover = useCallback(() => {
    setIsPopoverOpen((prev) => !prev);
  }, []);

  const closePopover = useCallback(() => {
    setIsPopoverOpen(false);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetAll,
        isPopoverOpen,
        togglePopover,
        closePopover
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      'useAccessibility must be used within an AccessibilityProvider'
    );
  }
  return context;
};
