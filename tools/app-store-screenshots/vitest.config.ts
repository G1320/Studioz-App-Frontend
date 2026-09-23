import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tools/app-store-screenshots/src/**/*.test.ts'],
    testTimeout: 20_000,
    pool: 'forks',
    poolOptions: {
      forks: { singleFork: true }
    }
  }
});
