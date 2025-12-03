import { lazy } from 'react';

// Lazy load Mapbox components to reduce initial bundle size
// Mapbox GL is ~1.4MB, so we only load it when needed
export const LazyStudiosMap = lazy(() => import('./StudiosMap').then((module) => ({ default: module.StudiosMap })));
export const LazyItemsMap = lazy(() => import('./ItemsMap').then((module) => ({ default: module.ItemsMap })));
export const LazyMinimap = lazy(() => import('./Minimap').then((module) => ({ default: module.Minimap })));

