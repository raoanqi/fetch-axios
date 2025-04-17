import { defineConfig } from 'tsup';

// 通用配置
const baseConfig = {
  entry: ['src/index.ts'],
  dts: true,
  clean: true,
  minify: process.env.NODE_ENV === 'production',
  treeshake: true,
  outDir: 'dist',
  target: 'es2020'
};

// 判断是否是生产环境
const isProd = process.env.NODE_ENV === 'production';

// 创建两个单独的构建配置
export default defineConfig([
  // ESM + CJS 构建配置 - Node.js环境
  {
    ...baseConfig,
    format: ['esm', 'cjs'],
    outExtension({ format }) {
      return {
        js: format === 'esm' ? '.mjs' : '.js'
      };
    },
    platform: 'node',
    external: ['undici', 'node:*'],
    sourcemap: !isProd,
    esbuildOptions(options) {
      options.outbase = '';
    }
  },

  // 创建单独的浏览器构建配置
  {
    entry: ['src/browser.ts'], // 使用专门的浏览器入口
    format: ['iife'],
    outExtension() {
      return { js: '.umd.js' };
    },
    dts: false, // 使用主构建的类型定义
    clean: false, // 避免清除ESM和CJS构建的文件
    minify: true,
    globalName: 'FetchAxios',
    platform: 'browser',
    treeshake: true,
    target: 'es2020',
    sourcemap: !isProd,
    define: {
      'process.env.IS_BROWSER': JSON.stringify('true'),
      'process.env.NODE_ENV': JSON.stringify('production')
    },
    // 避免引入Node相关的模块
    external: ['undici', 'node:*', 'fs', 'path', 'os', 'http', 'https', 'net', 'tls', 'dns']
  }
]);
