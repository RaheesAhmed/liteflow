import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  splitting: true,
  treeshake: true,
  external: ['react', 'events', 'immer', 'reselect'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
});
