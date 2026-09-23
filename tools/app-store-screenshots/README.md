# Studioz App Store Screenshot Generator

Generates deterministic raw Studioz screenshots and composes them into premium, App Store-style PNG assets.

Studioz does not currently have a native iOS application. The current capture adapter renders the real responsive web app at iPhone, iPad, and desktop viewports. The capture boundary is deliberately separate from the marketing renderer so a future native iOS/XCTest adapter can replace it without changing templates, configuration, validation, or output paths.

## Pipeline

```text
Studioz web app
  -> fixture-backed raw screenshot
  -> marketing renderer
  -> validated PNG asset
```

Raw screenshots, final marketing assets, and previews are never mixed.

## Prerequisites

- Node.js 18 or newer; CI currently uses Node.js 20.
- `npm ci` completed in `Frontend`.
- Chrome/Chromium available to Puppeteer.
- On CI systems with a system browser, set `PUPPETEER_EXECUTABLE_PATH`.

No backend, production credentials, live database, iOS simulator, or network data is required.

## Commands

Run from `Frontend`:

```bash
# Full production build, capture, render, and validation
npm run screenshots

# Faster 50% previews using the Vite development server
npm run screenshots:preview

# Validate existing production outputs only
npm run screenshots:validate

# Unit and renderer integration tests
npm run screenshots:test
```

Selective generation:

```bash
npm run screenshots -- --only dashboard-calendar-en-us-dark
npm run screenshots -- --locale en-US
npm run screenshots -- --locale he --theme light
npm run screenshots -- --device iphone-6.9
npm run screenshots -- --template full-bleed
npm run screenshots -- --scenario projects-list-he-dark
npm run screenshots -- --skip-capture --only dashboard-statistics-en-us-light
```

`--skip-capture` reuses existing raw screenshots. It fails if a required raw file is missing or corrupt.
A full unfiltered capture clears `output/raw/` first, so removed or renamed scenes cannot leave stale assets behind.

## Output

```text
output/
  raw/
    en-US/
      iphone-6.9/
      desktop-1440/
  ios/
    en-US/
      dark/
        01-studio-details.png
        01-studio-details.webp
      light/
        01-studio-details.png
    he/
      dark/
      light/
  web/
    desktop/
      en-US/
        dark/
        light/
  previews/
  manifest.json
```

Every rendered PNG has an optimized, same-size WebP companion in the same directory. PNG remains the lossless/App Store-compatible source; WebP is intended for websites and landing pages. To optimize PNGs that already exist without recapturing or rerendering:

```bash
npm run screenshots:optimize
```

Generated output is ignored by Git. Scenes with a `publish` target also export a resized WebP into `public/images/`; those application assets are committed and update during a production generation run. App Store Connect uploading is intentionally outside this tool.

## Configuration

All screenshot-specific choices live in `screenshots.config.ts`. Each curated scene automatically expands to English/Hebrew and dark/light variants. Rendering code never contains screenshot IDs or marketing copy.

```ts
{
  id: 'dashboard-calendar',
  order: 2,
  path: '/dashboard?tab=overview',
  readySelector: '.dashboard-calendar',
  fixture: 'vendor-dashboard',
  auth: 'vendor',
  device: 'iphone-6.9',
  template: 'full-bleed',
  copy: {
    'en-US': {
      title: 'Every booking, under control',
      subtitle: 'See your schedule and manage studio availability from anywhere.'
    },
    he: {
      title: 'כל ההזמנות בשליטה',
      subtitle: 'רואים את הלו״ז ומנהלים את זמינות הסטודיו מכל מקום.'
    }
  },
  deviceTransform: {
    scale: 0.82,
    y: 560,
    shadow: true
  }
}
```

Configuration supports:

- Single and dual raw screenshot sources
- Hero, feature, dual, full-bleed, minimal, and product-only templates
- Device family and orientation
- Solid, linear-gradient, and radial backgrounds
- Text alignment and title/subtitle typography overrides
- Safe-area overrides
- Device scale, position, rotation, perspective, and shadow
- Screenshot crop/object position
- Automatic English/Hebrew and light/dark matrix expansion
- Locale-aware routes, bundled Hebrew typography, and RTL direction
- Theme-aware backgrounds and output folders
- Custom output filename and dimensions
- Optional resized WebP publishing for screenshots consumed by the application

For landing-page artwork that combines independently captured desktop and mobile layouts, use the dual template:

```ts
{
  id: 'cross-device-project-review',
  device: 'desktop-1440',
  secondaryDevice: 'iphone-6.9',
  template: 'dual',
  deviceTransform: { scale: 0.66, x: -300, y: 130 },
  secondaryDeviceTransform: { scale: 0.37, x: 350, y: 170 }
}
```

The expander creates separate captures at each viewport and supplies both sources to the shared renderer. This preserves the app’s real responsive layouts instead of scaling one screenshot into two frames.

Use the `product` template for embedded landing-page visuals that should not repeat marketing copy. A scene can publish all four generated variants directly to the app:

```ts
{
  id: 'landing-booking-flow',
  template: 'product',
  publish: {
    directory: 'public/images/landing-generated',
    dimensions: { width: 1320, height: 825 },
    quality: 90
  }
}
```

This produces `public/images/landing-generated/{locale}/{theme}/landing-booking-flow.webp`. Preview runs never overwrite published assets.

Runtime validation fails on duplicate IDs/filenames, unknown capture sources, unsupported devices/templates, invalid colors, or malformed output names.

## Adding a screenshot

