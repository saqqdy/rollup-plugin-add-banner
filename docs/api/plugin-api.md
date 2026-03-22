# Plugin API

The plugin returns a Rollup plugin instance with an additional `api` property.

## Properties

### name

- **Type**: `string`
- **Value**: `'add-banner'`

The plugin name.

```js
const plugin = addBanner({ content: '/* banner */' })
console.log(plugin.name) // 'add-banner'
```

### version

- **Type**: `string`
- **Value**: Current plugin version

The plugin version.

```js
const plugin = addBanner({ content: '/* banner */' })
console.log(plugin.version) // '2.0.1'
```

### api

- **Type**: `PluginApi`

Plugin API for external access.

## API Methods

### getBanner()

Get the resolved default banner content.

- **Returns**: `string`

```js
const plugin = addBanner({ content: '/*! ${name} v${version} */' })
console.log(plugin.api.getBanner())
// '/*! my-lib v1.0.0 */'
```

### getBanners()

Get the resolved banners map (when using multiple banners).

- **Returns**: `Record<string, string> | undefined`

```js
const plugin = addBanner({
  banners: { '.js': '/* JS */', '.css': '/* CSS */' }
})
console.log(plugin.api.getBanners())
// { '.js': '/* JS */', '.css': '/* CSS */' }
```

### getVars()

Get all template variables used for resolution.

- **Returns**: `Record<string, string>`

```js
const plugin = addBanner({
  content: '/* banner */',
  vars: { custom: 'value' }
})
console.log(plugin.api.getVars())
// { name: 'my-lib', version: '1.0.0', ..., custom: 'value' }
```

### shouldAddBanner()

Check if banner should be added based on environment variable.

- **Returns**: `boolean`

```js
const plugin = addBanner({
  content: '/* banner */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
console.log(plugin.api.shouldAddBanner()) // true or false
```

## TypeScript Types

```typescript
export interface PluginApi {
  getBanner: () => string
  getBanners: () => Record<string, string> | undefined
  getVars: () => Record<string, string>
  shouldAddBanner: () => boolean
}
```
