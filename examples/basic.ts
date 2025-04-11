/**
 * Fetch-Axios 基本使用示例
 */
import { get, post, create, HttpMethod, createCancelToken } from '../src';

// 基本GET请求
async function basicGet() {
  try {
    const response = await get('https://jsonplaceholder.typicode.com/posts/1');
    console.log('基本GET请求结果:', response);
  } catch (error) {
    console.error('GET请求错误:', error);
  }
}

// 带参数的GET请求
async function getWithParams() {
  try {
    const response = await get('https://jsonplaceholder.typicode.com/posts', {
      params: { userId: 1 }
    });
    console.log('带参数的GET请求结果:', response);
  } catch (error) {
    console.error('GET请求错误:', error);
  }
}

// 基本POST请求
async function basicPost() {
  try {
    const response = await post('https://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1
    });
    console.log('POST请求结果:', response);
  } catch (error) {
    console.error('POST请求错误:', error);
  }
}

// 创建自定义实例
async function customInstance() {
  const api = create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
      'X-Custom-Header': 'fetch-axios'
    }
  });

  try {
    const response = await api.get('/users/1');
    console.log('自定义实例请求结果:', response);
  } catch (error) {
    console.error('自定义实例请求错误:', error);
  }
}

// 请求拦截器示例
async function interceptorExample() {
  const api = create({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  try {
    const response = await api.request({
      url: '/posts/1',
      method: HttpMethod.GET,
      requestInterceptor: config => {
        console.log('请求拦截器被调用');
        config.headers = {
          ...config.headers,
          'X-Intercepted': 'true'
        };
        return config;
      },
      responseInterceptor: response => {
        console.log('响应拦截器被调用');
        return {
          ...response,
          intercepted: true
        };
      }
    });
    console.log('拦截器示例请求结果:', response);
  } catch (error) {
    console.error('拦截器示例请求错误:', error);
  }
}

// 请求取消示例
async function cancelExample() {
  const cancelToken = createCancelToken();

  // 500ms后取消请求
  setTimeout(() => {
    console.log('请求被取消');
    cancelToken.abort();
  }, 500);

  try {
    const response = await get('https://jsonplaceholder.typicode.com/posts', {
      cancelToken
    });
    console.log('这条消息不应该显示，因为请求会被取消');
  } catch (error) {
    console.error('取消请求错误:', error);
  }
}

// 运行示例
async function runExamples() {
  console.log('======= 开始运行示例 =======');

  await basicGet();
  await getWithParams();
  await basicPost();
  await customInstance();
  await interceptorExample();
  await cancelExample();

  console.log('======= 示例运行完成 =======');
}

runExamples();