1. Add one curated product scene in `screenshots.config.ts`.
2. Provide English and Hebrew title/subtitle copy.
3. If the screen uses API data, add deterministic responses in `src/capture/fixtures.ts`.
4. Use a stable page selector as `readySelector`.
5. The scene expander creates four marketing assets automatically. Dual scenes create two viewport captures per locale/theme variant.
6. Run:

   ```bash
   npm run screenshots:preview -- --only your-scene-en-us-dark
   npm run screenshots -- --only your-scene-en-us-dark
   ```

Capture navigation supports stable `click`, `fill`, `press`, and `scroll` actions. Do not add arbitrary delays. The adapter waits for the ready selector, local fonts, decoded images, and stable layout frames.

## Adding or changing templates

Template geometry is centralized in `src/render/templates.ts`. Shared typography, backgrounds, safe areas, device frames, masks, and shadows are implemented once in `src/render/renderer.ts`.

To add a template:

1. Extend `TemplateId` in `src/config/types.ts`.
2. Add its layout to `TEMPLATE_LAYOUTS`.
3. Add the corresponding shared CSS layout rule in the renderer.
4. Add a template registry test.

Do not duplicate full renderer markup for each template.

## Devices and App Store dimensions

Device specifications are centralized in `src/config/devices.ts`.

The renderer reserves dedicated browser/device-chrome space above every captured viewport. Desktop traffic-light controls and mobile dynamic islands therefore never overlay the application header, logo, or navigation. Raw captures remain pure application viewports; the frame grows to accommodate the synthetic chrome instead of cropping or compressing the app.

Supported families:

- iPhone 6.9-inch
- iPhone 6.7-inch
- iPhone 6.5-inch
- iPad 13-inch
- Desktop 1440

Update App Store dimensions only in that file. Portrait and landscape dimensions are derived centrally.

The generated iPhone/iPad frame is original CSS/SVG-style geometry. It does not use proprietary Apple marketing assets or third-party mockups.

## Typography and fonts

The renderer embeds local DM Sans and Noto Sans Hebrew WOFF2 files from Fontsource packages. It never requests Google Fonts and does not depend on fonts installed on a developer machine.

Typography defaults are template-driven and can be overridden per screenshot. Text is measured after fonts load and shrunk only to its configured minimum. Remaining overflow fails generation with an actionable error.

## Backgrounds and device presentation

Backgrounds are config-driven:

```ts
background: { type: 'solid', value: '#f5f5f7' }
background: { type: 'gradient', from: '#ffffff', to: '#ececec', angle: 160 }
background: { type: 'radial', inner: '#26313d', outer: '#080b0f', origin: '50% 20%' }
```

Device position and appearance are also config-driven:

```ts
deviceTransform: {
  scale: 0.76,
  x: 120,
  y: 480,
  rotation: -2,
  perspective: 1200,
  shadow: true
}
```

## Localization and RTL

Every scene requires English and Hebrew copy. The variant expander generates both locale routes for both themes. `he` automatically switches composition direction to RTL and selects the bundled Hebrew font.

When adding a locale:

1. Extend `LocaleId`.
2. Map the locale to direction in the renderer/capture state.
3. Add localized title and subtitle definitions.
4. Add a localization test with long copy.

Raw app language is seeded before React starts using the existing `i18nextLng` local-storage key.

## Deterministic fixtures

`src/capture/fixtures.ts` contains known studios, services, users, bookings, and project data.

During capture:

- Runtime API requests to `localhost:3003/api` are answered from fixtures.
- Unknown API calls fail generation.
- External network requests are blocked.
- User, language, theme, and consent state are seeded before page scripts.
- Time is frozen.
- `Math.random` is seeded, making shuffled lists stable.
- Motion, caret blinking, and transitions are disabled.

Never point screenshot generation at production data.

### Authenticated captures

Set `auth` on a capture to `guest`, `vendor`, or `customer`. The adapter seeds the matching deterministic user before React starts, so screens backed by `UserContext` render their authenticated controls without real credentials or an Auth0 network session.

```ts
{
  id: 'vendor-dashboard-mobile',
  route: '/en/dashboard?tab=overview',
  readySelector: '.dashboard-page',
  fixture: 'vendor-dashboard',
  auth: 'vendor',
  theme: 'dark',
  locale: 'en-US',
  viewportDevice: 'iphone-6.9'
}
```

The committed set includes authenticated vendor dashboard and project-management captures on mobile, plus the desktop dashboard. Add explicit fixtures for any additional account-only API endpoints; unknown calls fail instead of silently showing guest content.

## Validation

Every generated PNG is checked for:

- Presence and decodability
- PNG format
- Exact dimensions
- Minimum resolution
- sRGB-compatible color mode
- No visible alpha/transparency
- Valid and unique filename
- Complete expected output set
- Detectable text overflow

Any invalid file fails the command.

## CI

The repository already installs Chromium for frontend prerendering. A future CI job can use the same pattern:

```bash
npm ci
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium npm run screenshots
```

For byte-identical golden comparisons, use one pinned Linux image. Font rasterization can differ slightly across operating systems even with identical font files.

## Troubleshooting

### Chrome cannot launch

Set an installed executable explicitly:

```bash
PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run screenshots
```

On Linux, confirm required Chromium libraries are installed.

### Missing fixture request

Generation prints the exact HTTP method and URL. Add a deterministic handler in `src/capture/fixtures.ts`; do not allow the request to fall through to production.

### Ready selector timeout

Confirm the route is enabled and the selector exists after fixture data loads. Prefer a stable page root or semantic state marker.

### Text overflow

Shorten the localized copy, increase its configured width, or lower `minFontSize`. Do not hide overflow errors.

### Raw screenshot is stale

Run without `--skip-capture`.

### Native iOS screenshots later

Implement the existing `CaptureAdapter` interface with an Xcode/XCTest or simulator-backed adapter. It should output raw PNGs at the same stage boundary. No marketing renderer, template, validation, or export code needs to change.
