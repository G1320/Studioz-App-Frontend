import './styles/_index.scss';
import React from 'react';

interface SkeletonLoaderProps {
  /**
   * Custom className to override or extend default styles
   */
  className?: string;
  /**
   * Width of the skeleton (e.g., '100%', '200px', '50rem')
   */
  width?: string | number;
  /**
   * Height of the skeleton (e.g., '100%', '200px', '50rem')
   */
  height?: string | number;
  /**
   * Border radius (e.g., '8px', '50%', '12px')
   */
  borderRadius?: string;
  /**
   * Whether the skeleton should be circular
   */
  circular?: boolean;
  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;
  /**
   * Animation speed multiplier (1 = normal, 2 = twice as fast, 0.5 = half speed)
   */
  animationSpeed?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width,
  height,
  borderRadius,
  circular = false,
  style = {},
  animationSpeed = 1
}) => {
  const computedStyle: React.CSSProperties = {
    ...style,
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
    ...(borderRadius && { borderRadius }),
    ...(circular && { borderRadius: '50%' }),
    ...(animationSpeed !== 1 &&
      ({
        '--skeleton-animation-speed': `${animationSpeed}`,
        animationDuration: `calc(1.8s / ${animationSpeed})`
      } as React.CSSProperties))
  };

  return (
    <div
      className={`skeleton-loader ${className}`}
      style={computedStyle}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    />
  );
};
