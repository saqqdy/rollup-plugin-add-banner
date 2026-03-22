# 进阶用法

## Include/Exclude 模式

使用 glob 模式控制哪些文件添加 banner：

```js
addBanner({
  content: '/*! ${name} v${version} */',
  include: ['**/*.js', '**/*.mjs'],
  exclude: ['**/*.min.js']
})
```

### 支持的模式

| 模式 | 示例 | 匹配 |
|------|------|------|
| 扩展名匹配 | `**/*.js` | 任意 `.js` 文件 |
| 前缀匹配 | `src/**` | `src/` 下所有文件 |
| 目录匹配 | `**/dist/**` | 任意位置的 `dist` 目录 |
| 通配符匹配 | `*.min.js` | 仅 `foo.min.js` |

## 多 Banner 支持

不同文件类型使用不同的 banner：

```js
addBanner({
  banners: {
    '.js': '/*! ${name} v${version} - JavaScript */',
    '.mjs': '/*! ${name} v${version} - ES Module */',
    '.css': '/* ${name} v${version} - Stylesheet */'
  }
})
```

### 基于模式的 Banner

也可以使用模式作为键：

```js
addBanner({
  banners: {
    '.js': '/* JS Banner */',
    '**/worker.js': '/* Web Worker */',
    '**/*.min.js': '/* Minified */'
  }
})
```

## 编程式使用

编程式地使用插件：

```js
import { rollup } from 'rollup'
import addBanner from 'rollup-plugin-add-banner'

const bundle = await rollup({
  input: 'src/index.js',
  plugins: [
    addBanner({
      content: '/*! ${name} v${version} */'
    })
  ]
})

await bundle.write({
  file: 'dist/index.js',
  format: 'es'
})
```

## 多输出格式

生成多种输出格式时，每个输出都会添加 banner：

```js
export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.cjs', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'es' }
  ],
  plugins: [
    addBanner({
      content: '/*! ${name} v${version} */'
    })
  ]
}
```

## 插件 API

在运行时访问 banner 信息：

```js
const plugin = addBanner({
  content: '/*! ${name} v${version} */',
  envVar: 'NODE_ENV'
})

export default {
  plugins: [plugin]
}

// 后续代码中
console.log('已解析的 banner:', plugin.api.getBanner())
console.log('是否添加 banner:', plugin.api.shouldAddBanner())
console.log('模板变量:', plugin.api.getVars())
```

## 与其他插件集成

### 与 TypeScript 插件

```js
import typescript from '@rollup/plugin-typescript'
import addBanner from 'rollup-plugin-add-banner'

export default {
  plugins: [
    typescript(),
    addBanner({ content: '/*! ${name} v${version} */' })
  ]
}
```

### 与 Node Resolve 插件

```js
import { nodeResolve } from '@rollup/plugin-node-resolve'
import addBanner from 'rollup-plugin-add-banner'

export default {
  plugins: [
    nodeResolve(),
    addBanner({ content: '/*! ${name} v${version} */' })
  ]
}
```

## 动态 Banner 生成

动态生成 banner 内容：

```js
const banner = (() => {
  const year = new Date().getFullYear()
  return `/*! ${pkg.name} v${pkg.version} (c) ${year} ${pkg.author} */`
})()

addBanner({ content: banner })
```

## 基于环境的配置

不同环境使用不同的 banner：

```js
const isProduction = process.env.NODE_ENV === 'production'

addBanner({
  content: isProduction
    ? '/*! ${name} v${version} - Production Build */'
    : '/*! ${name} v${version} - Development Build */',
  // 或使用 envVar 选项自动检查
  envVar: isProduction ? undefined : 'DISABLE_BANNER'
})
```
