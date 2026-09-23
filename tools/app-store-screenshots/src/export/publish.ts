import { resolve, sep } from 'node:path';
import sharp from 'sharp';
import type { ScreenshotDefinition } from '../config/types.js';
import { ensureParent } from './paths.js';

export async function publishRenderedAsset(definition: ScreenshotDefinition, sourcePath: string): Promise<string | null> {
  if (!definition.publish) return null;

  const outputPath = resolve(process.cwd(), definition.publish.path);
  const publicRoot = `${resolve(process.cwd(), 'public')}${sep}`;
  if (!outputPath.startsWith(publicRoot)) {
    throw new Error(`Published screenshot path must stay inside public/: ${definition.publish.path}`);
  }

  await ensureParent(outputPath);

  let image = sharp(sourcePath);
  if (definition.publish.dimensions) {
    image = image.resize(definition.publish.dimensions.width, definition.publish.dimensions.height, {
      fit: 'cover',
      position: 'centre'
    });
  }

  await image
    .webp({ quality: definition.publish.quality ?? 88, effort: 6 })
    .toFile(outputPath);

  return outputPath;
}
