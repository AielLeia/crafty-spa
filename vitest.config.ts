import viteConfig from './vite.config';
import { mergeConfig, defineConfig } from 'vitest/config';

export default mergeConfig(
  viteConfig as never,
  defineConfig({
    test: {
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        'src/__e2e__/**/*.e2e.test.tsx',
      ],
    },
  }) as never
);
