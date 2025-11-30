export interface FeatureFlags {
  distanceSlider: boolean;
  checkout: boolean;
  checkoutButton: boolean;
}

export const featureFlags: FeatureFlags = {
  distanceSlider: false,
  checkout: false,
  checkoutButton: false
};

/**
 * Helper function to check if a feature is enabled
 * @param flag - The feature flag name
 * @returns true if the feature is enabled, false otherwise
 */
export const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
  return featureFlags[flag] === true;
};

/**
 * Get all enabled features
 * @returns Array of enabled feature flag names
 */
export const getEnabledFeatures = (): Array<keyof FeatureFlags> => {
  return Object.entries(featureFlags)
    .filter(([_, enabled]) => enabled === true)
    .map(([key]) => key as keyof FeatureFlags);
};
