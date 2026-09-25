/**
 * Remotion ad feature flags.
 * Keep in sync with Frontend `src/core/config/featureFlags.ts`.
 *
 * progressivePlatformFees OFF (default) → flat 9% platform fee messaging
 * progressivePlatformFees ON → 9% / 7% / 5% tier messaging
 */
export const remotionFeatureFlags = {
  progressivePlatformFees: false,
} as const;

export const isProgressivePlatformFeesEnabled = () =>
  remotionFeatureFlags.progressivePlatformFees === true;
