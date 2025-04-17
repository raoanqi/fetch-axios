import { FetchRequest, DEFAULT_OPTIONS } from './core/request';
import { HttpMethod, RequestOptions, ResponseType, RequestInstance } from './types';
import { setupNodeFetch } from './adapters/node-adapter';
import * as helpers from './utils/helpers';

// 检查是否是UMD构建或浏览器环境
const isUmdBuild =
  typeof process !== 'undefined' && process.env && process.env.IS_UMD_BUILD === 'true';
const isBrowserEnv = helpers.isBrowser();

// 只在非UMD构建和非浏览器环境中设置Node适配
if (!isUmdBuild && !isBrowserEnv) {
  try {
    // 在顶层执行setupNodeFetch的异步函数
    setupNodeFetch().catch(e => {
      // 在生产环境中抑制警告
      if (process.env.NODE_ENV !== 'production') {
        console.warn('设置Node.js环境的fetch适配器失败，但这不会影响浏览器环境：', e);
      }
    });
  } catch (error) {
    // 在生产环境中抑制警告
    if (process.env.NODE_ENV !== 'production') {
      console.warn('设置Node.js环境的fetch适配器失败，但这不会影响浏览器环境', error);
    }
  }
}

// 创建默认实例
const defaultInstance = new FetchRequest();

// 导出实例方法
export const request = defaultInstance.request.bind(defaultInstance);
export const get = defaultInstance.get.bind(defaultInstance);
export const post = defaultInstance.post.bind(defaultInstance);
export const put = defaultInstance.put.bind(defaultInstance);
export const del = defaultInstance.delete.bind(defaultInstance);
export const patch = defaultInstance.patch.bind(defaultInstance);
export const createCancelToken = defaultInstance.createCancelToken.bind(defaultInstance);

// 导出创建实例方法
export const create = (options?: RequestOptions): RequestInstance => {
  return new FetchRequest(options);
};

// 导出工具函数和类型
export { helpers, FetchRequest, DEFAULT_OPTIONS, HttpMethod, ResponseType };

// 注意：删除了默认导出，现在统一使用命名导出
// 用户可以通过以下方式导入:
// import { get, post } from '@xiaoyueqinglan/fxios';
// 或者导入所有:
// import * as FetchAxios from '@xiaoyueqinglan/fxios';
