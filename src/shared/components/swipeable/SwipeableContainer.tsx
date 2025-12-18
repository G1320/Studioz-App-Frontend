import React, { ReactNode } from 'react';
import { animated } from '@react-spring/web';
import { useSwipeGesture, SwipeConfig } from '@shared/hooks';
import './styles/_swipeable-container.scss';

export interface SwipeableContainerProps extends SwipeConfig {
  /**
   * Content to render inside the swipeable container
   */
  children: ReactNode;
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Whether to show visual feedback during swipe
   */
  showFeedback?: boolean;
  /**
   * Opacity to apply when swiping (0-1)
   */
  swipeOpacity?: number;
}

/**
 * A reusable container component that handles swipe gestures with smooth animations
 * 
 * @example
 * ```tsx
 * <SwipeableContainer
 *   direction="down"
 *   onSwipe={handleClose}
 *   threshold={100}
 *   axis="y"
 *   className="item-details"
 * >
 *   <ItemContent />
 * </SwipeableContainer>
 * ```
 */
export const SwipeableContainer: React.FC<SwipeableContainerProps> = ({
  children,
  className = '',
  showFeedback = true,
  swipeOpacity = 0.7,
  ...swipeConfig
}) => {
  const { springProps, bind } = useSwipeGesture(swipeConfig);

  // Calculate opacity based on swipe distance
  const opacity = showFeedback
    ? springProps.style.y.to((y) => {
        const distance = Math.abs(y);
        const maxDistance = swipeConfig.maxDistance || 300;
        return Math.max(swipeOpacity, 1 - distance / maxDistance);
      })
    : undefined;

  return (
    <animated.div
      className={`swipeable-container ${className}`}
      style={{
        x: springProps.style.x,
        y: springProps.style.y,
        opacity: showFeedback ? opacity : undefined,
        touchAction: swipeConfig.axis === 'y' ? 'pan-y' : swipeConfig.axis === 'x' ? 'pan-x' : 'pan-y pan-x'
      }}
      {...bind()}
    >
      {children}
    </animated.div>
  );
};

