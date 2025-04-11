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
  // 如果是浏览器环境，则不需要适配
  if (isBrowser()) {
    return;
  }

  // 检查Node环境中是否存在全局fetch
  if (typeof globalThis.fetch !== 'function') {
    // 如果较旧版本的Node没有内置fetch，需要使用polyfill
    console.warn('全局fetch API不可用，请使用Node.js v18或更高版本，或手动安装polyfill');
    console.warn('对于Node.js v18以下版本，请安装: pnpm add undici');

    try {
      // 尝试动态导入undici (Node 16+的推荐polyfill)
      // 使用动态导入，在ESM环境中工作
      const undici = await import('undici').catch(() => null);

      if (undici) {
        const { fetch, Headers, Request, Response, FormData } = undici;

        // 将这些API设置为全局可用
        Object.assign(globalThis, {
          fetch: fetch || globalThis.fetch,
          Headers: Headers || globalThis.Headers,
          Request: Request || globalThis.Request,
          Response: Response || globalThis.Response,
          FormData: FormData || globalThis.FormData
        });

        console.log('已通过undici设置全局fetch API');
      }
    } catch (e) {
      console.error('无法加载fetch polyfill:', e);
    }
  }
};
