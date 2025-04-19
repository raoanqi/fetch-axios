/**
 * Node环境适配器
 *
 * 由于较新版本的Node已经内置了fetch API，
 * 这个适配器主要用于确保在Node环境中正确配置和使用fetch
 */

import { isBrowser } from '../utils/helpers';

/**
 * 确保在Node环境中可以使用全局fetch
 */
export const setupNodeFetch = async (): Promise<void> => {
  // 如果是浏览器环境或UMD构建，则不需要适配
  if (
    isBrowser() ||
    (typeof process !== 'undefined' && process.env && process.env.IS_UMD_BUILD === 'true')
  ) {
    return;
  }

  // 检查Node环境中是否存在全局fetch
  if (typeof globalThis.fetch !== 'function') {
    try {
      // 使用动态导入，确保在构建时不会打包undici
      const undiciModule = await import('undici').catch(() => null);

      if (undiciModule) {
        const { fetch, Headers, Request, Response, FormData } = undiciModule;

        // 将这些API设置为全局可用
        Object.assign(globalThis, {
          fetch: fetch || globalThis.fetch,
          Headers: Headers || globalThis.Headers,
          Request: Request || globalThis.Request,
          Response: Response || globalThis.Response,
          FormData: FormData || globalThis.FormData
        });
      } else {
        // eslint-disable-next-line no-console
        console.warn('全局fetch API不可用，请使用Node.js v18或更高版本，或手动安装polyfill');
        // eslint-disable-next-line no-console
        console.warn('对于Node.js v18以下版本，请安装: npm install undici');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('无法加载fetch polyfill:', e);
    }
  }
};
