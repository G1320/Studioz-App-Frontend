import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { afterAll, describe, expect, it } from 'vitest';
import { screenshotConfig } from '../screenshots.config.js';
import { DEVICE_SPECS, getOutputDimensions, getPreviewDimensions, getViewportDimensions } from './config/devices.js';
import type { ScreenshotDefinition, ScreenshotGeneratorConfig } from './config/types.js';
import { resolveFixtureRequest } from './capture/fixtures.js';
import { filterDefinitions, parseCli } from './index.js';
import { finalOutputPath, optimizedWebpPath, OUTPUT_ROOT, sanitizeFilePart } from './export/paths.js';
import { getDeviceChromeMetrics, MarketingRenderer } from './render/renderer.js';
import { getTemplateLayout } from './render/templates.js';
import { validateConfig, validateRenderedOutputs } from './validation/validate.js';

describe('configuration', () => {
  it('accepts the committed configuration', () => {
    expect(() => validateConfig(screenshotConfig)).not.toThrow();
  });

  it('expands every curated scene into both locales and themes', () => {
    expect(screenshotConfig.screenshots).toHaveLength(120);
    const variants = screenshotConfig.screenshots.filter((definition) =>
      definition.id.startsWith('dashboard-calendar-')
    );
    expect(variants.map(({ locale, theme }) => `${locale}:${theme}`).sort()).toEqual([
      'en-US:dark',
      'en-US:light',
      'he:dark',
      'he:light'
    ]);

    const mixedDevice = screenshotConfig.screenshots.find(
      (definition) => definition.id === 'cross-device-project-review-en-us-dark'
    );
    expect(mixedDevice?.template).toBe('dual');
    if (mixedDevice?.template === 'dual') {
      expect(mixedDevice.device).toBe('desktop-1440');
      expect(mixedDevice.secondaryDevice).toBe('iphone-6.9');
      expect(mixedDevice.sources).toHaveLength(2);
    }

    const landingAsset = screenshotConfig.screenshots.find(
      (definition) => definition.id === 'landing-booking-flow-he-light'
    );
    expect(landingAsset?.template).toBe('product');
    expect(landingAsset?.publish?.path).toBe(
      'public/images/landing-generated/he/light/landing-booking-flow.webp'
    );
  });

  it('rejects duplicate screenshot ids', () => {
    const config = structuredClone(screenshotConfig) as ScreenshotGeneratorConfig;
    config.screenshots.push({ ...config.screenshots[0], outputFilename: 'duplicate.png' });
    expect(() => validateConfig(config)).toThrow(/Duplicate screenshot id/);
  });

  it('rejects unknown capture references', () => {
    const config = structuredClone(screenshotConfig) as ScreenshotGeneratorConfig;
    const first = config.screenshots[0];
    if (first.template !== 'dual') first.source = 'missing';
    expect(() => validateConfig(config)).toThrow(/unknown capture/i);
  });
});

describe('device and layout specifications', () => {
  it('keeps App Store device dimensions centralized', () => {
    expect(getOutputDimensions(DEVICE_SPECS['iphone-6.9'])).toEqual({ width: 1320, height: 2868 });
    expect(getOutputDimensions(DEVICE_SPECS['iphone-6.9'], 'landscape')).toEqual({ width: 2868, height: 1320 });
    expect(getViewportDimensions(DEVICE_SPECS['ipad-13'])).toEqual({ width: 1032, height: 1376 });
    expect(getPreviewDimensions({ width: 1320, height: 2868 })).toEqual({ width: 660, height: 1434 });
  });

  it.each(['hero', 'feature', 'dual', 'full-bleed', 'minimal', 'product'] as const)(
    'resolves the %s template',
    (template) => {
      expect(getTemplateLayout(template).id).toBe(template);
    }
  );

  it('uses edge-to-edge phone screens while reserving desktop chrome', () => {
    expect(getDeviceChromeMetrics('iphone-6.9').chromeHeight).toBe(0);
    expect(getDeviceChromeMetrics('iphone-6.9').frameRatio).toBeCloseTo(440 / 956);
    expect(getDeviceChromeMetrics('desktop-1440').chromeHeightPercent).toBeGreaterThan(5.2);
    expect(getDeviceChromeMetrics('ipad-13').chromeHeight).toBeGreaterThan(0);
  });
});

