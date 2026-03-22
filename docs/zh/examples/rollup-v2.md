# Rollup v2 示例

本示例演示如何使用 Rollup 2.x（最低支持版本）。

## 测试功能

- 单行 banner
- 从 package.json 动态读取 banner
- Source map 支持

## 配置

```js
import { readFileSync } from 'node:fs'
import addBanner from 'rollup-plugin-add-banner'

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    addBanner({
      content: `/*! ${pkg.name} v${pkg.version} (c) ${new Date().getFullYear()} ${pkg.author} */`
    })
  ]
}
```

## 源代码

::: details src/index.js
```js
/**
 * 示例库
 * 使用 rollup-plugin-add-banner 构建
 */

export function greet(name) {
  return `Hello, ${name}!`
}

export function getVersion() {
  return '1.0.0'
}
```
:::

## 尝试

```bash
cd examples/rollup-v2
pnpm install
pnpm run build
cat dist/index.js
```

## 输出

```js
/*! example-rollup-v2 v1.0.0 (c) 2024 saqqdy */
/**
 * 示例库
 * 使用 rollup-plugin-add-banner 构建
 */

export function greet(name) {
  return `Hello, ${name}!`
}

export function getVersion() {
  return '1.0.0'
}
//# sourceMappingURL=index.js.map
```

## 在线体验

[在 StackBlitz 中打开](https://stackblitz.com/github/saqqdy/rollup-plugin-add-banner/tree/master/examples/rollup-v2)
