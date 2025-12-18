import { useSpring, SpringValue } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useCallback, useRef } from 'react';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

export interface SwipeConfig {
  /**
   * Direction of swipe to trigger action
   */
  direction: SwipeDirection;
  /**
   * Callback when swipe threshold is reached
   */
  onSwipe: () => void;
  /**
   * Distance in pixels to trigger swipe (default: 100)
   */
  threshold?: number;
  /**
   * Velocity in pixels/ms to trigger swipe (default: 0.5)
   */
  velocityThreshold?: number;
  /**
   * Whether to enable the swipe gesture (default: true)
   */
  enabled?: boolean;
  /**
   * Axis to restrict movement to ('x' | 'y' | undefined for both)
   */
  axis?: 'x' | 'y';
  /**
   * Maximum distance the element can be dragged before snapping back
   */
  maxDistance?: number;
}

export interface UseSwipeGestureReturn {
  /**
   * Spring animation style props to apply to the element
   */
  springProps: {
    style: {
      x: SpringValue<number>;
      y: SpringValue<number>;
    };
  };
  /**
   * Gesture bindings to attach to the element
   */
  bind: ReturnType<typeof useDrag>;
  /**
   * Reset the element position
   */
  reset: () => void;
}

/**
 * Custom hook for handling swipe gestures with spring animations
 *
 * @example
 * ```tsx
 * const { springProps, bind, reset } = useSwipeGesture({
 *   direction: 'down',
 *   onSwipe: () => closeModal(),
 *   threshold: 100,
 *   axis: 'y'
 * });
 *
 * <animated.div {...springProps} {...bind()}>
 *   Content
 * </animated.div>
 * ```
 */
export const useSwipeGesture = (config: SwipeConfig): UseSwipeGestureReturn => {
  const {
    direction,
    onSwipe,
    threshold = 100,
    velocityThreshold = 0.5,
    enabled = true,
    axis,
    maxDistance = 300
  } = config;

  const isSwipeTriggered = useRef(false);

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { tension: 300, friction: 30 }
  }));

  const reset = useCallback(() => {
    isSwipeTriggered.current = false;
    api.start({ x: 0, y: 0, immediate: false });
  }, [api]);

  const bind = useDrag(
    ({ movement: [mx, my], velocity: [vx, vy], active, cancel }) => {
      if (!enabled) {
        cancel();
        return;
      }

      // Restrict to axis if specified
      const movementX = axis === 'y' ? 0 : mx;
      const movementY = axis === 'x' ? 0 : my;
      const velocityX = axis === 'y' ? 0 : vx;
      const velocityY = axis === 'x' ? 0 : vy;

      // Determine swipe direction based on movement
      const isHorizontal = Math.abs(movementX) > Math.abs(movementY);
      const swipeDir = isHorizontal ? (movementX > 0 ? 'right' : 'left') : movementY > 0 ? 'down' : 'up';

      // Check if movement exceeds max distance
      const distance = isHorizontal ? Math.abs(movementX) : Math.abs(movementY);
      if (distance > maxDistance) {
        cancel();
        return;
      }

      // Update position during drag
      api.start({
        x: movementX,
        y: movementY,
        immediate: active
      });

      // Check if swipe threshold is met
      if (!active && !isSwipeTriggered.current) {
        const velocity = isHorizontal ? Math.abs(velocityX) : Math.abs(velocityY);
        const meetsThreshold = distance >= threshold;
        const meetsVelocity = velocity >= velocityThreshold;
        const correctDirection = swipeDir === direction;

        if (correctDirection && (meetsThreshold || meetsVelocity)) {
          isSwipeTriggered.current = true;
          onSwipe();
          // Animate out in the swipe direction
          const finalX = direction === 'left' ? -window.innerWidth : direction === 'right' ? window.innerWidth : 0;
          const finalY = direction === 'up' ? -window.innerHeight : direction === 'down' ? window.innerHeight : 0;
          api.start({
            x: finalX,
            y: finalY,
            immediate: false,
            onRest: reset
          });
        } else {
          // Snap back to original position
          reset();
        }
      }
    },
    {
      axis: axis === 'x' ? 'x' : axis === 'y' ? 'y' : undefined,
      filterTaps: true,
      bounds:
        axis === 'x'
          ? { left: -maxDistance, right: maxDistance }
          : axis === 'y'
            ? { top: -maxDistance, bottom: maxDistance }
            : undefined
    }
  );

  return {
    springProps: { style: { x, y } },
    bind,
    reset
  };
};
