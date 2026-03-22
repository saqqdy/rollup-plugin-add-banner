# rollup-plugin-add-banner

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]

A Rollup plugin that adds banner comments to the output bundle.

[简体中文](./README_CN.md) | [Docs](https://saqqdy.github.io/rollup-plugin-add-banner/)

## Features

- **Template Variables**: Auto-resolve `${name}`, `${version}`, `${author}`, `${license}` from package.json
- **Custom Variables**: Define your own template variables
- **Multiple Banners**: Different banners for different file types (`.js`, `.css`, `.mjs`, etc.)
- **Include/Exclude**: Fine-grained control with glob patterns
- **File Support**: Read banner from external file
- **Conditional**: Environment-based banner control
- **SourceMap**: Full source map support
- **Plugin API**: Access banner info at runtime

## Installation

```bash
# pnpm
pnpm add -D rollup-plugin-add-banner

# npm
npm install -D rollup-plugin-add-banner
```

## Usage

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

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | `string` | `''` | Banner content (supports template variables) |
| `file` | `string` | - | Path to file containing banner (overrides `content`) |
| `vars` | `object` | `{}` | Custom template variables |
| `include` | `string \| string[]` | - | Files to include (glob patterns) |
| `exclude` | `string \| string[]` | `[]` | Files to exclude (glob patterns) |
| `banners` | `object` | - | Multiple banners by file type |
| `envVar` | `string` | - | Environment variable for conditional banner |
| `envValue` | `string` | `'true'` | Expected value for env var |
| `pkgPath` | `string` | `'package.json'` | Custom package.json path |

## Template Variables

The following variables are automatically resolved from `package.json`:

| Variable | Description |
|----------|-------------|
| `${name}` | Package name |
| `${version}` | Package version |
| `${author}` | Package author |
| `${license}` | Package license |

You can also define custom variables:

```js
addBanner({
  content: '/*! ${name} v${version} - ${year} */',
  vars: { year: '2024' }
})
```

## Examples

### Basic Usage

```js
addBanner({
  content: '/*! ${name} v${version} (c) ${author} */'
})
// Output: /*! rollup-plugin-add-banner v2.0.1 (c) saqqdy */
```

### Multi-line Banner

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

### Banner from File

```js
addBanner({
  file: './banner.txt'
})
```

### Multiple Banners for Different File Types

```js
addBanner({
  banners: {
    '.js': '/*! ${name} v${version} */',
    '.mjs': '/*! ${name} v${version} - ESM */',
    '.css': '/* ${name} v${version} */'
  }
})
```

### Include/Exclude Patterns

```js
addBanner({
  content: '/*! ${name} */',
  include: ['**/*.js', '**/*.mjs'],  // Only .js and .mjs files
  exclude: ['**/*.min.js']           // Exclude minified files
})
```

Supported pattern types:
- `**/*.js` - Extension match
- `src/**` - Prefix match
- `**/dist/**` - Directory match
- `*.min.js` - Wildcard match

### Conditional Banner (Environment-based)

Only add banner in production:

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

## Plugin API

The plugin exposes an API for runtime access:

```js
const plugin = addBanner({ content: '/* banner */' })

// Get resolved default banner
plugin.api.getBanner() // '/* banner */'

// Get all banners map (if using banners option)
plugin.api.getBanners() // { '.js': '/* ... */' }

// Get all template variables
plugin.api.getVars() // { name: '...', version: '...', ... }

// Check if banner should be added (based on envVar)
plugin.api.shouldAddBanner() // true/false
```

## Integration Examples

### With Vite

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

### With Rollup

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

## Requirements

- Rollup >= 2.0.0
- Node.js >= 12

## Migration from v1 to v2

Version 2.0.0 includes breaking changes:

1. **Output file paths changed**:
   - ESM: `dist/index.esm.js` → `dist/index.mjs`
   - CJS: `dist/index.js` → `dist/index.cjs`

2. **New features available**:
   - Template variables (no need to read package.json manually)
   - Include/exclude patterns
   - Multiple banners support
   - Environment-based conditional banners

**Before (v1)**:

```js
import { readFileSync } from 'node:fs'
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))

addBanner({
  content: `/*! ${pkg.name} v${pkg.version} */`
})
```

**After (v2)**:

```js
addBanner({
  content: '/*! ${name} v${version} */'
})
```

## Feedback

If you have any questions or suggestions, please open an [Issue](https://github.com/saqqdy/rollup-plugin-add-banner/issues).

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/rollup-plugin-add-banner.svg?style=flat-square
[npm-url]: https://npmjs.org/package/rollup-plugin-add-banner
[download-image]: https://img.shields.io/npm/dm/rollup-plugin-add-banner.svg?style=flat-square
[download-url]: https://npmjs.org/package/rollup-plugin-add-banner
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: LICENSE
