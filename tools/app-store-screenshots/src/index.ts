import { writeFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { screenshotConfig } from '../screenshots.config.js';
import type {
  CliFilters,
  DeviceId,
  LocaleId,
  RunOptions,
  ScreenshotDefinition,
  TemplateId,
  ThemeId
} from './config/types.js';
import { WebCaptureAdapter } from './capture/web.js';
import { buildFrontend, startAppServer, type RunningAppServer } from './capture/server.js';
import { MarketingRenderer } from './render/renderer.js';
import {
  ensureParent,
  finalOutputPath,
  optimizedWebpPath,
  OUTPUT_ROOT,
  rawCapturePath,
  resetRawOutput,
  resetRenderedOutput
} from './export/paths.js';
import { publishAsset, publishRenderedAsset } from './export/publish.js';
import { validateConfig, validateRawCapture, validateRenderedOutputs } from './validation/validate.js';

async function main(): Promise<void> {
  const options = parseCli(process.argv.slice(2));
  validateConfig(screenshotConfig);
  const definitions = filterDefinitions(screenshotConfig.screenshots, options.filters);

  if (definitions.length === 0) {
    throw new Error('No screenshots match the supplied filters.');
  }

  printHeading(options.preview ? 'Studioz Screenshot Generator — Preview' : 'Studioz App Store Screenshot Generator');

  if (options.command === 'validate') {
    await validateRenderedOutputs(definitions, options.preview);
    console.log(`✓ ${definitions.length}/${definitions.length} screenshots valid`);
    return;
  }

  const captureIds = new Set(
    definitions.flatMap((definition) => (definition.template === 'dual' ? definition.sources : [definition.source]))
  );
  const scenarios = screenshotConfig.captures.filter((capture) => captureIds.has(capture.id));
  let appServer: RunningAppServer | null = null;
  const captureAdapter = new WebCaptureAdapter();
  const renderer = new MarketingRenderer();

  try {
    if (!options.skipCapture) {
      if (!hasActiveFilters(options.filters)) await resetRawOutput();
      if (!options.preview) {
        console.log('Building production app...');
        buildFrontend();
        console.log('✓ Production app built');
      }

      appServer = await startAppServer(options.preview);
      console.log(`✓ Capture server ready`);

      for (const scenario of scenarios) {
        process.stdout.write(`  Capturing ${scenario.id}... `);
        await captureAdapter.capture(scenario, appServer.baseUrl);
        await validateRawCapture(scenario);
        console.log('✓');
      }
    } else {
      console.log('Skipping capture; using existing raw screenshots.');
      for (const scenario of scenarios) await validateRawCapture(scenario);
    }

    if (!options.preview) {
      const publishedCaptures = scenarios.filter((scenario) => scenario.publish);
      if (publishedCaptures.length > 0) {
        console.log('\nPublishing raw product captures...');
        for (const scenario of publishedCaptures) {
          const publishedPath = await publishAsset(scenario.publish!, rawCapturePath(scenario));
          console.log(`✓ ${relative(process.cwd(), publishedPath)}`);
        }
      }
    }

    if (!hasActiveFilters(options.filters)) await resetRenderedOutput(options.preview);

    console.log('\nRendering marketing assets...');
    for (const definition of definitions) {
      const sourceIds = definition.template === 'dual' ? definition.sources : [definition.source];
      const sourcePaths = sourceIds.map((id) => {
        const scenario = screenshotConfig.captures.find((capture) => capture.id === id);
        if (!scenario) throw new Error(`Missing capture configuration: ${id}`);
        return rawCapturePath(scenario);
      });
      const diagnostic = await renderer.render(definition, sourcePaths, options.preview);
      console.log(`✓ ${relative(OUTPUT_ROOT, diagnostic.outputPath)}`);
      if (!options.preview && definition.publish) {
        const publishedPath = await publishRenderedAsset(definition, diagnostic.outputPath);
        if (publishedPath) console.log(`  ↳ ${relative(process.cwd(), publishedPath)}`);
      }
    }

    console.log('\nValidating...');
    await validateRenderedOutputs(definitions, options.preview);
    await writeManifest(definitions, options.preview);
    console.log(`✓ ${definitions.length}/${definitions.length} screenshots valid`);
    console.log(`\nOutput:\n${OUTPUT_ROOT}`);
  } finally {
    await captureAdapter.close();
    await renderer.close();
    await appServer?.close();
  }
}

export function parseCli(args: string[]): RunOptions {
  let command: RunOptions['command'] = 'generate';
  let preview = false;
  let skipCapture = false;
  const filters: CliFilters = { only: new Set<string>() };

  const queue = [...args];
  if (queue[0] === 'generate' || queue[0] === 'validate') command = queue.shift() as RunOptions['command'];

  while (queue.length > 0) {
    const argument = queue.shift();
    if (!argument) continue;
    if (argument === '--preview') {
      preview = true;
      continue;
    }
    if (argument === '--skip-capture') {
      skipCapture = true;
      continue;
    }

    const value = queue.shift();
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}`);

    if (argument === '--only') {
      value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((id) => filters.only.add(id));
    } else if (argument === '--locale') {
      if (value !== 'en-US' && value !== 'he') throw new Error(`Unsupported locale: ${value}`);
      filters.locale = value as LocaleId;
    } else if (argument === '--theme') {
      if (value !== 'dark' && value !== 'light') throw new Error(`Unsupported theme: ${value}`);
      filters.theme = value as ThemeId;
    } else if (argument === '--device') {
      filters.device = value as DeviceId;
    } else if (argument === '--template') {
      filters.template = value as TemplateId;
    } else if (argument === '--scenario') {
      filters.scenario = value;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }

  return { command, preview, skipCapture, filters };
}

export function filterDefinitions(definitions: ScreenshotDefinition[], filters: CliFilters): ScreenshotDefinition[] {
  return definitions.filter((definition) => {
    if (filters.only.size > 0 && !filters.only.has(definition.id)) return false;
    if (filters.locale && definition.locale !== filters.locale) return false;
    if (filters.theme && definition.theme !== filters.theme) return false;
    if (filters.device && definition.device !== filters.device) return false;
    if (filters.template && definition.template !== filters.template) return false;
    if (filters.scenario) {
      const sources = definition.template === 'dual' ? definition.sources : [definition.source];
      if (!sources.includes(filters.scenario)) return false;
    }
    return true;
  });
}

async function writeManifest(definitions: ScreenshotDefinition[], preview: boolean): Promise<void> {
  const path = preview ? `${OUTPUT_ROOT}/previews/manifest.json` : `${OUTPUT_ROOT}/manifest.json`;
  const manifest = {
    schemaVersion: 1,
    mode: preview ? 'preview' : 'production',
    files: definitions.map((definition) => ({
      id: definition.id,
      locale: definition.locale,
      theme: definition.theme,
      device: definition.device,
      template: definition.template,
      path: relative(OUTPUT_ROOT, finalOutputPath(definition, preview)),
      webpPath: relative(OUTPUT_ROOT, optimizedWebpPath(finalOutputPath(definition, preview)))
    }))
  };
  await ensureParent(path);
  await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

function printHeading(title: string): void {
  console.log(`\n${title}\n${'─'.repeat(title.length)}\n`);
}

function hasActiveFilters(filters: CliFilters): boolean {
  return (
    filters.only.size > 0 ||
    Boolean(filters.locale || filters.theme || filters.device || filters.template || filters.scenario)
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
