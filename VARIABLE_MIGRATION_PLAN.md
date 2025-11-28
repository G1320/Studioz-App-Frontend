# Variable Migration Plan

## Current State
- SCSS variables exist in `_variables.scss`
- Many hardcoded values throughout the codebase
- Need to systematically replace with variables

## Variables Available

### Colors
- `$color-brand`
- `$color-accent`
- `$color-light`
- `$color-dark`
- `$color-secondary`
- `$text-color-primary`
- `$text-color-secondary`
- `$text-color-dark`
- `$bg-color-primary`
- `$bg-color-secondary`
- `$border-color-primary`
- `$border-color-secondary`
- `$border-color-tertiary`

### Font Sizes
- `$font-size-small: 12px`
- `$font-size-medium: 16px`
- `$font-size-large: 20px`
- `$font-size-xl: 24px`

### Spacing
- `$spacing-small: 8px`
- `$spacing-medium: 16px`
- `$spacing-large: 24px`
- `$spacing-xl: 32px`

### Border Radius
- `$border-radius-small: 4px`
- `$border-radius-medium: 8px`
- `$border-radius-large: 12px`
- `$border-radius-xl: 16px`

### Box Shadows
- `$box-shadow-small`
- `$box-shadow-medium`
- `$box-shadow-large`
- `$box-shadow-xl`

## Common Hardcoded Values Found

### Font Sizes (need variables)
- `16px` → `$font-size-medium`
- `12px` → `$font-size-small`
- `14px` → **NEED NEW: `$font-size-xs: 14px`**
- `20px` → `$font-size-large`
- `24px` → `$font-size-xl`
- `0.8rem`, `0.875rem`, `0.9rem`, `0.95rem` → Map to closest variable
- `1rem`, `1.1rem`, `1.2rem`, `1.25rem` → Map to closest variable
- `1.5rem`, `2rem` → **NEED NEW: `$font-size-2xl: 32px`, `$font-size-3xl: 40px`**

### Spacing (need variables)
- `4px` → **NEED NEW: `$spacing-xs: 4px`**
- `8px` → `$spacing-small`
- `10px`, `12px`, `15px` → Map to closest or **NEED NEW: `$spacing-xs-md: 12px`**
- `16px` → `$spacing-medium`
- `20px`, `24px` → `$spacing-large` or map
- `30px`, `32px` → `$spacing-xl` or map
- `40px`, `48px`, `60px` → **NEED NEW: `$spacing-2xl: 48px`, `$spacing-3xl: 64px`**

### Border Radius (need variables)
- `4px` → `$border-radius-small`
- `6px` → **NEED NEW: `$border-radius-xs: 6px`** or use `$border-radius-small`
- `8px` → `$border-radius-medium`
- `10px` → Map to `$border-radius-medium`
- `12px` → `$border-radius-large`
- `16px` → `$border-radius-xl`
- `20px`, `25px` → **NEED NEW: `$border-radius-2xl: 20px`**

### Colors (need variables)
- `#fff`, `#ffffff` → `$color-light` or `$text-color-primary`
- `#000`, `#000000` → `$color-dark` or `$bg-color-primary`
- `#333` → **NEED NEW: `$text-color-tertiary: #333333`**
- `#666`, `#666666` → `$text-color-secondary`
- `#cccccc` → **NEED NEW: `$border-color-quaternary: #cccccc`**
- `#1a1a1a` → **NEED NEW: `$bg-color-tertiary: #1a1a1a`**
- `rgba(255, 255, 255, 0.1)`, `rgba(255, 255, 255, 0.15)` → Use `rgba($border-color-primary, 0.1)`
- `rgba(0, 0, 0, 0.1)` → Use existing shadow variables

## Migration Priority

### Phase 1: Add Missing Variables
1. Add missing font-size variables
2. Add missing spacing variables
3. Add missing border-radius variables
4. Add missing color variables

### Phase 2: Core Files First
1. `_base.scss` - Foundation styles
2. `_variables.scss` - Ensure all needed variables exist

### Phase 3: Component Files
1. Button components
2. Form components
3. Preview components
4. Modal/Dialog components
5. Navigation components
6. Other components

## Files to Update

### High Priority (Foundation)
- [ ] `src/assets/styles/base/_base.scss`
- [ ] `src/assets/styles/utilities/_variables.scss` (add missing vars)

### Medium Priority (Common Components)
- [ ] `src/shared/components/buttons/styles/_buttons.scss`
- [ ] `src/shared/components/cookie-consent/styles/_cookie-consent-banner.scss`
- [ ] `src/shared/components/location-welcome/styles/_location-welcome-popup.scss`

### Lower Priority (Feature Components)
- [ ] All files in `src/features/entities/*/styles/`
- [ ] All files in `src/app/layout/*/styles/`

