# Examples

This directory contains example projects demonstrating how to use `rollup-plugin-add-banner` with different Rollup versions.

## Online Examples

Try the plugin online with StackBlitz:

| Example | Description | Link |
|---------|-------------|------|
| Rollup v2 | Rollup 2.x with template variables | [Open in StackBlitz](https://stackblitz.com/github/saqqdy/rollup-plugin-add-banner/tree/master/examples/rollup-v2) |
| Rollup v4 | Rollup 4.x with multiple banners & filtering | [Open in StackBlitz](https://stackblitz.com/github/saqqdy/rollup-plugin-add-banner/tree/master/examples/rollup-v4) |

## Local Examples

Clone the repository and try the examples locally:

```bash
git clone https://github.com/saqqdy/rollup-plugin-add-banner.git
cd rollup-plugin-add-banner/examples/rollup-v4
pnpm install
pnpm run build
cat dist/index.mjs
```

## Feature Coverage

| Feature | rollup-v2 | rollup-v4 |
|---------|-----------|-----------|
| Template variables | ✓ | ✓ |
| Multi-line banner | ✓ | ✓ |
| Multiple banners | - | ✓ |
| Include/Exclude | - | ✓ |
| Source map support | ✓ | ✓ |

## Feature Details

### rollup-v2

Demonstrates basic usage with template variables:

```js
addBanner({
  content: '/*! ${name} v${version} (c) ${author} | ${license} license */'
})
```

**Template Variables:**
- `${name}` - Package name
- `${version}` - Package version
- `${author}` - Package author
- `${license}` - Package license

```bash
cd rollup-v2
pnpm install
pnpm run build
cat dist/index.js
```

### rollup-v4

Demonstrates advanced features:

**1. Multiple Banners for Different Output Formats:**

```js
addBanner({
  banners: {
    '.cjs': '/*! ${name} v${version} - CommonJS */',
    '.mjs': '/*! ${name} v${version} - ES Module */'
  }
})
```

**2. Include/Exclude Patterns:**

```js
addBanner({
  content: '/*! ${name} v${version} */',
  include: ['**/*.js'],
  exclude: ['**/*.min.js']
})
```

```bash
cd rollup-v4
pnpm install
pnpm run build
# Check different outputs
cat dist/index.mjs   # ES Module banner
cat dist/index.cjs   # CommonJS banner
```

## More Examples

### Banner from File

```js
addBanner({
  file: './LICENSE.header'
})
```

### Custom Variables

```js
addBanner({
  content: '/*! ${name} - ${year} */',
  vars: { year: '2024' }
})
```

### Conditional Banner (Production Only)

```js
addBanner({
  content: '/*! ${name} v${version} */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
```

### Custom package.json Path

```js
addBanner({
  content: '/*! ${name} v${version} */',
  pkgPath: '../package.json'
})
```

### Using Plugin API

```js
const plugin = addBanner({ content: '/* banner */' })

// Access plugin API
console.log(plugin.api.getBanner())
console.log(plugin.api.getVars())
console.log(plugin.api.shouldAddBanner())
```
