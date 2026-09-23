import { existsSync } from 'node:fs';
import puppeteer, { type Browser } from 'puppeteer';

const SYSTEM_BROWSER_PATHS: Partial<Record<NodeJS.Platform, string[]>> = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium'
  ],
  linux: ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'],
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ]
};

export function resolveBrowserExecutable(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    if (!existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
      throw new Error(`PUPPETEER_EXECUTABLE_PATH does not exist: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
    }
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const systemBrowser = SYSTEM_BROWSER_PATHS[process.platform]?.find((path) => existsSync(path));
  if (systemBrowser) return systemBrowser;

  try {
    const bundled = puppeteer.executablePath();
    return existsSync(bundled) ? bundled : undefined;
  } catch {
    return undefined;
  }
}

export async function launchScreenshotBrowser(): Promise<Browser> {
  const executablePath = resolveBrowserExecutable();
  if (!executablePath) {
    throw new Error(
      'Chrome/Chromium was not found. Install Puppeteer Chrome with `npx puppeteer browsers install chrome` ' +
        'or set PUPPETEER_EXECUTABLE_PATH to an installed browser.'
    );
  }

  return puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
  });
}
