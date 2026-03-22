# 选项

## content

- **类型**: `string`
- **必填**: 否（如果提供了 `file` 或 `banners`）

要添加到输出文件顶部的 banner 内容。支持模板变量。

```js
addBanner({
  content: '/*! My Library v1.0.0 (c) 2024 Author */'
})
```

### 模板变量

`content` 选项支持自动替换的模板变量：

```js
addBanner({
  content: '/*! ${name} v${version} (c) ${author} */'
})
// 输出: /*! my-lib v1.0.0 (c) John Doe */
```

| 变量 | 说明 |
|------|------|
| `${name}` | package.json 中的包名 |
| `${version}` | package.json 中的版本号 |
| `${author}` | package.json 中的作者 |
| `${license}` | package.json 中的许可证 |

也可以通过 `vars` 选项提供自定义变量。

---

## file

- **类型**: `string`
- **默认值**: `undefined`

包含 banner 内容的文件路径。覆盖 `content` 选项。

```js
addBanner({
  file: './LICENSE.header'
})
```

---

## vars

- **类型**: `Record<string, string>`
- **默认值**: `{}`

自定义模板变量，与 package.json 信息合并。

```js
addBanner({
  content: '/*! ${name} ${year} */',
  vars: { year: '2024' }
})
```

---

## include

- **类型**: `string | string[]`
- **默认值**: 处理所有文件

需要添加 banner 的文件。支持 glob 模式。

```js
addBanner({
  content: '/* banner */',
  include: ['**/*.js', '**/*.mjs']
})
```

### 支持的模式

| 模式 | 示例 | 匹配 |
|------|------|------|
| 扩展名匹配 | `**/*.js` | 任意 `.js` 文件 |
| 前缀匹配 | `src/**` | `src/` 下所有文件 |
| 目录匹配 | `**/dist/**` | 任意位置的 `dist` 目录 |
| 通配符匹配 | `*.min.js` | 仅 `foo.min.js` |

---

## exclude

- **类型**: `string | string[]`
- **默认值**: `[]`

不需要添加 banner 的文件。

```js
addBanner({
  content: '/* banner */',
  exclude: ['**/*.min.js', '**/vendor/**']
})
```

---

## banners

- **类型**: `Record<string, string>`
- **默认值**: `undefined`

不同文件类型使用不同的 banner。键为文件扩展名或模式。

```js
addBanner({
  banners: {
    '.js': '/*! ${name} v${version} */',
    '.mjs': '/*! ${name} v${version} - ES Module */',
    '.css': '/* ${name} v${version} */'
  }
})
```

---

## envVar

- **类型**: `string`
- **默认值**: `undefined`

用于条件 banner 的环境变量名。只有当变量值匹配 `envValue` 时才添加 banner。

```js
addBanner({
  content: '/* banner */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
```

---

## envValue

- **类型**: `string`
- **默认值**: `'true'`

环境变量的期望值。

```js
addBanner({
  content: '/* production banner */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
```

---

## pkgPath

- **类型**: `string`
- **默认值**: `'package.json'`

用于读取模板变量的 package.json 路径。

```js
addBanner({
  content: '/*! ${name} */',
  pkgPath: '../package.json'
})
```
