import { rm } from 'node:fs/promises';
import type { Browser, HTTPRequest, KeyInput, Page } from 'puppeteer';
import { launchScreenshotBrowser } from '../browser.js';
import { DEVICE_SPECS, getViewportDimensions } from '../config/devices.js';
import type { CaptureScenario, NavigationAction } from '../config/types.js';
import { atomicReplace, ensureParent, rawCapturePath, temporaryPath } from '../export/paths.js';
import { getUserFixture, resolveFixtureRequest } from './fixtures.js';

const FIXED_TIME = '2026-09-22T09:30:00.000Z';

export interface CaptureAdapter {
  capture(scenario: CaptureScenario, baseUrl: string): Promise<string>;
  close(): Promise<void>;
}

export class WebCaptureAdapter implements CaptureAdapter {
  private browser: Browser | null = null;

  async capture(scenario: CaptureScenario, baseUrl: string): Promise<string> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    const device = DEVICE_SPECS[scenario.viewportDevice];
    const viewport = scenario.viewport || getViewportDimensions(device);
    const scale = Math.max(1, Math.round(device.output.width / viewport.width));
    const unexpectedApiRequests: string[] = [];
    const pageErrors: string[] = [];

    try {
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: scale,
        isMobile: device.family !== 'desktop',
        hasTouch: device.family !== 'desktop'
      });
      await page.emulateMediaFeatures([
        { name: 'prefers-reduced-motion', value: 'reduce' },
        { name: 'prefers-color-scheme', value: scenario.theme }
      ]);
      await seedBrowserState(page, scenario);
      await installFixtureRouting(page, scenario, baseUrl, unexpectedApiRequests);

      page.on('pageerror', (error: unknown) => pageErrors.push(error instanceof Error ? error.message : String(error)));
      page.on('console', (message) => {
        if (message.type() === 'error') pageErrors.push(message.text());
      });

      await page.goto(`${baseUrl}${scenario.route}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.addStyleTag({ content: deterministicCaptureCss(device.family !== 'desktop') });
      await page.waitForSelector(scenario.readySelector, { visible: true, timeout: 20_000 });

      const actions = scenario.actions || [];
      for (const action of actions) await runNavigationAction(page, action);
      try {
        await waitForStableUi(page, scenario.readySelector);
      } catch (error) {
        const browserContext =
          pageErrors.length > 0 ? `\nBrowser errors:\n${pageErrors.map((message) => `  - ${message}`).join('\n')}` : '';
        throw new Error(`${error instanceof Error ? error.message : String(error)}${browserContext}`);
      }
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            window.dispatchEvent(new Event('resize'));
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                if (document.querySelector('.recharts-wrapper')) {
                  window.setTimeout(resolve, 1800);
                } else {
                  resolve();
                }
              })
            );
          })
      );
      const finalScrollAction = [...actions].reverse().find((action) => action.type === 'scroll');
      if (finalScrollAction) await runNavigationAction(page, finalScrollAction);

      if (unexpectedApiRequests.length > 0) {
        throw new Error(
          `Unhandled fixture requests for "${scenario.id}":\n${unexpectedApiRequests.map((url) => `  - ${url}`).join('\n')}`
        );
      }

      const fatalErrors = pageErrors.filter(
        (message) =>
          !message.startsWith('Warning:') &&
          !message.startsWith('WebSocket connection to') &&
          !message.includes('Failed to load resource') &&
          !message.includes('ERR_FAILED') &&
          !message.includes('favicon')
      );
      if (fatalErrors.length > 0) {
        throw new Error(
          `Browser errors during "${scenario.id}":\n${fatalErrors.map((error) => `  - ${error}`).join('\n')}`
        );
      }

      const destination = rawCapturePath(scenario);
      const temp = temporaryPath(destination);
      await ensureParent(temp);
      await rm(temp, { force: true });
      await page.screenshot({
        path: temp,
        type: 'png',
        fullPage: scenario.fullPage ?? false,
        captureBeyondViewport: false,
        omitBackground: false
      });
      await atomicReplace(temp, destination);
      return destination;
    } finally {
      await page.close();
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

async function seedBrowserState(page: Page, scenario: CaptureScenario): Promise<void> {
  const user = getUserFixture(scenario.auth);
  await page.evaluateOnNewDocument(
    (seed) => {
      if (window.top === window) {
        try {
          localStorage.clear();
          sessionStorage.clear();
          localStorage.setItem('studioz-theme', seed.theme);
          localStorage.setItem('i18nextLng', seed.language);
          localStorage.setItem('REACT_QUERY_OFFLINE_CACHE', '');
          if (seed.user) localStorage.setItem('user', JSON.stringify(seed.user));
        } catch {
          // Sandboxed third-party frames may not expose web storage.
        }
      }

      let randomState = 0x12345678;
      Math.random = () => {
        randomState = (1664525 * randomState + 1013904223) >>> 0;
        return randomState / 0x100000000;
      };

      const fixedTime = new Date(seed.fixedTime).valueOf();
      const OriginalDate = Date;
      class ScreenshotDate extends OriginalDate {
        constructor(
          ...args: [] | [string | number | Date] | [number, number, number?, number?, number?, number?, number?]
        ) {
          if (args.length === 0) {
            super(fixedTime);
          } else if (args.length === 1) {
            super(args[0]);
          } else {
            super(args[0], args[1], args[2] ?? 1, args[3] ?? 0, args[4] ?? 0, args[5] ?? 0, args[6] ?? 0);
          }
        }
        static override now() {
          return fixedTime;
        }
      }
      Object.defineProperty(window, 'Date', { configurable: true, value: ScreenshotDate });
    },
    {
      theme: scenario.theme,
      language: scenario.locale === 'he' ? 'he' : 'en',
      fixedTime: FIXED_TIME,
      user
    }
  );
}

async function installFixtureRouting(
  page: Page,
  scenario: CaptureScenario,
  baseUrl: string,
  unexpectedApiRequests: string[]
): Promise<void> {
  await page.setRequestInterception(true);
  page.on('request', async (request: HTTPRequest) => {
    const url = request.url();

    if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith(baseUrl)) {
      await request.continue();
      return;
    }

    if (url.startsWith('http://localhost:3003/api') || url.startsWith('http://127.0.0.1:3003/api')) {
      if (request.method() === 'OPTIONS') {
        await request.respond({
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': baseUrl,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
            'Access-Control-Allow-Headers':
              request.headers()['access-control-request-headers'] || 'Content-Type,Authorization'
          }
        });
        return;
      }
      const fixture = resolveFixtureRequest(request.method(), url, scenario);
      if (!fixture) {
        unexpectedApiRequests.push(`${request.method()} ${url}`);
        await request.respond({
          status: 501,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': baseUrl,
            'Access-Control-Allow-Credentials': 'true'
          },
          body: JSON.stringify({ error: 'Missing screenshot fixture' })
        });
        return;
      }
      await request.respond({
        status: fixture.status,
        contentType: fixture.contentType,
        headers: {
          'Access-Control-Allow-Origin': baseUrl,
          'Access-Control-Allow-Credentials': 'true',
          'Cache-Control': 'no-store'
        },
        body: typeof fixture.body === 'string' ? fixture.body : JSON.stringify(fixture.body)
      });
      return;
    }

    await request.abort('blockedbyclient');
  });
}

async function runNavigationAction(page: Page, action: NavigationAction): Promise<void> {
  if (action.type === 'click') {
    await page.waitForSelector(action.selector, { visible: true });
    await page.click(action.selector);
    return;
  }
  if (action.type === 'style') {
    await page.addStyleTag({ content: action.css });
    return;
  }
  if (action.type === 'fill') {
    await page.waitForSelector(action.selector, { visible: true });
    await page.$eval(
      action.selector,
      (element, value) => {
        const input = element as HTMLInputElement;
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      },
      action.value
    );
    return;
  }
  if (action.type === 'press') {
    await page.keyboard.press(action.key as KeyInput);
    return;
  }
  if (action.selector) {
    await page.waitForSelector(action.selector, { visible: true });
    await page.$eval(
      action.selector,
      (element, offsetY) => {
        document.documentElement.style.transform = '';
        element.scrollIntoView({ block: 'start', inline: 'nearest' });
        if (offsetY) window.scrollBy(0, offsetY);
        // When the page already fits the viewport, scrollIntoView is a no-op.
        // Shift visually so the target sits flush at the top (avoids empty bands).
        const topPad = typeof offsetY === 'number' ? offsetY : 0;
        const rect = element.getBoundingClientRect();
        const delta = rect.top - topPad;
        if (Math.abs(delta) > 1) {
          document.documentElement.style.transform = `translate(0px, ${-delta}px)`;
        }
      },
      action.offsetY ?? 0
    );
  } else {
    // Absolute scroll. When the page fits the viewport (common for denser
    // dashboards), window.scrollTo is a no-op — fall back to a visual shift
    // so capture framing can still move down.
    await page.evaluate(({ x, y }) => {
      const left = x || 0;
      const top = y || 0;
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.transform = '';
      if (top <= maxY) {
        window.scrollTo({ left, top, behavior: 'instant' });
        return;
      }
      window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
      document.documentElement.style.transform = `translate(${-left}px, ${-top}px)`;
    }, {
      x: action.x,
      y: action.y
    });
  }
}

async function waitForStableUi(page: Page, selector: string): Promise<void> {
  await page.evaluate(async (targetSelector) => {
    await document.fonts.ready;
    const images = Array.from(document.images).filter((image) => {
      const rect = image.getBoundingClientRect();
      return rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth;
    });
    await Promise.all(
      images.map(async (image) => {
        if (image.complete) {
          if (image.naturalWidth > 0) await image.decode().catch(() => undefined);
          return;
        }
        await new Promise<void>((resolve) => {
          const timeout = window.setTimeout(resolve, 2000);
          const finish = () => {
            window.clearTimeout(timeout);
            resolve();
          };
          image.addEventListener('load', finish, { once: true });
          image.addEventListener('error', finish, { once: true });
        });
      })
    );

    let previous = '';
    let stableFrames = 0;
    for (let frame = 0; frame < 90 && stableFrames < 4; frame += 1) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const target = document.querySelector(targetSelector);
      if (!target) {
        previous = '';
        stableFrames = 0;
        continue;
      }
      const rect = target.getBoundingClientRect();
      const current = [rect.x, rect.y, rect.width, rect.height, document.documentElement.scrollHeight]
        .map((value) => Math.round(value * 10) / 10)
        .join(':');
      stableFrames = current === previous ? stableFrames + 1 : 0;
      previous = current;
    }
    if (stableFrames < 4) {
      const summary = document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 240);
      throw new Error(
        `UI did not stabilize for selector: ${targetSelector} at ${location.pathname}${location.search}. ` +
          `Visible text: ${summary || '(none)'}`
      );
    }
  }, selector);
}

function deterministicCaptureCss(hideAppHeader: boolean): string {
  return `
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-delay: 0ms !important;
      transition-duration: 0.001ms !important;
      transition-delay: 0ms !important;
      caret-color: transparent !important;
      scroll-behavior: auto !important;
    }
    html { color-scheme: light dark; }
    body { cursor: default !important; }
    #main-footer, footer.desktop-footer,
    .accessibility-widget, .accessibility-popover, .a11y-trigger, .a11y-popover, [data-testid="cookie-consent-banner"] {
      display: none !important;
    }
    ${
      hideAppHeader
        ? `
    header.app-header, .skip-links-container {
      display: none !important;
    }
    main, body:has(.landing-page) main {
      padding-top: max(3rem, env(safe-area-inset-top, 0px)) !important;
    }
    `
        : ''
    }
  `;
}
