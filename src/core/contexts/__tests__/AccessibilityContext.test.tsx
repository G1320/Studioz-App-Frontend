import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AccessibilityProvider, useAccessibility } from '../AccessibilityContext';

describe('AccessibilityContext', () => {
  beforeEach(() => {
    localStorage.clear();
    // Clean up classes from previous tests
    document.documentElement.className = '';
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AccessibilityProvider>{children}</AccessibilityProvider>
  );

  it('provides default settings', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    expect(result.current.settings).toEqual({
      fontSize: 0,
      highContrast: false,
      stopAnimations: false,
      highlightLinks: false,
      textSpacing: false,
      bigCursor: false,
      keyboardHighlight: false
    });
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useAccessibility());
    }).toThrow('useAccessibility must be used within an AccessibilityProvider');
  });

  it('updates a boolean setting', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.updateSetting('highContrast', true);
    });

    expect(result.current.settings.highContrast).toBe(true);
  });

  it('updates fontSize setting', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.updateSetting('fontSize', 2);
    });

    expect(result.current.settings.fontSize).toBe(2);
  });

  it('resets all settings to defaults', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.updateSetting('highContrast', true);
      result.current.updateSetting('fontSize', 1);
      result.current.updateSetting('bigCursor', true);
    });

    expect(result.current.settings.highContrast).toBe(true);

    act(() => {
      result.current.resetAll();
    });

    expect(result.current.settings).toEqual({
      fontSize: 0,
      highContrast: false,
      stopAnimations: false,
      highlightLinks: false,
      textSpacing: false,
      bigCursor: false,
      keyboardHighlight: false
    });
  });

  it('persists settings to localStorage', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.updateSetting('textSpacing', true);
    });

    const stored = JSON.parse(localStorage.getItem('studioz-a11y')!);
    expect(stored.textSpacing).toBe(true);
  });

  it('loads settings from localStorage on mount', () => {
    localStorage.setItem(
      'studioz-a11y',
      JSON.stringify({
        fontSize: 2,
        highContrast: true,
        stopAnimations: false,
        highlightLinks: false,
        textSpacing: false,
        bigCursor: false,
        keyboardHighlight: false
      })
    );

    const { result } = renderHook(() => useAccessibility(), { wrapper });

    expect(result.current.settings.fontSize).toBe(2);
    expect(result.current.settings.highContrast).toBe(true);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('studioz-a11y', 'not-json');

    const { result } = renderHook(() => useAccessibility(), { wrapper });

    // Should fall back to defaults
    expect(result.current.settings.fontSize).toBe(0);
    expect(result.current.settings.highContrast).toBe(false);
  });

  it('applies CSS classes to document.documentElement', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.updateSetting('highContrast', true);
    });

    expect(document.documentElement.classList.contains('a11y-high-contrast')).toBe(true);

    act(() => {
      result.current.updateSetting('highContrast', false);
    });

    expect(document.documentElement.classList.contains('a11y-high-contrast')).toBe(false);
  });

  it('applies font-size CSS classes', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.updateSetting('fontSize', 1);
    });

    expect(document.documentElement.classList.contains('a11y-font-1')).toBe(true);
    expect(document.documentElement.classList.contains('a11y-font-2')).toBe(false);

    act(() => {
      result.current.updateSetting('fontSize', 2);
    });

    expect(document.documentElement.classList.contains('a11y-font-1')).toBe(false);
    expect(document.documentElement.classList.contains('a11y-font-2')).toBe(true);
  });

  it('removes all font classes when fontSize is 0', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.updateSetting('fontSize', 2);
    });

    act(() => {
      result.current.updateSetting('fontSize', 0);
    });

    expect(document.documentElement.classList.contains('a11y-font-1')).toBe(false);
    expect(document.documentElement.classList.contains('a11y-font-2')).toBe(false);
  });

  it('toggles popover open/closed', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    expect(result.current.isPopoverOpen).toBe(false);

    act(() => {
      result.current.togglePopover();
    });

    expect(result.current.isPopoverOpen).toBe(true);

    act(() => {
      result.current.togglePopover();
    });

    expect(result.current.isPopoverOpen).toBe(false);
  });

  it('closes popover', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });

    act(() => {
      result.current.togglePopover();
    });

    expect(result.current.isPopoverOpen).toBe(true);

    act(() => {
      result.current.closePopover();
    });

    expect(result.current.isPopoverOpen).toBe(false);
  });
});
