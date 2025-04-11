import { HttpMethod, RequestInstance, RequestOptions, ResponseType } from '../types';
import { buildURL, deepMerge, isBrowser, timeout } from '../utils/helpers';

/**
 * 默认配置
 */
export const DEFAULT_OPTIONS: RequestOptions = {
  baseURL: '',
  method: HttpMethod.GET,
  headers: {
    'Content-Type': 'application/json'
  },
  responseType: ResponseType.JSON,
  timeout: 10000,
  withCredentials: false
};

/**
 * 请求类
 */
export class FetchRequest implements RequestInstance {
  private defaultOptions: RequestOptions;

  /**
   * 构造函数
   */
  constructor(options: RequestOptions = {}) {
    this.defaultOptions = deepMerge({}, DEFAULT_OPTIONS, options);
  }

  /**
   * 创建新实例
   */
  create(options: RequestOptions = {}): FetchRequest {
    return new FetchRequest(options);
  }

  /**
   * 创建取消令牌
   */
  createCancelToken(): AbortController {
    return new AbortController();
  }

  /**
   * 通用请求方法
   */
  async request<T = any>(options: RequestOptions): Promise<T> {
    // 合并选项
    const mergedOptions: RequestOptions = deepMerge({}, this.defaultOptions, options);
    let {
      baseURL,
      url,
      method = HttpMethod.GET,
      headers = {},
      params,
      data,
      responseType = ResponseType.JSON,
      timeout: timeoutMs,
      withCredentials,
      cancelToken,
      requestInterceptor,
      responseInterceptor,
      errorInterceptor,
      paramsSerializer,
      ...fetchOptions
    } = mergedOptions;

    // 应用请求拦截器
    if (requestInterceptor) {
      try {
        const interceptedOptions = await requestInterceptor(mergedOptions);
        ({
          baseURL,
          url,
          method = HttpMethod.GET,
          headers = {},
          params,
          data,
          responseType = ResponseType.JSON,
          timeout: timeoutMs,
          withCredentials,
          cancelToken,
          requestInterceptor,
          responseInterceptor,
          errorInterceptor,
          paramsSerializer,
          ...fetchOptions
        } = interceptedOptions);
      } catch (error) {
        return Promise.reject(errorInterceptor ? errorInterceptor(error) : error);
      }
    }

    // 构建完整URL
    if (!url) {
      throw new Error('URL is required');
    }
    const fullURL = buildURL(url, baseURL, params, paramsSerializer);

    // 处理请求体
    let body: any = undefined;
    if (data !== undefined) {
      if (
        ['POST', 'PUT', 'PATCH'].includes(method) &&
        headers['Content-Type'] === 'application/json'
      ) {
        body = JSON.stringify(data);
      } else if (data instanceof FormData) {
        body = data;
        // 让浏览器自动设置Content-Type和boundary
        delete headers['Content-Type'];
      } else {
        body = data;
      }
    }

    // 设置凭证选项
    if (withCredentials && isBrowser()) {
      fetchOptions.credentials = 'include';
    }

    // 设置信号
    if (cancelToken) {
      fetchOptions.signal = cancelToken.signal;
    }

    // 构建请求选项
    const requestInit: RequestInit = {
      method,
      headers,
      body,
      ...fetchOptions
    };

    try {
      // 请求超时处理
      let fetchPromise = fetch(fullURL, requestInit);
      if (timeoutMs && timeoutMs > 0) {
        fetchPromise = Promise.race([fetchPromise, timeout(timeoutMs)]);
      }

      // 发送请求
      const response = await fetchPromise;

      // 处理响应
      let result: any;

      // 处理HTTP错误状态
      if (!response.ok) {
        const error = new Error(`Request failed with status ${response.status}`);
        Object.assign(error, { response, status: response.status });
        throw error;
      }

      // 解析响应
      switch (responseType) {
        case ResponseType.JSON:
          result = await response.json();
          break;
        case ResponseType.TEXT:
          result = await response.text();
          break;
        case ResponseType.BLOB:
          result = await response.blob();
          break;
        case ResponseType.ARRAY_BUFFER:
          result = await response.arrayBuffer();
          break;
        case ResponseType.FORM_DATA:
          result = await response.formData();
          break;
        default:
          result = await response.json();
      }

      // 应用响应拦截器
      if (responseInterceptor) {
        return responseInterceptor(result);
      }

      return result;
    } catch (error) {
      // 处理错误
      if (errorInterceptor) {
        return Promise.reject(errorInterceptor(error));
      }
      return Promise.reject(error);
    }
  }

  /**
   * GET请求
   */
  get<T = any>(url: string, options?: Omit<RequestOptions, 'method' | 'url'>): Promise<T> {
    return this.request<T>({
      ...options,
      url,
      method: HttpMethod.GET
    });
  }

  /**
   * POST请求
   */
  post<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'url' | 'data'>
  ): Promise<T> {
    return this.request<T>({
      ...options,
      url,
      method: HttpMethod.POST,
      data
    });
  }

  /**
   * PUT请求
   */
  put<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'url' | 'data'>
  ): Promise<T> {
    return this.request<T>({
      ...options,
      url,
      method: HttpMethod.PUT,
      data
    });
  }

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, options?: Omit<RequestOptions, 'method' | 'url'>): Promise<T> {
    return this.request<T>({
      ...options,
      url,
      method: HttpMethod.DELETE
    });
  }

  /**
   * PATCH请求
   */
  patch<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'url' | 'data'>
  ): Promise<T> {
    return this.request<T>({
      ...options,
      url,
      method: HttpMethod.PATCH,
      data
    });
  }
}
