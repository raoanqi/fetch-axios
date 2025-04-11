import { FetchRequest, DEFAULT_OPTIONS } from './core/request';
import { HttpMethod, RequestOptions, ResponseType, RequestInstance } from './types';
import { setupNodeFetch } from './adapters/node-adapter';
import * as helpers from './utils/helpers';

// 尝试设置Node环境适配
try {
  // 在顶层执行setupNodeFetch的异步函数
  // 注意: 在实际生产环境中，可能需要先等待setupNodeFetch完成再进行操作
  setupNodeFetch().catch(e => {
    console.warn('设置Node.js环境的fetch适配器失败，但这不会影响浏览器环境：', e);
  });
} catch (error) {
  console.warn('设置Node.js环境的fetch适配器失败，但这不会影响浏览器环境', error);
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

// 默认导出
export default {
  request,
  get,
  post,
  put,
  delete: del,
  patch,
  create,
  createCancelToken,
  HttpMethod,
  ResponseType
};