describe('CLI and filenames', () => {
  it('parses selective generation filters', () => {
    const result = parseCli([
      'generate',
      '--preview',
      '--only',
      'studio-details-en-us-dark,dashboard-calendar-he-light',
      '--locale',
      'en-US',
      '--theme',
      'dark',
      '--template',
      'full-bleed'
    ]);
    expect(result.preview).toBe(true);
    expect(result.filters.only).toEqual(new Set(['studio-details-en-us-dark', 'dashboard-calendar-he-light']));
    expect(result.filters.locale).toBe('en-US');
    expect(result.filters.theme).toBe('dark');
    expect(result.filters.template).toBe('full-bleed');
  });

  it('filters screenshot definitions without changing config', () => {
    const filtered = filterDefinitions(screenshotConfig.screenshots, {
      only: new Set(),
      locale: 'he',
      theme: 'light'
    });
    expect(filtered).toHaveLength(30);
    expect(filtered.every((definition) => definition.locale === 'he' && definition.theme === 'light')).toBe(true);
  });

  it('normalizes safe filenames and rejects empty names', () => {
    expect(sanitizeFilePart('Studio Details 01')).toBe('studio-details-01');
    expect(() => sanitizeFilePart('***')).toThrow();
  });
});

describe('fixture routing', () => {
  it('includes authenticated vendor captures', () => {
    const authenticated = screenshotConfig.captures.filter((capture) => capture.auth === 'vendor');
    expect(authenticated).toHaveLength(112);
    expect(authenticated.every((capture) => capture.id.includes(capture.theme))).toBe(true);
  });

  it('returns deterministic studio data without a live API', () => {
    const scenario = screenshotConfig.captures.find((capture) => capture.id === 'studio-details-en-us-dark');
    expect(scenario).toBeDefined();
    const response = resolveFixtureRequest('GET', 'http://localhost:3003/api/studios/studio-demo', scenario!);
    expect(response?.status).toBe(200);
    expect(response?.body).toMatchObject({
      currStudio: { _id: 'studio-demo', city: 'Tel Aviv' }
    });
  });

  it('returns null for an unhandled endpoint so capture fails loudly', () => {
    const scenario = screenshotConfig.captures[0];
    expect(resolveFixtureRequest('GET', 'http://localhost:3003/api/unknown', scenario)).toBeNull();
  });
});

describe('renderer integration', () => {
  const renderer = new MarketingRenderer();
  const rawPath = join(OUTPUT_ROOT, 'test-fixtures', 'raw.png');

  afterAll(async () => {
    await renderer.close();
    await rm(join(OUTPUT_ROOT, 'test-fixtures'), { recursive: true, force: true });
    await rm(join(OUTPUT_ROOT, 'ios', 'en-US', 'dark', '01-renderer-test.png'), { force: true });
    await rm(join(OUTPUT_ROOT, 'ios', 'en-US', 'dark', '01-renderer-test.webp'), { force: true });
  });

  it('renders and validates exact-size PNG and optimized WebP assets', async () => {
    await mkdir(join(OUTPUT_ROOT, 'test-fixtures'), { recursive: true });
    await sharp({
      create: {
        width: 440,
        height: 956,
        channels: 3,
        background: '#17202a'
      }
    })
      .png()
      .toFile(rawPath);

    const definition: ScreenshotDefinition = {
      id: 'renderer-test',
      order: 1,
      title: 'Deterministic screenshots',
      subtitle: 'Rendered locally',
      source: 'owner-home',
      template: 'hero',
      device: 'iphone-6.9',
      locale: 'en-US',
      theme: 'dark',
      background: { type: 'solid', value: '#0a0d12' },
      outputDimensions: { width: 400, height: 800 },
      outputFilename: '01-renderer-test.png',
      deviceTransform: { scale: 0.35, y: 90, shadow: false }
    };

    const diagnostics = await renderer.render(definition, [rawPath], false);
    expect(diagnostics.titleOverflow).toBe(false);
    expect(finalOutputPath(definition, false)).toContain('01-renderer-test.png');
    await expect(sharp(optimizedWebpPath(finalOutputPath(definition, false))).metadata()).resolves.toMatchObject({
      format: 'webp',
      width: 400,
      height: 800
    });
    await expect(validateRenderedOutputs([definition], false)).resolves.toBeUndefined();
  });
});
