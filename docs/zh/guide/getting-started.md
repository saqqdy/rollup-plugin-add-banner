# 快速上手

## 安装

将插件作为开发依赖安装：

```bash
# pnpm
pnpm add -D rollup-plugin-add-banner

# npm
npm install -D rollup-plugin-add-banner
```

## 基础配置

将插件添加到你的 Rollup 配置中：

```js
import addBanner from 'rollup-plugin-add-banner'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'es'
  },
  plugins: [
    addBanner({
      content: '/*! ${name} v${version} (c) ${author} */'
    })
  ]
}
```

::: tip 模板变量
插件自动从 `package.json` 解析 `${name}`、`${version}`、`${author}` 和 `${license}`。无需手动读取文件！
:::

::: tip 插件顺序
插件应该放在插件数组的末尾，以确保 banner 被添加到最终输出中。
:::

## 工作原理

插件在 Rollup 的 `renderChunk` 阶段将 banner 内容添加到打包文件：

1. **renderChunk 阶段**：将 banner 内容添加到每个输出 chunk
2. **Source Map 调整**：添加 banner 时自动调整 source map

## 系统要求

- Rollup >= 2.0.0
- Node.js >= 12

## 下一步

- [基础用法](/zh/guide/basic-usage) - 学习基础使用模式
- [进阶用法](/zh/guide/advanced-usage) - 探索高级功能
- [API 参考](/zh/api/) - 完整 API 文档
