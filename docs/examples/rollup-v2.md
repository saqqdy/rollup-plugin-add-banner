# Rollup v2 Example

This example demonstrates usage with Rollup 2.x (minimum supported version).

## Features Tested

- Single-line banner
- Dynamic banner from package.json
- Source map support

## Configuration

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

## Source Code

::: details src/index.js
```js
/**
 * Example library
 * Built with rollup-plugin-add-banner
 */

export function greet(name) {
  return `Hello, ${name}!`
}

export function getVersion() {
  return '1.0.0'
}
```
:::

## Try It

```bash
cd examples/rollup-v2
pnpm install
pnpm run build
cat dist/index.js
```

## Output

```js
/*! example-rollup-v2 v1.0.0 (c) 2024 saqqdy */
/**
 * Example library
 * Built with rollup-plugin-add-banner
 */

export function greet(name) {
  return `Hello, ${name}!`
}

export function getVersion() {
  return '1.0.0'
}
//# sourceMappingURL=index.js.map
```

## Try Online

[Open in StackBlitz](https://stackblitz.com/github/saqqdy/rollup-plugin-add-banner/tree/master/examples/rollup-v2)
