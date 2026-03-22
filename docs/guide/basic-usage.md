# Basic Usage

## Simple Banner

Add a simple one-line banner to your bundle:

```js
addBanner({
  content: '/*! My Library v1.0.0 (c) 2024 Author */'
})
```

**Input:**
```js
export function hello() {
  console.log('Hello World')
}
```

**Output:**
```js
/*! My Library v1.0.0 (c) 2024 Author */
export function hello() {
  console.log('Hello World')
}
```

## Template Variables

Use template variables that are automatically resolved from package.json:

```js
addBanner({
  content: '/*! ${name} v${version} (c) ${author} */'
})
```

Available variables:
- `${name}` - Package name
- `${version}` - Package version
- `${author}` - Package author
- `${license}` - Package license

## Custom Variables

Add your own template variables:

```js
addBanner({
  content: '/*! ${name} v${version} - ${buildType} */',
  vars: { buildType: 'production' }
})
```

## Multi-line Banner

Add a multi-line license banner:

```js
addBanner({
  content: `
/*!
 * My Library v1.0.0
 * (c) 2024 Author Name
 * Released under the MIT License.
 */`
})
```

## Banner from File

Read banner content from a separate file:

```js
addBanner({
  file: './LICENSE.header'
})
```

## Conditional Banner

Only add banner in production builds:

```js
addBanner({
  content: '/*! ${name} v${version} */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
```

The banner will only be added when `process.env.NODE_ENV === 'production'`.

## Source Map Support

The plugin automatically adjusts source maps when adding banners:

```js
export default {
  output: {
    sourcemap: true
  },
  plugins: [
    addBanner({
      content: '/*! My Library v1.0.0 */'
    })
  ]
}
```
