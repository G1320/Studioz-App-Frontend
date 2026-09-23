import { execFileSync } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { access, readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { createServer as createViteServer, type ViteDevServer } from 'vite';

export interface RunningAppServer {
  baseUrl: string;
  close: () => Promise<void>;
}

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

export function buildFrontend(): void {
  execFileSync('npm', ['run', 'build:screenshots'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      VITE_NODE_ENV: 'development',
      VITE_ENABLE_PAYPAL: 'false',
      VITE_AUTH0_DOMAIN: process.env.VITE_AUTH0_DOMAIN || 'screenshots.invalid',
      VITE_AUTH0_CLIENT_ID: process.env.VITE_AUTH0_CLIENT_ID || 'screenshot-client'
    },
    stdio: 'inherit'
  });
}

export async function startAppServer(preview: boolean): Promise<RunningAppServer> {
  return preview ? startViteServer() : startStaticServer();
}

async function startViteServer(): Promise<RunningAppServer> {
  const server: ViteDevServer = await createViteServer({
    root: process.cwd(),
    logLevel: 'error',
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api', 'mixed-decls']
        }
      }
    },
    server: { host: '127.0.0.1', port: 0, strictPort: false }
  });
  await server.listen();

  const baseUrl = server.resolvedUrls?.local[0];
  if (!baseUrl) {
    await server.close();
    throw new Error('Vite started but did not expose a local URL.');
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    close: async () => server.close()
  };
}

async function startStaticServer(): Promise<RunningAppServer> {
  const distDir = resolve(process.cwd(), 'dist');
  await access(join(distDir, 'index.html')).catch(() => {
    throw new Error('Frontend build output is missing. Run npm run build:screenshots before capture.');
  });

  const server: Server = createServer(async (request, response) => {
    try {
      const rawPath = decodeURIComponent((request.url || '/').split('?')[0] ?? '/');
      const normalizedPath = normalize(rawPath).replace(/^(\.\.[/\\])+/, '');
      let filePath = join(distDir, normalizedPath === '/' ? 'index.html' : normalizedPath);

      if (!filePath.startsWith(distDir)) {
        response.writeHead(403).end('Forbidden');
        return;
      }

      const fileStat = await stat(filePath).catch(() => null);
      if (!fileStat?.isFile()) filePath = join(distDir, 'index.html');

      const content = await readFile(filePath);
      response.writeHead(200, {
        'Content-Type': MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      response.end(content);
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error instanceof Error ? error.message : 'Static server failure');
    }
  });

  await new Promise<void>((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolveListen());
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    server.close();
    throw new Error('Static server did not expose a TCP port.');
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolveClose, reject) => {
        server.close((error) => (error ? reject(error) : resolveClose()));
      })
  };
}
