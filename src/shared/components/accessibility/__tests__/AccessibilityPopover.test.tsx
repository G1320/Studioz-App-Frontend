import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../../tests/utils/testUtils';
import { AccessibilityProvider } from '@core/contexts/AccessibilityContext';
import AccessibilityPopover from '../AccessibilityPopover';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'trigger.label': 'Accessibility settings',
        'popover.title': 'Accessibility',
        'popover.close': 'Close',
        'popover.fontSize': 'Font Size',
        'popover.fontDefault': 'Default',
        'popover.fontLarge': 'Large',
        'popover.fontLargest': 'Largest',
        'popover.highContrast': 'High Contrast',
        'popover.stopAnimations': 'Stop Animations',
        'popover.highlightLinks': 'Highlight Links',
        'popover.textSpacing': 'Text Spacing',
        'popover.bigCursor': 'Big Cursor',
        'popover.keyboardHighlight': 'Keyboard Highlight',
        'popover.resetAll': 'Reset All',
        'popover.enabled': 'On',
        'popover.disabled': 'Off'
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' }
  })
}));

const renderPopover = () =>
  render(
    <AccessibilityProvider>
      <AccessibilityPopover />
    </AccessibilityProvider>
  );

describe('AccessibilityPopover', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renders the trigger button', () => {
    renderPopover();
    expect(screen.getByLabelText('Accessibility settings')).toBeInTheDocument();
  });

  it('trigger button has correct ARIA attributes when closed', () => {
    renderPopover();
    const trigger = screen.getByLabelText('Accessibility settings');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', 'a11y-popover-panel');
  });

  it('opens popover on trigger click', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('updates aria-expanded when popover opens', () => {
    renderPopover();
    const trigger = screen.getByLabelText('Accessibility settings');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders font size buttons inside popover', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('A+')).toBeInTheDocument();
    expect(screen.getByText('A++')).toBeInTheDocument();
  });

  it('renders all toggle switches', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(6);
  });

  it('toggles a setting on switch click', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));

    const switches = screen.getAllByRole('switch');
    const highContrastSwitch = switches[0]; // highContrast is first

    expect(highContrastSwitch).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(highContrastSwitch);
    expect(highContrastSwitch).toHaveAttribute('aria-checked', 'true');
  });

  it('activates font size button', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));

    const largeButton = screen.getByText('A+');
    expect(largeButton).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(largeButton);
    expect(largeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders Reset All button', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));
    expect(screen.getByText('Reset All')).toBeInTheDocument();
  });

  it('resets all settings when Reset All is clicked', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));

    // Enable something
    const switches = screen.getAllByRole('switch');
    fireEvent.click(switches[0]); // highContrast on
    expect(switches[0]).toHaveAttribute('aria-checked', 'true');

    // Reset
    fireEvent.click(screen.getByText('Reset All'));
    expect(switches[0]).toHaveAttribute('aria-checked', 'false');
  });

  it('closes popover when close button is clicked', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes popover on Escape key', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes popover on outside click', () => {
    renderPopover();
    fireEvent.click(screen.getByLabelText('Accessibility settings'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
