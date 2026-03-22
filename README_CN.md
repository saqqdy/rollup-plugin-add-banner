# rollup-plugin-add-banner

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]

一个 Rollup 插件，用于在输出文件顶部添加 banner 注释。

[English](./README.md) | [文档](https://saqqdy.github.io/rollup-plugin-add-banner/zh/)

## 功能特性

- **模板变量**：自动从 package.json 解析 `${name}`, `${version}`, `${author}`, `${license}`
- **自定义变量**：定义自己的模板变量
- **多 Banner 支持**：不同文件类型使用不同的 banner (`.js`, `.css`, `.mjs` 等)
- **Include/Exclude**：使用 glob 模式精确控制
- **文件支持**：从外部文件读取 banner
- **条件控制**：基于环境变量的 banner 控制
- **SourceMap**：完整的 source map 支持
- **插件 API**：运行时访问 banner 信息

## 安装

```bash
# pnpm
pnpm add -D rollup-plugin-add-banner

# npm
npm install -D rollup-plugin-add-banner

# yarn
yarn add -D rollup-plugin-add-banner
```

## 用法

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

## 选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `content` | `string` | `''` | Banner 内容（支持模板变量） |
| `file` | `string` | - | 包含 banner 的文件路径（覆盖 `content`） |
| `vars` | `object` | `{}` | 自定义模板变量 |
| `include` | `string \| string[]` | - | 需要处理的文件（glob 模式） |
| `exclude` | `string \| string[]` | `[]` | 不需要处理的文件（glob 模式） |
| `banners` | `object` | - | 不同文件类型的多个 banner |
| `envVar` | `string` | - | 用于条件 banner 的环境变量 |
| `envValue` | `string` | `'true'` | 环境变量的期望值 |
| `pkgPath` | `string` | `'package.json'` | 自定义 package.json 路径 |

## 模板变量

以下变量自动从 `package.json` 解析：

| 变量 | 说明 |
|------|------|
| `${name}` | 包名 |
| `${version}` | 包版本 |
| `${author}` | 包作者 |
| `${license}` | 包许可证 |

也可以定义自定义变量：

```js
addBanner({
  content: '/*! ${name} v${version} - ${year} */',
  vars: { year: '2024' }
})
```

## 示例

### 基本用法

```js
addBanner({
  content: '/*! ${name} v${version} (c) ${author} */'
})
// 输出: /*! rollup-plugin-add-banner v2.0.0 (c) saqqdy */
```

### 多行 Banner

```js
addBanner({
  content: `
/*!
 * ${name} v${version}
 * (c) ${author}
 * Released under the ${license} License.
 */`
})
```

### 从文件读取

```js
addBanner({
  file: './banner.txt'
})
```

### 不同文件类型的多个 Banner

```js
addBanner({
  banners: {
    '.js': '/*! ${name} v${version} */',
    '.mjs': '/*! ${name} v${version} - ESM */',
    '.css': '/* ${name} v${version} */'
  }
})
```

### Include/Exclude 模式

```js
addBanner({
  content: '/*! ${name} */',
  include: ['**/*.js', '**/*.mjs'],  // 只处理 .js 和 .mjs 文件
  exclude: ['**/*.min.js']           // 排除压缩文件
})
```

支持的模式类型：
- `**/*.js` - 扩展名匹配
- `src/**` - 前缀匹配
- `**/dist/**` - 目录匹配
- `*.min.js` - 通配符匹配

### 条件 Banner（基于环境）

仅在生产环境添加 banner：

```js
addBanner({
  content: '/*! ${name} v${version} */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
```

### 自定义 package.json 路径

```js
addBanner({
  content: '/*! ${name} v${version} */',
  pkgPath: '../package.json'
})
```

## 插件 API

插件暴露 API 供运行时访问：

```js
const plugin = addBanner({ content: '/* banner */' })

// 获取解析后的默认 banner
plugin.api.getBanner() // '/* banner */'

// 获取所有 banner 映射（如果使用 banners 选项）
plugin.api.getBanners() // { '.js': '/* ... */' }

// 获取所有模板变量
plugin.api.getVars() // { name: '...', version: '...', ... }

// 检查是否应该添加 banner（基于 envVar）
plugin.api.shouldAddBanner() // true/false
```

## 集成示例

### 与 Vite 一起使用

```js
// vite.config.js
import addBanner from 'rollup-plugin-add-banner'

export default {
  plugins: [
    addBanner({
      content: '/*! ${name} v${version} */'
    })
  ]
}
```

### 与 Rollup 一起使用

```js
// rollup.config.js
import addBanner from 'rollup-plugin-add-banner'

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'es' }
  ],
  plugins: [
    addBanner({
      banners: {
        '.js': '/*! ${name} v${version} - CJS */',
        '.mjs': '/*! ${name} v${version} - ESM */'
      }
    })
  ]
}
```

## 要求

- Rollup >= 2.0.0
- Node.js >= 12

## 从 v1 迁移到 v2

版本 2.0.0 包含破坏性变更：

1. **输出文件路径变更**：
   - ESM: `dist/index.esm.js` → `dist/index.mjs`
   - CJS: `dist/index.js` → `dist/index.cjs`

2. **新功能可用**：
   - 模板变量（无需手动读取 package.json）
   - Include/exclude 模式
   - 多 banner 支持
   - 基于环境变量的条件 banner

**之前 (v1)**：

```js
import { readFileSync } from 'node:fs'
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))

addBanner({
  content: `/*! ${pkg.name} v${pkg.version} */`
})
```

**之后 (v2)**：

```js
addBanner({
  content: '/*! ${name} v${version} */'
})
```

## 反馈

如有问题或建议，欢迎提交 [Issue](https://github.com/saqqdy/rollup-plugin-add-banner/issues)。

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/rollup-plugin-add-banner.svg?style=flat-square
[npm-url]: https://npmjs.org/package/rollup-plugin-add-banner
[download-image]: https://img.shields.io/npm/dm/rollup-plugin-add-banner.svg?style=flat-square
[download-url]: https://npmjs.org/package/rollup-plugin-add-banner
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: LICENSE
