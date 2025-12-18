import React from 'react';

interface WavyMenuIconProps {
  className?: string;
  'aria-label'?: string;
}

/**
 * Custom wavy menu icon - three curved lines instead of straight
 */
export const WavyMenuIcon: React.FC<WavyMenuIconProps> = ({ className, 'aria-label': ariaLabel }) => {
  return (
    <svg
      className={className}
      aria-label={ariaLabel}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top wavy line - one sine wave cycle (slightly increased amplitude) */}
      <path
        d="M3 7 C6 5.7, 9 5.7, 12 7 C15 8.3, 18 8.3, 21 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Middle wavy line - one sine wave cycle (slightly increased amplitude) */}
      <path
        d="M3 12 C6 10.7, 9 10.7, 12 12 C15 13.3, 18 13.3, 21 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bottom wavy line - one sine wave cycle (slightly increased amplitude) */}
      <path
        d="M3 17 C6 15.7, 9 15.7, 12 17 C15 18.3, 18 18.3, 21 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

