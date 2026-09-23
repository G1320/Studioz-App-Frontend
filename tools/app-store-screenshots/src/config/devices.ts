import type { DeviceId, Dimensions, Insets, Orientation } from './types.js';

export interface DeviceSpec {
  id: DeviceId;
  family: 'phone' | 'tablet' | 'desktop';
  label: string;
  viewport: Dimensions;
  output: Dimensions;
  screenAspectRatio: number;
  screenCornerRadius: number;
  safeArea: Insets;
  hasDynamicIsland: boolean;
}

export const PREVIEW_SCALE = 0.5;

export const DEVICE_SPECS: Record<DeviceId, DeviceSpec> = {
  'iphone-6.9': {
    id: 'iphone-6.9',
    family: 'phone',
    label: 'iPhone 6.9-inch',
    viewport: { width: 440, height: 956 },
    output: { width: 1320, height: 2868 },
    screenAspectRatio: 440 / 956,
    screenCornerRadius: 62,
    safeArea: { top: 210, right: 96, bottom: 120, left: 96 },
    hasDynamicIsland: true
  },
  'iphone-6.7': {
    id: 'iphone-6.7',
    family: 'phone',
    label: 'iPhone 6.7-inch',
    viewport: { width: 430, height: 932 },
    output: { width: 1290, height: 2796 },
    screenAspectRatio: 430 / 932,
    screenCornerRadius: 60,
    safeArea: { top: 204, right: 92, bottom: 116, left: 92 },
    hasDynamicIsland: true
  },
  'iphone-6.5': {
    id: 'iphone-6.5',
    family: 'phone',
    label: 'iPhone 6.5-inch',
    viewport: { width: 414, height: 896 },
    output: { width: 1242, height: 2688 },
    screenAspectRatio: 414 / 896,
    screenCornerRadius: 56,
    safeArea: { top: 194, right: 88, bottom: 110, left: 88 },
    hasDynamicIsland: false
  },
  'ipad-13': {
    id: 'ipad-13',
    family: 'tablet',
    label: 'iPad 13-inch',
    viewport: { width: 1032, height: 1376 },
    output: { width: 2064, height: 2752 },
    screenAspectRatio: 1032 / 1376,
    screenCornerRadius: 38,
    safeArea: { top: 154, right: 124, bottom: 124, left: 124 },
    hasDynamicIsland: false
  },
  'desktop-1440': {
    id: 'desktop-1440',
    family: 'desktop',
    label: 'Desktop 1440',
    viewport: { width: 1440, height: 900 },
    output: { width: 2880, height: 1800 },
    screenAspectRatio: 1440 / 900,
    screenCornerRadius: 18,
    safeArea: { top: 120, right: 140, bottom: 120, left: 140 },
    hasDynamicIsland: false
  }
};

export function orientDimensions(dimensions: Dimensions, orientation: Orientation = 'portrait'): Dimensions {
  if (orientation === 'portrait' || dimensions.width > dimensions.height) {
    return orientation === 'portrait'
      ? { width: Math.min(dimensions.width, dimensions.height), height: Math.max(dimensions.width, dimensions.height) }
      : { width: Math.max(dimensions.width, dimensions.height), height: Math.min(dimensions.width, dimensions.height) };
  }
  return { width: dimensions.height, height: dimensions.width };
}

export function getOutputDimensions(device: DeviceSpec, orientation: Orientation = 'portrait'): Dimensions {
  if (device.family === 'desktop') return device.output;
  return orientDimensions(device.output, orientation);
}

export function getViewportDimensions(device: DeviceSpec, orientation: Orientation = 'portrait'): Dimensions {
  if (device.family === 'desktop') return device.viewport;
  return orientDimensions(device.viewport, orientation);
}

export function getPreviewDimensions(dimensions: Dimensions): Dimensions {
  return {
    width: Math.max(320, Math.round(dimensions.width * PREVIEW_SCALE)),
    height: Math.max(320, Math.round(dimensions.height * PREVIEW_SCALE))
  };
}
