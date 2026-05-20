import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  // `react()` is cast to `any` because @vitejs/plugin-react resolves `vite` from
  // the top-level install, while vitest brings its own pinned `vite` copy under
  // node_modules/vitest/node_modules/vite. The two `Plugin<>` types are
  // structurally identical but nominally distinct, so TS reports a peer
  // mismatch. Runtime behavior is unaffected.
  plugins: [react() as any],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
