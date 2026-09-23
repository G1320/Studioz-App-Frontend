import { mkdir, rename, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import type { CaptureScenario, DeviceId, LocaleId, ScreenshotDefinition } from '../config/types.js';
import { DEVICE_SPECS } from '../config/devices.js';

export const TOOL_ROOT = resolve(process.cwd(), 'tools/app-store-screenshots');
export const OUTPUT_ROOT = join(TOOL_ROOT, 'output');

export function sanitizeFilePart(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!normalized) throw new Error(`"${value}" cannot be converted to a valid filename.`);
  return normalized;
}

export function rawCapturePath(scenario: CaptureScenario): string {
  return join(OUTPUT_ROOT, 'raw', scenario.locale, scenario.viewportDevice, `${sanitizeFilePart(scenario.id)}.png`);
}

export function finalOutputPath(definition: ScreenshotDefinition, preview: boolean): string {
  const filename =
    definition.outputFilename || `${String(definition.order).padStart(2, '0')}-${sanitizeFilePart(definition.id)}.png`;
  if (!filename.endsWith('.png')) throw new Error(`Output filename must end in .png: ${filename}`);

  if (preview) {
    return join(OUTPUT_ROOT, 'previews', definition.locale, definition.theme, definition.device, filename);
  }

  const family = DEVICE_SPECS[definition.device].family;
  const channel = family === 'desktop' ? join('web', 'desktop') : 'ios';
  return join(OUTPUT_ROOT, channel, definition.locale, definition.theme, filename);
}

export function optimizedWebpPath(pngPath: string): string {
  if (!pngPath.endsWith('.png')) throw new Error(`WebP source path must end in .png: ${pngPath}`);
  return `${pngPath.slice(0, -4)}.webp`;
}

export function captureLookupKey(id: string, locale: LocaleId, device: DeviceId): string {
  return `${id}:${locale}:${device}`;
}

export async function ensureParent(path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
}

export async function atomicReplace(tempPath: string, destinationPath: string): Promise<void> {
  await ensureParent(destinationPath);
  await rm(destinationPath, { force: true });
  await rename(tempPath, destinationPath);
}

export async function resetRenderedOutput(preview: boolean): Promise<void> {
  const paths = preview
    ? [join(OUTPUT_ROOT, 'previews')]
    : [join(OUTPUT_ROOT, 'ios'), join(OUTPUT_ROOT, 'web'), join(OUTPUT_ROOT, 'manifest.json')];
  await Promise.all(paths.map((path) => rm(path, { recursive: true, force: true })));
}

export async function resetRawOutput(): Promise<void> {
  await rm(join(OUTPUT_ROOT, 'raw'), { recursive: true, force: true });
}

export function temporaryPath(destinationPath: string): string {
  return `${destinationPath}.tmp`;
}
