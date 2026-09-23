import { readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Browser, Page } from 'puppeteer';
import sharp from 'sharp';
import { launchScreenshotBrowser } from '../browser.js';
import { DEVICE_SPECS, getOutputDimensions, getPreviewDimensions } from '../config/devices.js';
import type {
  BackgroundConfig,
  DeviceId,
  DeviceTransform,
  RenderDiagnostics,
  ScreenshotDefinition,
  TypographyOverride
} from '../config/types.js';
import {
  atomicReplace,
  ensureParent,
  finalOutputPath,
  optimizedWebpPath,
  temporaryPath
} from '../export/paths.js';
import { getTemplateLayout } from './templates.js';

export class MarketingRenderer {
  private browser: Browser | null = null;

  async render(definition: ScreenshotDefinition, sourcePaths: string[], preview: boolean): Promise<RenderDiagnostics> {
    const spec = DEVICE_SPECS[definition.device];
    const productionDimensions = definition.outputDimensions || getOutputDimensions(spec, definition.orientation);
    const dimensions = preview ? getPreviewDimensions(productionDimensions) : productionDimensions;

    const expectedSources = definition.template === 'dual' ? 2 : 1;
    if (sourcePaths.length !== expectedSources) {
      throw new Error(`${definition.id} requires ${expectedSources} raw source(s), received ${sourcePaths.length}.`);
    }

    const sourceDataUrls = await Promise.all(sourcePaths.map(readPngDataUrl));
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    const destination = finalOutputPath(definition, preview);
    const webpDestination = optimizedWebpPath(destination);
    const browserTemp = `${destination}.browser.png`;
    const normalizedTemp = temporaryPath(destination);
    const webpTemp = temporaryPath(webpDestination);

    try {
      await page.setViewport({ width: dimensions.width, height: dimensions.height, deviceScaleFactor: 1 });
      const fontCss = await createFontCss();
      const html = createDocument(definition, sourceDataUrls, dimensions, fontCss);
      await page.setContent(html, { waitUntil: 'load' });
      await prepareRender(page);

      const diagnostics = await collectDiagnostics(page, destination);
      if (diagnostics.titleOverflow || diagnostics.subtitleOverflow) {
        const fields = [
          diagnostics.titleOverflow ? `title at ${diagnostics.titleFontSize}px` : '',
          diagnostics.subtitleOverflow ? `subtitle at ${diagnostics.subtitleFontSize}px` : ''
        ].filter(Boolean);
        throw new Error(`Text overflow in ${definition.id}: ${fields.join(', ')}. Shorten copy or lower minFontSize.`);
      }

      await ensureParent(browserTemp);
      await rm(browserTemp, { force: true });
      await rm(normalizedTemp, { force: true });
      await page.screenshot({ path: browserTemp, type: 'png', omitBackground: false, captureBeyondViewport: false });
      await sharp(browserTemp)
        .flatten({ background: '#000000' })
        .toColourspace('srgb')
        .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
        .toFile(normalizedTemp);
      await atomicReplace(normalizedTemp, destination);
      await rm(webpTemp, { force: true });
      await sharp(destination)
        .toColourspace('srgb')
        .webp({ quality: 86, effort: 4, smartSubsample: true })
        .toFile(webpTemp);
      await atomicReplace(webpTemp, webpDestination);
      await rm(browserTemp, { force: true });
      return diagnostics;
    } finally {
      await page.close();
      await rm(browserTemp, { force: true }).catch(() => undefined);
      await rm(normalizedTemp, { force: true }).catch(() => undefined);
      await rm(webpTemp, { force: true }).catch(() => undefined);
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async getBrowser(): Promise<Browser> {
    if (this.browser) return this.browser;
    this.browser = await launchScreenshotBrowser();
    return this.browser;
  }
}

async function readPngDataUrl(path: string): Promise<string> {
  const buffer = await readFile(path).catch(() => {
    throw new Error(`Raw screenshot is missing: ${path}. Run capture first or remove --skip-capture.`);
  });
  await sharp(buffer)
    .metadata()
    .catch(() => {
      throw new Error(`Raw screenshot is corrupt or unsupported: ${path}`);
    });
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

async function createFontCss(): Promise<string> {
  const fontFiles = [
    {
      family: 'Studioz Display',
      weight: 700,
      path: resolve(process.cwd(), 'node_modules/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2')
    },
    {
      family: 'Studioz Body',
      weight: 400,
      path: resolve(process.cwd(), 'node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2')
    },
    {
      family: 'Studioz Hebrew',
      weight: 700,
      path: resolve(
        process.cwd(),
        'node_modules/@fontsource/noto-sans-hebrew/files/noto-sans-hebrew-hebrew-700-normal.woff2'
      )
    }
  ];

  return (
    await Promise.all(
      fontFiles.map(async (font) => {
        const data = await readFile(font.path).catch(() => {
          throw new Error(`Required local font is unavailable: ${font.path}. Run npm install.`);
        });
        return `@font-face{font-family:"${font.family}";font-style:normal;font-weight:${font.weight};font-display:block;src:url(data:font/woff2;base64,${data.toString('base64')}) format("woff2");}`;
      })
    )
  ).join('\n');
}

function createDocument(
  definition: ScreenshotDefinition,
  sources: string[],
  dimensions: { width: number; height: number },
  fontCss: string
): string {
  const spec = DEVICE_SPECS[definition.device];
  const layout = getTemplateLayout(definition.template);
  const direction = definition.locale === 'he' ? 'rtl' : 'ltr';
  const productionDimensions = definition.outputDimensions || getOutputDimensions(spec, definition.orientation);
  const canvasScale = dimensions.width / productionDimensions.width;
  const safe = {
    ...spec.safeArea,
    ...definition.safeArea
  };
  const title = typography(definition.titleTypography, {
    fontFamily: 'display',
    fontSize: Math.round(dimensions.width * layout.titleSize),
    minFontSize: Math.round(dimensions.width * 0.045),
    lineHeight: 0.98,
    weight: 700,
    color: '#f7f7f5',
    maxWidth: Math.round(dimensions.width * layout.textWidth)
  });
  const subtitle = typography(definition.subtitleTypography, {
    fontFamily: 'body',
    fontSize: Math.round(dimensions.width * layout.subtitleSize),
    minFontSize: Math.round(dimensions.width * 0.022),
    lineHeight: 1.25,
    weight: 400,
    color: '#c9c9c3',
    maxWidth: Math.round(dimensions.width * Math.min(layout.textWidth, 0.78))
  });
  const frameOne = deviceMarkup(definition, sources[0]!, definition.deviceTransform || {}, 1, dimensions, canvasScale);
  const frameTwo =
    definition.template === 'dual'
      ? deviceMarkup(
          definition,
          sources[1]!,
          definition.secondaryDeviceTransform || {},
          2,
          dimensions,
          canvasScale,
          definition.secondaryDevice
        )
      : '';
  const treatment = definition.screenTreatment || {};
  const screenFilter = `brightness(${treatment.brightness ?? 1}) contrast(${treatment.contrast ?? 1}) saturate(${treatment.saturation ?? 1})`;

  return `<!doctype html>
<html lang="${definition.locale}" dir="${direction}">
<head><meta charset="utf-8"><style>
${fontCss}
*{box-sizing:border-box}
html,body{margin:0;width:${dimensions.width}px;height:${dimensions.height}px;overflow:hidden}
body{font-family:"Studioz Body",sans-serif;background:${backgroundCss(definition.background)};color:#f7f7f5}
.canvas{position:relative;isolation:isolate;width:100%;height:100%;overflow:hidden}
.canvas::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(140deg,rgba(255,255,255,.08),transparent 32%,rgba(0,0,0,.08));mix-blend-mode:soft-light}
.copy{position:absolute;z-index:5;top:${Math.round(dimensions.height * layout.textTop)}px;left:50%;width:calc(100% - ${Math.round((safe.left + safe.right) * canvasScale)}px);max-width:${title.maxWidth}px;transform:translateX(-50%);text-align:${definition.textAlign || 'center'};direction:${direction}}
.template-feature .copy{text-align:${definition.textAlign || 'start'}}
.title{margin:0 auto;font-family:${fontFamily(title.fontFamily, direction, true)};font-size:${title.fontSize}px;min-font-size:${title.minFontSize}px;font-weight:${title.weight};line-height:${title.lineHeight};letter-spacing:-.045em;color:${title.color};max-width:${title.maxWidth}px;text-wrap:balance;overflow-wrap:anywhere}
.subtitle{margin:${Math.round(dimensions.height * 0.018)}px auto 0;font-family:${fontFamily(subtitle.fontFamily, direction, false)};font-size:${subtitle.fontSize}px;min-font-size:${subtitle.minFontSize}px;font-weight:${subtitle.weight};line-height:${subtitle.lineHeight};letter-spacing:-.012em;color:${subtitle.color};max-width:${subtitle.maxWidth}px;text-wrap:balance;overflow-wrap:anywhere}
[dir="rtl"] .title,[dir="rtl"] .subtitle{letter-spacing:0}
.device-slot{position:absolute;z-index:3;top:${Math.round(dimensions.height * layout.deviceTop)}px;left:50%;transform:translate(calc(-50% + var(--x)),var(--y)) rotate(var(--rotation));transform-origin:50% 50%;perspective:var(--perspective)}
.device{position:relative;width:calc(var(--base-width) * var(--scale));aspect-ratio:var(--frame-ratio);padding:calc(var(--base-width) * var(--scale) * .018);border-radius:calc(var(--base-width) * var(--scale) * .105);background:linear-gradient(145deg,#303236,#090a0c 58%,#26282b);box-shadow:var(--device-shadow)}
.device.tablet{border-radius:calc(var(--base-width) * var(--scale) * .045);padding:calc(var(--base-width) * var(--scale) * .012)}
.device.desktop{border-radius:calc(var(--base-width) * var(--scale) * .016);padding:calc(var(--base-width) * var(--scale) * .008);background:#24272c}
.screen{position:relative;width:100%;height:100%;overflow:hidden;border-radius:inherit;background:#0b0e12;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
.screen-viewport{position:absolute;z-index:1;top:var(--chrome-height);right:0;bottom:0;left:0;overflow:hidden;background:#0b0e12}
.screen img{display:block;width:100%;height:100%;object-fit:cover;object-position:${escapeHtml(definition.crop?.objectPosition || 'center top')};filter:${screenFilter}}
.island{position:absolute;z-index:4;top:2.3%;left:50%;width:30%;height:3.8%;transform:translateX(-50%);border-radius:999px;background:#020203;box-shadow:inset 0 -1px 2px rgba(255,255,255,.08)}
.desktop-bar{position:absolute;z-index:4;top:0;left:0;right:0;height:5.2%;display:flex;align-items:center;gap:1.2%;padding:0 1.5%;direction:ltr;background:rgba(22,24,28,.96);border-bottom:1px solid rgba(255,255,255,.08)}
.desktop-bar i{display:block;width:1.15%;aspect-ratio:1;border-radius:50%;background:#ff675f}.desktop-bar i:nth-child(2){background:#ffbd44}.desktop-bar i:nth-child(3){background:#2acb55}
.template-dual .device-slot.slot-1{left:42%}.template-dual .device-slot.slot-2{left:58%}
.template-full-bleed .device-slot{top:${Math.round(dimensions.height * 0.3)}px}
.template-minimal .device-slot{top:${Math.round(dimensions.height * 0.28)}px}
.template-product .copy{display:none}
.template-product .device-slot{top:50%;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) rotate(var(--rotation))}
</style></head>
<body>
<main class="canvas template-${definition.template}">
  <section class="copy">
    <h1 class="title" data-fit-text data-min-size="${title.minFontSize}">${escapeHtml(definition.title)}</h1>
    ${definition.subtitle ? `<p class="subtitle" data-fit-text data-min-size="${subtitle.minFontSize}">${escapeHtml(definition.subtitle)}</p>` : ''}
  </section>
  ${frameOne}${frameTwo}
</main>
</body></html>`;
}

function deviceMarkup(
  definition: ScreenshotDefinition,
  source: string,
  transform: DeviceTransform,
  slot: number,
  dimensions: { width: number; height: number },
  canvasScale: number,
  deviceOverride?: ScreenshotDefinition['device']
): string {
  const device = deviceOverride || definition.device;
  const spec = DEVICE_SPECS[device];
  const family = spec.family;
  const baseWidth = Math.round(dimensions.width * (family === 'desktop' ? 0.9 : family === 'tablet' ? 0.78 : 0.74));
  const { frameRatio, chromeHeightPercent } = getDeviceChromeMetrics(device);
  const shadow = transform.shadow === false ? 'none' : '0 80px 160px rgba(0,0,0,.42),0 18px 50px rgba(0,0,0,.24)';
  const island = spec.hasDynamicIsland ? '<span class="island"></span>' : '';
  const desktopBar =
    family === 'desktop' ? '<span class="desktop-bar" aria-hidden="true"><i></i><i></i><i></i></span>' : '';
  return `<div class="device-slot slot-${slot}" style="--x:${Math.round((transform.x || 0) * canvasScale)}px;--y:${Math.round((transform.y || 0) * canvasScale)}px;--rotation:${transform.rotation || 0}deg;--perspective:${Math.round((transform.perspective || 1200) * canvasScale)}px">
    <div class="device ${family}" style="--base-width:${baseWidth}px;--scale:${transform.scale ?? 0.72};--frame-ratio:${frameRatio};--chrome-height:${chromeHeightPercent}%;--device-shadow:${shadow}">
      <div class="screen">${desktopBar}${island}<div class="screen-viewport"><img src="${source}" alt=""></div></div>
    </div>
  </div>`;
}

export function getDeviceChromeMetrics(device: DeviceId): {
  chromeHeight: number;
  chromeHeightPercent: number;
  frameRatio: number;
} {
  const spec = DEVICE_SPECS[device];
  const chromeHeight = spec.family === 'desktop' ? 52 : spec.family === 'tablet' ? 34 : 68;
  const framedHeight = spec.viewport.height + chromeHeight;
  return {
    chromeHeight,
    chromeHeightPercent: (chromeHeight / framedHeight) * 100,
    frameRatio: spec.viewport.width / framedHeight
  };
}

function backgroundCss(background: BackgroundConfig): string {
  if (background.type === 'solid') return background.value;
  if (background.type === 'gradient') {
    return `linear-gradient(${background.angle ?? 145}deg,${background.from},${background.to})`;
  }
  return `radial-gradient(circle at ${background.origin || '50% 35%'},${background.inner},${background.outer} 72%)`;
}

function typography(
  override: TypographyOverride | undefined,
  defaults: Required<TypographyOverride>
): Required<TypographyOverride> {
  return { ...defaults, ...override };
}

function fontFamily(font: TypographyOverride['fontFamily'], direction: string, display: boolean): string {
  if (font === 'hebrew' || direction === 'rtl') return '"Studioz Hebrew",sans-serif';
  if (font === 'body' || !display) return '"Studioz Body",sans-serif';
  return '"Studioz Display",sans-serif';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function prepareRender(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(Array.from(document.images).map((image) => image.decode()));
    document.querySelectorAll<HTMLElement>('[data-fit-text]').forEach((element) => {
      if (getComputedStyle(element).display === 'none' || element.closest<HTMLElement>('.copy')?.offsetParent === null) {
        element.dataset.overflow = 'false';
        return;
      }
      const minimum = Number(element.dataset.minSize || 24);
      let size = Number.parseFloat(getComputedStyle(element).fontSize);
      const maximumLines = element.classList.contains('title') ? 3 : 3;
      const overflows = () => {
        const styles = getComputedStyle(element);
        const lineHeight = Number.parseFloat(styles.lineHeight);
        const renderedLines = element.getBoundingClientRect().height / lineHeight;
        return renderedLines > maximumLines + 0.1;
      };
      while (overflows() && size > minimum) {
        size = Math.max(minimum, size - 2);
        element.style.fontSize = `${size}px`;
      }
      element.dataset.overflow = overflows() ? 'true' : 'false';
    });
  });
}

async function collectDiagnostics(page: Page, outputPath: string): Promise<RenderDiagnostics> {
  const values = await page.evaluate(() => {
    const title = document.querySelector<HTMLElement>('.title');
    const subtitle = document.querySelector<HTMLElement>('.subtitle');
    const copy = document.querySelector<HTMLElement>('.copy');
    const device = document.querySelector<HTMLElement>('.device');
    const copyIsVisible = copy ? getComputedStyle(copy).display !== 'none' : false;
    const overlapsDevice =
      copyIsVisible && copy && device
        ? copy.getBoundingClientRect().bottom > device.getBoundingClientRect().top - 12
        : false;
    return {
      titleOverflow: title?.dataset.overflow === 'true' || overlapsDevice,
      subtitleOverflow: subtitle?.dataset.overflow === 'true',
      titleFontSize: title ? Number.parseFloat(getComputedStyle(title).fontSize) : 0,
      subtitleFontSize: subtitle ? Number.parseFloat(getComputedStyle(subtitle).fontSize) : 0
    };
  });
  return { outputPath, ...values };
}
