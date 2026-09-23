import { resolve, sep } from 'node:path';
import sharp from 'sharp';
import type { PublishedAsset, ScreenshotDefinition } from '../config/types.js';
import { ensureParent } from './paths.js';

export async function publishRenderedAsset(definition: ScreenshotDefinition, sourcePath: string): Promise<string | null> {
  if (!definition.publish) return null;
  return publishAsset(definition.publish, sourcePath);
}

export async function publishAsset(asset: PublishedAsset, sourcePath: string): Promise<string> {
  const outputPath = resolve(process.cwd(), asset.path);
  const publicRoot = `${resolve(process.cwd(), 'public')}${sep}`;
  if (!outputPath.startsWith(publicRoot)) {
    throw new Error(`Published screenshot path must stay inside public/: ${asset.path}`);
  }

  await ensureParent(outputPath);

  let image = sharp(sourcePath);
  if (asset.dimensions) {
    image = image.resize(asset.dimensions.width, asset.dimensions.height, {
      fit: 'cover',
      position: 'centre'
    });
  }

  await image
    .webp({ quality: asset.quality ?? 88, effort: 6 })
    .toFile(outputPath);

  return outputPath;
}
