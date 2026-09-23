import { access } from 'node:fs/promises';
import { basename } from 'node:path';
import sharp from 'sharp';
import { z } from 'zod';
import { DEVICE_SPECS, getOutputDimensions, getPreviewDimensions } from '../config/devices.js';
import type { CaptureScenario, ScreenshotDefinition, ScreenshotGeneratorConfig } from '../config/types.js';
import { finalOutputPath, optimizedWebpPath, rawCapturePath } from '../export/paths.js';

const hexColor = z.string().regex(/^#[0-9a-f]{3,8}$/i, 'Expected a hexadecimal color');

const backgroundSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('solid'), value: hexColor }),
  z.object({ type: z.literal('gradient'), from: hexColor, to: hexColor, angle: z.number().optional() }),
  z.object({ type: z.literal('radial'), inner: hexColor, outer: hexColor, origin: z.string().optional() })
]);

const dimensionsSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive()
});

const screenshotSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/),
    order: z.number().int().positive(),
    title: z.string().min(1),
    subtitle: z.string().optional(),
    template: z.enum(['hero', 'feature', 'dual', 'full-bleed', 'minimal', 'product']),
    device: z.enum(['iphone-6.9', 'iphone-6.7', 'iphone-6.5', 'ipad-13', 'desktop-1440']),
    secondaryDevice: z.enum(['iphone-6.9', 'iphone-6.7', 'iphone-6.5', 'ipad-13', 'desktop-1440']).optional(),
    locale: z.enum(['en-US', 'he']),
    theme: z.enum(['dark', 'light']),
    background: backgroundSchema,
    source: z.string().optional(),
    sources: z.tuple([z.string(), z.string()]).optional(),
    outputFilename: z
      .string()
      .regex(/^[a-zA-Z0-9][a-zA-Z0-9_.-]*\.png$/)
      .optional(),
    outputDimensions: dimensionsSchema.optional(),
    publish: z
      .object({
        path: z.string().regex(/^public\/images\/[a-zA-Z0-9_./-]+\.webp$/),
        dimensions: dimensionsSchema.optional(),
        quality: z.number().int().min(1).max(100).optional()
      })
      .optional()
  })
  .superRefine((definition, context) => {
    if (definition.template === 'dual' && !definition.sources) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'Dual templates require exactly two sources.' });
    }
    if (definition.template === 'dual' && !definition.secondaryDevice) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'Dual templates require a secondary device.' });
    }
    if (definition.template !== 'dual' && !definition.source) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'Single-device templates require a source.' });
    }
  });

export function validateConfig(config: ScreenshotGeneratorConfig): void {
  const result = z
    .object({
      version: z.literal(1),
      captures: z.array(z.object({ id: z.string().min(1), route: z.string().startsWith('/') }).passthrough()).min(1),
      screenshots: z.array(screenshotSchema).min(1)
    })
    .safeParse(config);

  if (!result.success) {
    throw new Error(`Invalid screenshot configuration:\n${z.prettifyError(result.error)}`);
  }

  assertUnique(
    config.captures.map((capture) => capture.id),
    'capture id'
  );
  assertUnique(
    config.screenshots.map((screenshot) => screenshot.id),
    'screenshot id'
  );
  assertUnique(
    config.screenshots.map(
      (screenshot) =>
        `${screenshot.locale}:${screenshot.theme}:${screenshot.device}:${
          screenshot.outputFilename || `${screenshot.order}-${screenshot.id}.png`
        }`
    ),
    'output filename'
  );

  const captures = new Set(config.captures.map((capture) => capture.id));
  for (const screenshot of config.screenshots) {
    const sources = screenshot.template === 'dual' ? screenshot.sources : [screenshot.source];
    for (const source of sources) {
      if (!captures.has(source)) throw new Error(`${screenshot.id} references unknown capture "${source}".`);
    }
  }
}

export async function validateRawCapture(scenario: CaptureScenario): Promise<void> {
  const path = rawCapturePath(scenario);
  await validatePng(path, undefined, `raw capture "${scenario.id}"`);
}

export async function validateRenderedOutputs(definitions: ScreenshotDefinition[], preview: boolean): Promise<void> {
  const errors: string[] = [];
  for (const definition of definitions) {
    const path = finalOutputPath(definition, preview);
    const productionDimensions =
      definition.outputDimensions || getOutputDimensions(DEVICE_SPECS[definition.device], definition.orientation);
    const expected = preview ? getPreviewDimensions(productionDimensions) : productionDimensions;

    try {
      await validatePng(path, expected, definition.id);
      await validateWebp(optimizedWebpPath(path), expected, `${definition.id} optimized WebP`);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  if (errors.length > 0) throw new Error(`Screenshot validation failed:\n\n${errors.join('\n\n')}`);
}

async function validateWebp(
  path: string,
  expected: { width: number; height: number },
  label: string
): Promise<void> {
  await access(path).catch(() => {
    throw new Error(`✗ ${basename(path)}\n  Missing ${label}.`);
  });

  const metadata = await sharp(path, { failOn: 'error' }).metadata().catch((error) => {
    throw new Error(`✗ ${basename(path)}\n  Corrupt WebP: ${error instanceof Error ? error.message : String(error)}`);
  });

  if (metadata.format !== 'webp') {
    throw new Error(`✗ ${basename(path)}\n  Expected format: WebP\n  Actual: ${metadata.format || 'unknown'}`);
  }
  if (metadata.width !== expected.width || metadata.height !== expected.height) {
    throw new Error(
      `✗ ${basename(path)}\n  Expected: ${expected.width} × ${expected.height}\n  Actual:   ${metadata.width} × ${metadata.height}`
    );
  }
}

async function validatePng(
  path: string,
  expected: { width: number; height: number } | undefined,
  label: string
): Promise<void> {
  await access(path).catch(() => {
    throw new Error(`✗ ${basename(path)}\n  Missing ${label}.`);
  });

  const image = sharp(path, { failOn: 'error' });
  const metadata = await image.metadata().catch((error) => {
    throw new Error(`✗ ${basename(path)}\n  Corrupt PNG: ${error instanceof Error ? error.message : String(error)}`);
  });

  if (metadata.format !== 'png') {
    throw new Error(`✗ ${basename(path)}\n  Expected format: PNG\n  Actual: ${metadata.format || 'unknown'}`);
  }
  if (!metadata.width || !metadata.height) {
    throw new Error(`✗ ${basename(path)}\n  Image dimensions are unavailable.`);
  }
  if (metadata.width < 320 || metadata.height < 320) {
    throw new Error(`✗ ${basename(path)}\n  Resolution is too small: ${metadata.width} × ${metadata.height}`);
  }
  if (expected && (metadata.width !== expected.width || metadata.height !== expected.height)) {
    throw new Error(
      `✗ ${basename(path)}\n  Expected: ${expected.width} × ${expected.height}\n  Actual:   ${metadata.width} × ${metadata.height}`
    );
  }
  if (metadata.space && !['srgb', 'rgb'].includes(metadata.space.toLowerCase())) {
    throw new Error(`✗ ${basename(path)}\n  Expected sRGB-compatible color mode.\n  Actual: ${metadata.space}`);
  }

  if (metadata.hasAlpha) {
    const stats = await image.stats();
    const alpha = stats.channels[3];
    if (alpha && alpha.min < 255) {
      throw new Error(`✗ ${basename(path)}\n  Unexpected transparency detected.`);
    }
  }
}

function assertUnique(values: string[], label: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}
