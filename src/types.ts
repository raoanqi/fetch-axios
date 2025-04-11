/**
 * 请求方法枚举
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

/**
 * 响应类型枚举
 */
export enum ResponseType {
  JSON = 'json',
  TEXT = 'text',
  BLOB = 'blob',
  ARRAY_BUFFER = 'arrayBuffer',
  FORM_DATA = 'formData'
}

/**
 * 请求配置选项
 */
export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  /**
   * 请求URL
   */
  url?: string;

  /**
   * 请求基础URL
   */
  baseURL?: string;

  /**
   * 请求URL参数
   */
  params?: Record<string, any>;

  /**
   * 请求头
   */
  headers?: Record<string, string>;

  /**
   * 请求数据
   */
  data?: any;

  /**
   * 请求方法
   */
  method?: HttpMethod;

  /**
   * 响应类型
   */
  responseType?: ResponseType;

  /**
   * 请求超时时间(ms)
   */
  timeout?: number;

  /**
   * 是否携带凭证（cookies）
   */
  withCredentials?: boolean;

  /**
   * 请求拦截器
   */
  requestInterceptor?: (config: RequestOptions) => RequestOptions | Promise<RequestOptions>;

  /**
   * 响应拦截器
   */
  responseInterceptor?: (response: any) => any | Promise<any>;

  /**
   * 错误拦截器
   */
  errorInterceptor?: (error: any) => any | Promise<any>;

  /**
   * 请求取消器
   */
  cancelToken?: AbortController;

  /**
   * URL序列化选项
   */
  paramsSerializer?: (params: Record<string, any>) => string;
}

/**
 * 请求实例接口
 */
export interface RequestInstance {
  /**
   * 发起请求
   */
  request<T = any>(options: RequestOptions): Promise<T>;

  /**
   * GET请求
   */
  get<T = any>(url: string, options?: Omit<RequestOptions, 'method' | 'url'>): Promise<T>;

  /**
   * POST请求
   */
  post<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'url' | 'data'>
  ): Promise<T>;

  /**
   * PUT请求
   */
  put<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'url' | 'data'>
  ): Promise<T>;

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, options?: Omit<RequestOptions, 'method' | 'url'>): Promise<T>;

  /**
   * PATCH请求
   */
  patch<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, 'method' | 'url' | 'data'>
  ): Promise<T>;

  /**
   * 创建请求取消器
   */
  createCancelToken(): AbortController;
}
