import { RequestOptions } from '../types';

/**
 * 判断是否为浏览器环境
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

/**
 * 深度合并对象
 */
export const deepMerge = <T extends Record<string, any> = Record<string, any>>(
  target: T,
  ...sources: any[]
): T => {
  if (!sources.length) return target;

  const source = sources.shift();
  if (source === undefined) return target;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return deepMerge(target, ...sources);
};

/**
 * 判断是否为对象
 */
export const isObject = (val: unknown): val is Record<any, any> => {
  return val !== null && typeof val === 'object';
};

/**
 * 构建完整URL
 */
export const buildURL = (
  url: string,
  baseURL?: string,
  params?: Record<string, any>,
  paramsSerializer?: (params: Record<string, any>) => string
): string => {
  if (!url) return '';

  // 拼接基础URL
  let fullUrl = url;
  if (baseURL && !url.startsWith('http') && !url.startsWith('//')) {
    fullUrl = baseURL.endsWith('/')
      ? baseURL + (url.startsWith('/') ? url.slice(1) : url)
      : baseURL + (url.startsWith('/') ? url : `/${url}`);
  }

  // 没有参数直接返回
  if (!params || Object.keys(params).length === 0) return fullUrl;

  // 处理URL参数
  const serializedParams = paramsSerializer
    ? paramsSerializer(params)
    : defaultParamsSerializer(params);

  if (serializedParams) {
    fullUrl += (fullUrl.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return fullUrl;
};

/**
 * 默认URL参数序列化
 */
export const defaultParamsSerializer = (params: Record<string, any>): string => {
  const parts: string[] = [];

  Object.entries(params).forEach(([key, val]) => {
    if (val === null || typeof val === 'undefined') return;

    let values: any[];
    if (Array.isArray(val)) {
      values = val;
      key = key + '[]';
    } else {
      values = [val];
    }

    values.forEach(v => {
      if (isDate(v)) {
        v = v.toISOString();
      } else if (isObject(v)) {
        v = JSON.stringify(v);
      }
      parts.push(`${encode(key)}=${encode(v)}`);
    });
  });

  return parts.join('&');
};

/**
 * 判断是否为Date类型
 */
export const isDate = (val: unknown): val is Date => {
  return Object.prototype.toString.call(val) === '[object Date]';
};

/**
 * 编码URI组件并处理特殊字符
 */
export const encode = (val: string): string => {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
};

/**
 * 设置超时
 */
export const timeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`请求超时: ${ms}ms`));
    }, ms);
  });
};
