# Theme Migration Guide - StudioZ

This guide explains how to migrate components to support both light and dark themes.

## Overview

The theming system uses CSS custom properties (variables) defined in `_themes.scss` that automatically switch values based on the `data-theme` attribute on the HTML element.

## Quick Reference

### Instead of SCSS Variables, Use CSS Variables:

| Old (SCSS Variable)        | New (CSS Variable)        |
| -------------------------- | ------------------------- |
| `vars.$bg-color-primary`   | `var(--bg-primary)`       |
| `vars.$bg-color-secondary` | `var(--bg-secondary)`     |
| `vars.$bg-color-tertiary`  | `var(--bg-tertiary)`      |
| `vars.$card-bg-color`      | `var(--card-bg)`          |
| `vars.$text-color-primary` | `var(--text-primary)`     |
| `vars.$white-opacity-70`   | `var(--text-secondary)`   |
| `vars.$white-opacity-50`   | `var(--text-tertiary)`    |
| `vars.$white-opacity-40`   | `var(--text-muted)`       |
| `vars.$color-brand`        | `var(--color-brand)`      |
| `vars.$zinc-800`           | `var(--border-secondary)` |
| `vars.$white-opacity-10`   | `var(--border-primary)`   |
| `vars.$white-opacity-05`   | `var(--bg-hover)`         |
| `rgba(0, 0, 0, 0.5)`       | `var(--overlay-bg)`       |

### Or Better Yet, Use Mixins:

```scss
@use 'utilities/mixins' as mixins;

.my-card {
  @include mixins.card-interactive; // Full card with hover states
}

.my-text {
  @include mixins.text-secondary; // Secondary text color
}

.my-overlay {
  @include mixins.overlay-backdrop; // Modal/loading backdrop
}
```

## Available Mixins

### Text Mixins

- `@include mixins.text-primary` - Main text color
- `@include mixins.text-secondary` - Secondary text (70% opacity equivalent)
- `@include mixins.text-tertiary` - Tertiary text (50% opacity equivalent)
- `@include mixins.text-muted` - Muted text (40% opacity equivalent)
- `@include mixins.text-brand` - Brand color text
- `@include mixins.text-link` - Link with hover state

### Card Mixins

- `@include mixins.card-base` - Basic card styling
- `@include mixins.card-interactive` - Card with hover/active states
- `@include mixins.card-elevated` - Card with shadow
- `@include mixins.card-title` - Card title text
- `@include mixins.card-description` - Card description text
- `@include mixins.card-meta` - Card metadata text

### Surface Mixins

- `@include mixins.surface-primary` - Primary background
- `@include mixins.surface-secondary` - Secondary background
- `@include mixins.surface-elevated` - Elevated surface
- `@include mixins.surface-card` - Card surface

### Section Mixins

- `@include mixins.section-base` - Page section
- `@include mixins.section-alternate` - Alternating section
- `@include mixins.section-surface` - Surface section

### Overlay Mixins

- `@include mixins.overlay-backdrop` - Modal backdrop with blur
- `@include mixins.overlay-loading` - Loading overlay
- `@include mixins.overlay-surface` - Modal content surface

### Badge Mixins

- `@include mixins.badge-neutral` - Neutral badge
- `@include mixins.badge-brand` - Brand colored badge
- `@include mixins.badge-success` - Success badge
- `@include mixins.badge-warning` - Warning badge
- `@include mixins.badge-error` - Error badge
- `@include mixins.badge-info` - Info badge

### Button Mixins

- `@include mixins.button-primary` - Primary CTA button
- `@include mixins.button-secondary` - Secondary button
- `@include mixins.button-ghost` - Ghost/text button
- `@include mixins.button-icon` - Icon-only button

### Input Mixins

- `@include mixins.input-base` - Form input styling
- `@include mixins.input-error` - Input error state

### Utility Mixins

- `@include mixins.divider-horizontal` - Horizontal divider
- `@include mixins.divider-vertical` - Vertical divider
- `@include mixins.custom-scrollbar` - Custom scrollbar styling
- `@include mixins.skeleton-loader` - Skeleton loading animation
- `@include mixins.focus-ring` - Focus ring for accessibility
- `@include mixins.dropdown-container` - Dropdown menu container
- `@include mixins.dropdown-item` - Dropdown menu item
- `@include mixins.tooltip` - Tooltip styling
- `@include mixins.glass-effect` - Frosted glass effect

## Migration Steps

### Step 1: Import mixins

```scss
@use 'utilities/mixins' as mixins;
```

### Step 2: Replace hardcoded colors

**Before:**

```scss
.my-component {
  background: #242728;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**After:**

```scss
.my-component {
  @include mixins.card-base;
  // or individually:
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
```

### Step 3: Replace opacity-based colors

**Before:**

```scss
.description {
  color: vars.$white-opacity-70;
}
```

**After:**

```scss
.description {
  color: var(--text-secondary);
  // or use mixin:
  @include mixins.text-secondary;
}
```

### Step 4: Replace status colors

**Before:**

```scss
.success-badge {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.3);
}
```

**After:**

```scss
.success-badge {
  @include mixins.badge-success;
  // or individually:
  background: var(--color-success-bg);
  color: var(--color-success-text);
  border: 1px solid var(--color-success-border);
}
```

## Files Requiring Migration

The following files still use hardcoded colors or SCSS variables that need migration:

### High Priority (Core UI Components)

- `src/features/landing/styles/_landing-page.scss` (19 matches)
- `src/features/entities/studios/styles/_studio-details.scss` (33 matches)
- `src/features/entities/studios/styles/_sidebar-filters.scss` (51 matches)
- `src/shared/components/portfolio-step/styles/_portfolio-step.scss` (52 matches)
- `src/features/entities/bookings/calender/styles/_calendar.scss` (91 matches)
- `src/features/entities/admin/components/styles/_admin-panel.scss` (30 matches)

### Medium Priority (Feature Components)

- `src/features/entities/subscriptions/styles/_subscription-page.scss` (12 matches)
- `src/features/entities/subscriptions/styles/_my-subscription-page.scss` (22 matches)
- `src/features/entities/items/styles/_item-details.scss` (22 matches)
- `src/shared/components/forms/styles/_branded-form.scss` (19 matches)
- `src/features/static/styles/_how-it-works-page.scss` (19 matches)
- `src/features/static/styles/_for-owners-page.scss` (11 matches)

### Lower Priority (Smaller Components)

- Various reservation components
- Various form fields
- Various utility components

## CSS Variables Reference

All available CSS variables are defined in:
`src/assets/styles/themes/_themes.scss`

Key variable categories:

- `--bg-*` - Background colors
- `--text-*` - Text colors
- `--border-*` - Border colors
- `--color-*` - Status/brand colors
- `--shadow-*` - Box shadows
- `--btn-*` - Button colors
- `--input-*` - Input field colors

## Testing Theme Changes

1. Toggle theme using the theme switcher in the header menu
2. Check both light and dark modes
3. Verify text is readable on all backgrounds
4. Ensure interactive elements have visible hover/focus states
5. Test status colors (success, warning, error, info) in both modes
