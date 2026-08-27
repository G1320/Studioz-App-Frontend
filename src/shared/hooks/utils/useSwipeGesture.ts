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
   * Soft bound used for rubber-banding beyond the interactive range
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

/** Apple §9 — progressive resistance past a soft boundary */
function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  if (dimension <= 0) return 0;
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/**
 * Custom hook for swipe gestures with 1:1 tracking, rubber-banding, and velocity handoff (Apple §§2–5, 9)
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

  // Critically damped default (Apple §4)
  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { tension: 280, friction: 32, clamp: true }
  }));

  const reset = useCallback(() => {
    isSwipeTriggered.current = false;
    api.start({ x: 0, y: 0, immediate: false, config: { tension: 280, friction: 32, clamp: true } });
  }, [api]);

  const bind = useDrag(
    ({ movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], active }) => {
      if (!enabled) {
        return;
      }

      let movementX = axis === 'y' ? 0 : mx;
      let movementY = axis === 'x' ? 0 : my;
      const velocityX = axis === 'y' ? 0 : vx;
      const velocityY = axis === 'x' ? 0 : vy;

      // Rubber-band past maxDistance instead of hard-cancel (Apple §9)
      if (Math.abs(movementX) > maxDistance) {
        const sign = Math.sign(movementX);
        movementX = sign * (maxDistance + rubberband(Math.abs(movementX) - maxDistance, maxDistance));
      }
      if (Math.abs(movementY) > maxDistance) {
        const sign = Math.sign(movementY);
        movementY = sign * (maxDistance + rubberband(Math.abs(movementY) - maxDistance, maxDistance));
      }

      const isHorizontal = Math.abs(movementX) > Math.abs(movementY);
      const swipeDir = isHorizontal ? (movementX > 0 ? 'right' : 'left') : movementY > 0 ? 'down' : 'up';

      // 1:1 tracking while dragging
      api.start({
        x: movementX,
        y: movementY,
        immediate: active
      });

      if (!active && !isSwipeTriggered.current) {
        const distance = isHorizontal ? Math.abs(mx) : Math.abs(my);
        const velocity = isHorizontal ? Math.abs(velocityX) : Math.abs(velocityY);
        // Velocity sign decides commit vs reverse (Apple quick ref)
        const velocitySign = isHorizontal ? Math.sign(dx || mx) : Math.sign(dy || my);
        const towardDismiss =
          (direction === 'left' && velocitySign < 0) ||
          (direction === 'right' && velocitySign > 0) ||
          (direction === 'up' && velocitySign < 0) ||
          (direction === 'down' && velocitySign > 0);

        const meetsThreshold = distance >= threshold;
        const meetsVelocity = velocity >= velocityThreshold && towardDismiss;
        const correctDirection = swipeDir === direction;

        if (correctDirection && (meetsThreshold || meetsVelocity)) {
          isSwipeTriggered.current = true;
          onSwipe();
          const finalX = direction === 'left' ? -window.innerWidth : direction === 'right' ? window.innerWidth : 0;
          const finalY = direction === 'up' ? -window.innerHeight : direction === 'down' ? window.innerHeight : 0;
          // Velocity handoff into the dismiss spring (Apple §5)
          api.start({
            x: finalX,
            y: finalY,
            immediate: false,
            config: {
              tension: 220,
              friction: 28,
              // use-gesture velocity is px/ms; react-spring expects similar units
              velocity: isHorizontal ? velocityX : velocityY,
              clamp: false
            },
            onRest: reset
          });
        } else {
          // Snap back with residual velocity so reverse isn't a brick wall
          api.start({
            x: 0,
            y: 0,
            immediate: false,
            config: {
              tension: 280,
              friction: 32,
              velocity: isHorizontal ? velocityX : velocityY,
              clamp: true
            }
          });
          isSwipeTriggered.current = false;
        }
      }
    },
    {
      axis: axis === 'x' ? 'x' : axis === 'y' ? 'y' : undefined,
      filterTaps: true,
      // No hard bounds — rubberband in the handler instead
      from: () => [x.get(), y.get()]
    }
  );

  return {
    springProps: { style: { x, y } },
    bind,
    reset
  };
};
