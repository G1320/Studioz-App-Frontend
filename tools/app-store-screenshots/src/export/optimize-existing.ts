import { readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { atomicReplace, optimizedWebpPath, OUTPUT_ROOT, temporaryPath } from './paths.js';

const RENDERED_DIRECTORIES = ['previews', 'ios', 'web'];
const WEBP_OPTIONS = { quality: 86, effort: 6, smartSubsample: true } as const;

export interface OptimizationSummary {
  files: number;
  pngBytes: number;
  webpBytes: number;
}

export async function optimizeExistingRenderedOutputs(): Promise<OptimizationSummary> {
  const pngPaths = (
    await Promise.all(RENDERED_DIRECTORIES.map((directory) => collectPngs(join(OUTPUT_ROOT, directory))))
  ).flat();

  let pngBytes = 0;
  let webpBytes = 0;

  for (let index = 0; index < pngPaths.length; index += 4) {
    const batch = pngPaths.slice(index, index + 4);
    const sizes = await Promise.all(batch.map(optimizePng));
    for (const size of sizes) {
      pngBytes += size.pngBytes;
      webpBytes += size.webpBytes;
    }
  }

  return { files: pngPaths.length, pngBytes, webpBytes };
}

async function collectPngs(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const paths = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return collectPngs(path);
      return Promise.resolve(entry.isFile() && entry.name.endsWith('.png') ? [path] : []);
    })
  );
  return paths.flat();
}

async function optimizePng(pngPath: string): Promise<{ pngBytes: number; webpBytes: number }> {
  const destination = optimizedWebpPath(pngPath);
  const temp = temporaryPath(destination);
  await rm(temp, { force: true });

  try {
    await sharp(pngPath).toColourspace('srgb').webp(WEBP_OPTIONS).toFile(temp);
    await atomicReplace(temp, destination);
  } finally {
    await rm(temp, { force: true }).catch(() => undefined);
  }

  const [pngInfo, webpInfo] = await Promise.all([stat(pngPath), stat(destination)]);
  return { pngBytes: pngInfo.size, webpBytes: webpInfo.size };
}

function formatMegabytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  optimizeExistingRenderedOutputs()
    .then(({ files, pngBytes, webpBytes }) => {
      const reduction = pngBytes > 0 ? Math.round((1 - webpBytes / pngBytes) * 100) : 0;
      console.log(
        `Optimized ${files} screenshots: ${formatMegabytes(pngBytes)} PNG → ${formatMegabytes(webpBytes)} WebP (${reduction}% smaller).`
      );
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}
