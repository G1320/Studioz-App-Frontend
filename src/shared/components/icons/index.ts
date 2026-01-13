// ============================================
// StudioZ Icon System
// ============================================
// Centralized icon exports with consistent naming and defaults.
// 
// USAGE:
//   import { Icons } from '@shared/components/icons';
//   <Icons.Calendar size={20} />
//
// Or import individual icons:
//   import { CalendarIcon, LocationIcon } from '@shared/components/icons';
//
// BENEFITS:
// - Single source of truth for all icons
// - Easy to swap icon libraries
// - Consistent sizing and styling
// - Full TypeScript autocomplete
// - Tree-shakeable (only imports what you use)
// ============================================

// MUI-based icons with semantic naming
export * from './icons';
export * from './Icon';

// Custom SVG icons
export * from './WavyMenuIcon';
export * from './CategoryIcons';
export * from './AmenityIcons';

// Convenience exports
export { Icons } from './icons';
export { Icon } from './Icon';
