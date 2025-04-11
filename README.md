# Fetch-Axios

一个基于fetch实现的HTTP请求库，同时支持浏览器和Node.js环境，API风格类似Axios。

## 特性

- 💪 使用TypeScript编写，提供完整类型支持
- 🌐 同时支持浏览器和Node.js环境
- ⚡ 基于原生Fetch API，无需额外依赖
- 🧩 支持请求和响应拦截器
- ⏱️ 支持请求超时设置
- 🚫 支持请求取消
- 🔄 支持自定义实例创建

## 安装

```bash
# 使用pnpm
pnpm add fetch-axios

# 使用npm
npm install fetch-axios

# 使用yarn
yarn add fetch-axios
```

## 环境要求

- **浏览器**：支持现代浏览器，推荐使用Chrome、Firefox、Safari、Edge等最新版本
- **Node.js**：推荐使用Node.js v18+（内置fetch API）
  - 对于Node.js v18以下版本，需要安装polyfill：`pnpm add undici`

## 使用方法

### 基本使用

```typescript
import { get, post } from 'fetch-axios';

// GET请求
get('https://api.example.com/users')
  .then(response => console.log(response))
  .catch(error => console.error(error));

// POST请求
post('https://api.example.com/users', { name: 'Tom', age: 25 })
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### 创建自定义实例

```typescript
import { create, HttpMethod } from 'fetch-axios';

const api = create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    Authorization: 'Bearer token',
    'Content-Type': 'application/json'
  }
});

// 使用实例
api
  .get('/users')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### 使用请求配置

```typescript
import { request, HttpMethod, ResponseType } from 'fetch-axios';

request({
  url: '/users',
  baseURL: 'https://api.example.com',
  method: HttpMethod.GET,
  params: { page: 1, limit: 10 },
  headers: { Authorization: 'Bearer token' },
  responseType: ResponseType.JSON,
  timeout: 5000
})
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### 使用拦截器

```typescript
import { create } from 'fetch-axios';

const api = create({
  baseURL: 'https://api.example.com'
});

// 请求拦截器
api.request({
  url: '/users',
  requestInterceptor: config => {
    // 添加token
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
    return config;
  },
  // 响应拦截器
  responseInterceptor: response => {
    // 只返回data字段
    return response.data;
  },
  // 错误拦截器
  errorInterceptor: error => {
    if (error.status === 401) {
      // 处理未授权错误
      console.log('未授权，请重新登录');
    }
    return Promise.reject(error);
  }
});
```

### 取消请求

```typescript
import { request, createCancelToken } from 'fetch-axios';

const cancelToken = createCancelToken();

request({
  url: 'https://api.example.com/users',
  cancelToken
})
  .then(response => console.log(response))
  .catch(error => console.error(error));

// 取消请求
setTimeout(() => {
  cancelToken.abort('请求已取消');
}, 1000);
```

## API

### 请求方法

- `request(options)`: 通用请求方法
- `get(url, options)`: GET请求
- `post(url, data, options)`: POST请求
- `put(url, data, options)`: PUT请求
- `del(url, options)`: DELETE请求
- `patch(url, data, options)`: PATCH请求

### 工具方法

- `create(options)`: 创建自定义实例
- `createCancelToken()`: 创建取消令牌

### 类型

- `HttpMethod`: 请求方法枚举
- `ResponseType`: 响应类型枚举
- `RequestOptions`: 请求配置选项接口

## 开发

### 代码风格

本项目使用Prettier进行代码格式化，并使用Husky和lint-staged确保提交前的代码质量检查。

```bash
# 安装依赖
pnpm install

# 格式化代码
pnpm format

# 检查代码格式
pnpm lint

# 构建项目
pnpm build

# 运行示例
pnpm example
```

提交代码前，Husky将自动运行lint-staged检查和格式化代码，确保代码风格的一致性。

## 贡献

欢迎贡献代码和提出建议！详情请参阅[贡献指南](CONTRIBUTING.md)。

所有参与者需遵守我们的[行为准则](CODE_OF_CONDUCT.md)。

## 许可证

ISC
