# 插件 API

插件返回一个 Rollup 插件实例，并附加 `api` 属性。

## 属性

### name

- **类型**: `string`
- **值**: `'add-banner'`

插件名称。

```js
const plugin = addBanner({ content: '/* banner */' })
console.log(plugin.name) // 'add-banner'
```

### version

- **类型**: `string`
- **值**: 当前插件版本

插件版本。

```js
const plugin = addBanner({ content: '/* banner */' })
console.log(plugin.version) // '2.0.1'
```

### api

- **类型**: `PluginApi`

插件 API，供外部访问。

## API 方法

### getBanner()

获取已解析的默认 banner 内容。

- **返回值**: `string`

```js
const plugin = addBanner({ content: '/*! ${name} v${version} */' })
console.log(plugin.api.getBanner())
// '/*! my-lib v1.0.0 */'
```

### getBanners()

获取已解析的 banners 映射（使用多个 banner 时）。

- **返回值**: `Record<string, string> | undefined`

```js
const plugin = addBanner({
  banners: { '.js': '/* JS */', '.css': '/* CSS */' }
})
console.log(plugin.api.getBanners())
// { '.js': '/* JS */', '.css': '/* CSS */' }
```

### getVars()

获取所有用于解析的模板变量。

- **返回值**: `Record<string, string>`

```js
const plugin = addBanner({
  content: '/* banner */',
  vars: { custom: 'value' }
})
console.log(plugin.api.getVars())
// { name: 'my-lib', version: '1.0.0', ..., custom: 'value' }
```

### shouldAddBanner()

检查是否应该添加 banner（基于环境变量）。

- **返回值**: `boolean`

```js
const plugin = addBanner({
  content: '/* banner */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
console.log(plugin.api.shouldAddBanner()) // true 或 false
```

## TypeScript 类型

```typescript
export interface PluginApi {
  getBanner: () => string
  getBanners: () => Record<string, string> | undefined
  getVars: () => Record<string, string>
  shouldAddBanner: () => boolean
}
```
