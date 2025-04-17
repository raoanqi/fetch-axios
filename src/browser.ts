/**
 * 浏览器专用入口文件
 * 不包含任何Node.js特定代码
 */

import { FetchRequest, DEFAULT_OPTIONS } from './core/request';
import { HttpMethod, RequestOptions, ResponseType, RequestInstance } from './types';
import * as helpers from './utils/helpers';

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
