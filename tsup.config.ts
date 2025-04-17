import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  splitting: false,
  sourcemap: process.env.NODE_ENV !== 'production',
  clean: true,
  minify: process.env.NODE_ENV === 'production',
  treeshake: true,
  globalName: 'FetchAxios',
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : format === 'iife' ? '.umd.js' : '.js'
    };
  },
  platform: 'node',
  external: ['undici', 'node:*'],
  esbuildOptions(options) {
    options.outbase = '';
  },
  outDir: 'dist',
  target: 'es2020'
});
