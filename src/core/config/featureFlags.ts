export interface FeatureFlags {
  distanceSlider: boolean;
  checkout: boolean;
  checkoutButton: boolean;
  servicesPage: boolean;
  headerCurrentCity: boolean;
  faviconLogo: boolean;
  itemCardDistanceBadge: boolean;
  notifications: boolean;
  addOns: boolean;
  reservationsPage: boolean;
  reservationDetailsPage: boolean;
  headerSearchIcon: boolean;
  headerBackButton: boolean;
  dynamicCategorySelector: boolean;
  forOwnersPage: boolean;
  brevoChat: boolean;
  studioInfoModal: boolean;
  discoverPage: boolean;
  mobileFooterNavigation: boolean;
  subscriptionsPage: boolean;
}

export const featureFlags: FeatureFlags = {
  distanceSlider: false,
  checkout: false,
  checkoutButton: false,
  servicesPage: false,
  headerCurrentCity: false,
  faviconLogo: true,
  itemCardDistanceBadge: false,
  notifications: true,
  addOns: true,
  reservationsPage: false,
  reservationDetailsPage: false,
  headerSearchIcon: true,
  headerBackButton: false,
  dynamicCategorySelector: false,
  forOwnersPage: true,
  brevoChat: false,
  studioInfoModal: false,
  discoverPage: false,
  mobileFooterNavigation: false,
  subscriptionsPage: false
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
