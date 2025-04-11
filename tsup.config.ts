import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  globalName: 'FetchAxios',
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : format === 'iife' ? '.umd.js' : '.js'
    };
  }
});
