# 贡献指南

感谢你考虑为 Fetch-Axios 项目做出贡献！这个文档将指导你如何为这个项目贡献代码。

## 开发环境设置

### 前置条件

- Node.js (推荐 v18+)
- pnpm (推荐 v7+)

### 安装步骤

1. Fork 此仓库
2. 克隆你 fork 的仓库到本地

   ```bash
   git clone https://github.com/raoanqi/fetch-axios.git
   cd fetch-axios
   ```

3. 安装依赖

   ```bash
   pnpm install
   ```

4. 创建新分支

   ```bash
   git checkout -b feature/你的功能名称
   ```

## 开发工作流

### 构建项目

```bash
pnpm build
```

### 开发模式

```bash
pnpm dev
```

### 运行示例

```bash
pnpm example
```

## 代码规范

- 使用 TypeScript 进行开发，确保添加适当的类型定义
- 遵循现有代码的风格和模式
- 确保代码在浏览器和 Node.js 环境下都能正常工作
- 保持函数小巧、单一职责
- 为公共 API 添加必要的注释和文档

## 提交规范

提交信息请使用语义化提交格式：

```text
<类型>(可选作用域): <描述>

[可选的正文]

[可选的脚注]
```

类型可以是：

- feat: 新功能
- fix: 修复 bug
- docs: 文档修改
- style: 代码风格变更（不影响功能）
- refactor: 代码重构
- perf: 性能优化
- test: 添加或修改测试
- chore: 构建过程或辅助工具变动

例如：

```text
feat(request): 添加自定义超时支持

添加了请求级别的超时配置，允许为每个请求单独设置超时时间。

关闭 #123
```

## Pull Request 流程

1. 确保你的代码通过了构建
2. 更新对应的文档
3. 更新测试（如适用）
4. 提交 Pull Request 到 `main` 分支
5. 在 PR 描述中详细说明你的更改

## 问题反馈

如果你发现了 bug 或有新功能建议，请创建 issue，并尽可能提供：

- 问题的详细描述
- 复现步骤
- 预期行为与实际行为
- 环境信息（浏览器/Node.js 版本等）

## 许可证

通过贡献代码，你同意你的贡献将根据项目的 ISC 许可证授权。
