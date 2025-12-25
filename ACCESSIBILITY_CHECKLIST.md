# Quick Accessibility Checklist

Use this checklist when creating or reviewing components for accessibility compliance.

## Form Inputs
- [ ] Every input has an associated `<label>` with `htmlFor` matching input `id`
- [ ] Placeholder text is not the only label (use actual labels)
- [ ] Error messages are associated with inputs using `aria-describedby`
- [ ] Inputs with errors have `aria-invalid="true"`
- [ ] Required fields are indicated (visually and programmatically with `aria-required`)
- [ ] Related fields are grouped with `<fieldset>` and `<legend>`

## Buttons & Interactive Elements
- [ ] All buttons have accessible names (text content or `aria-label`)
- [ ] Icon-only buttons have descriptive `aria-label`
- [ ] Buttons have visible focus indicators (`:focus-visible`)
- [ ] Disabled buttons are properly indicated
- [ ] Loading states are announced (`aria-busy`, `aria-live`)

## Images
- [ ] All images have `alt` text
- [ ] Decorative images have `alt=""` or `aria-hidden="true"`
- [ ] Complex images (charts, graphs) have detailed descriptions
- [ ] Images used as links have descriptive alt text

## Navigation
- [ ] Skip links are provided for main content
- [ ] Current page is indicated with `aria-current="page"`
- [ ] Navigation landmarks use `<nav>` element
- [ ] Breadcrumbs are properly structured

## Modals & Dialogs
- [ ] Modal has `role="dialog"` or `role="alertdialog"`
- [ ] Modal has `aria-labelledby` pointing to title
- [ ] Modal has `aria-describedby` if description exists
- [ ] Modal has `aria-modal="true"`
- [ ] Focus is trapped within modal when open
- [ ] Focus returns to trigger element when modal closes
- [ ] Escape key closes modal
- [ ] Background is properly hidden from screen readers (`aria-hidden`)

## Dynamic Content
- [ ] Loading states are announced (`aria-live="polite"`, `aria-busy`)
- [ ] Error messages use `role="alert"` or `aria-live="assertive"`
- [ ] Status updates use `aria-live="polite"`
- [ ] Live regions have `aria-atomic` where appropriate

## Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are visible and clear
- [ ] Keyboard shortcuts are documented (if provided)
- [ ] Escape key closes modals/dropdowns
- [ ] Arrow keys work for carousels, menus, etc.

## Structure & Semantics
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skipping levels)
- [ ] Semantic HTML elements used (`<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>`)
- [ ] Lists use proper list elements (`<ul>`, `<ol>`, `<li>`)
- [ ] Tables have proper headers (`<th>` with `scope`)

## ARIA Usage
- [ ] `aria-label` used when visible label not possible
- [ ] `aria-labelledby` used to reference visible labels
- [ ] `aria-describedby` used for additional descriptions
- [ ] `aria-expanded` on collapsible elements (dropdowns, accordions)
- [ ] `aria-controls` links controls to controlled elements
- [ ] `aria-haspopup` indicates popup menus/dialogs
- [ ] `aria-hidden="true"` on decorative icons/images
- [ ] `role` attributes used appropriately (don't override native semantics)

## Color & Contrast
- [ ] Text meets contrast ratio (4.5:1 for normal, 3:1 for large)
- [ ] Color is not the only means of conveying information
- [ ] Focus indicators meet 3:1 contrast ratio
- [ ] Interactive elements have non-color indicators (icons, underlines, etc.)

## Responsive & Mobile
- [ ] Touch targets are at least 44x44px
- [ ] Content is readable without horizontal scrolling
- [ ] Zoom up to 200% doesn't break layout
- [ ] Orientation changes don't break functionality

## Testing
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Tested with browser zoom at 200%
- [ ] Tested in high contrast mode
- [ ] Automated testing tools run (axe, Lighthouse, WAVE)
- [ ] Manual testing checklist completed

## Common Patterns

### Accessible Button
```tsx
<button
  type="button"
  onClick={handleClick}
  aria-label="Descriptive label for icon-only buttons"
  aria-disabled={isLoading}
>
  {children}
</button>
```

### Accessible Form Field
```tsx
<div className="form-group">
  <label htmlFor="field-id">
    Field Label
    {required && <span aria-label="required">*</span>}
  </label>
  <input
    id="field-id"
    type="text"
    aria-describedby="field-id-error"
    aria-invalid={!!error}
    aria-required={required}
  />
  {error && (
    <div id="field-id-error" role="alert" aria-live="polite">
      {error}
    </div>
  )}
</div>
```

### Accessible Modal
```tsx
<Modal
  open={isOpen}
  onClose={handleClose}
  role="dialog"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  aria-modal="true"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description</p>
  {/* content */}
</Modal>
```

### Accessible Image
```tsx
// Content image
<img src="photo.jpg" alt="Description of what's in the image" />

// Decorative image
<img src="decoration.jpg" alt="" aria-hidden="true" />

// Complex image
<img src="chart.jpg" alt="Sales chart showing 50% increase" />
<details>
  <summary>Detailed description</summary>
  <p>Full description of chart data...</p>
</details>
```

### Accessible Collapsible
```tsx
<button
  aria-expanded={isOpen}
  aria-controls="collapsible-content"
  aria-haspopup="true"
  onClick={toggle}
>
  Toggle
</button>
<div id="collapsible-content" hidden={!isOpen}>
  Content
</div>
```

---

**Remember:** When in doubt, test with a screen reader and keyboard navigation!

