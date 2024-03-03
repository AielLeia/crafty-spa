import viteConfig from './vite.config';
import { mergeConfig, defineConfig } from 'vitest/config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['src/__e2e__/**/*.e2e.test.tsx'],
      environment: 'jsdom',
      globals: true,
      setupFiles: 'src/__e2e__/setup.ts',
    },
  })
);
