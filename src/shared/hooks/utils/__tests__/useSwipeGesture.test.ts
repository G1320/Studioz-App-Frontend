import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSwipeGesture } from '../useSwipeGesture';

describe('useSwipeGesture', () => {
  it('exposes spring style, bind, and reset', () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({ direction: 'right', onSwipe, axis: 'x', threshold: 50 })
    );
    expect(result.current.bind).toBeTypeOf('function');
    expect(result.current.reset).toBeTypeOf('function');
    expect(result.current.springProps.style).toHaveProperty('x');
    expect(result.current.springProps.style).toHaveProperty('y');
    act(() => result.current.reset());
  });
});
