# Advanced Usage

## Include/Exclude Patterns

Control which files get banners using glob patterns:

```js
addBanner({
  content: '/*! ${name} v${version} */',
  include: ['**/*.js', '**/*.mjs'],
  exclude: ['**/*.min.js']
})
```

### Supported Patterns

| Pattern | Example | Matches |
|---------|---------|---------|
| Extension match | `**/*.js` | Any `.js` file |
| Prefix match | `src/**` | Any file under `src/` |
| Directory match | `**/dist/**` | Any file in `dist` |
| Wildcard match | `*.min.js` | `foo.min.js` only |

## Multiple Banners

Use different banners for different file types:

```js
addBanner({
  banners: {
    '.js': '/*! ${name} v${version} - JavaScript */',
    '.mjs': '/*! ${name} v${version} - ES Module */',
    '.css': '/* ${name} v${version} - Stylesheet */'
  }
})
```

### Pattern-based Banners

You can also use patterns as keys:

```js
addBanner({
  banners: {
    '.js': '/* JS Banner */',
    '**/worker.js': '/* Web Worker */',
    '**/*.min.js': '/* Minified */'
  }
})
```

## Programmatic Usage

Use the plugin programmatically:

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

## Multiple Output Formats

When generating multiple output formats, each gets the banner:

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

## Plugin API

Access banner information at runtime:

```js
const plugin = addBanner({
  content: '/*! ${name} v${version} */',
  envVar: 'NODE_ENV'
})

export default {
  plugins: [plugin]
}

// Later in your code
console.log('Resolved banner:', plugin.api.getBanner())
console.log('Will add banner:', plugin.api.shouldAddBanner())
console.log('Template vars:', plugin.api.getVars())
```

## Integration with Other Plugins

### With TypeScript Plugin

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

### With Node Resolve Plugin

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

## Dynamic Banner Generation

Generate banner content dynamically:

```js
const banner = (() => {
  const year = new Date().getFullYear()
  return `/*! ${pkg.name} v${pkg.version} (c) ${year} ${pkg.author} */`
})()

addBanner({ content: banner })
```

## Environment-based Configuration

Different banners for different environments:

```js
const isProduction = process.env.NODE_ENV === 'production'

addBanner({
  content: isProduction
    ? '/*! ${name} v${version} - Production Build */'
    : '/*! ${name} v${version} - Development Build */',
  // Or use envVar option for automatic checking
  envVar: isProduction ? undefined : 'DISABLE_BANNER'
})
```
