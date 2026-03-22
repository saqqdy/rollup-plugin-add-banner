# Getting Started

## Installation

Install the plugin as a development dependency:

```bash
# pnpm
pnpm add -D rollup-plugin-add-banner

# npm
npm install -D rollup-plugin-add-banner
```

## Basic Setup

Add the plugin to your Rollup configuration:

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

::: tip Template Variables
The plugin automatically resolves `${name}`, `${version}`, `${author}`, and `${license}` from your `package.json`. No need to read the file manually!
:::

::: tip Plugin Order
The plugin should be placed at the end of your plugins array to ensure the banner is added to the final output.
:::

## How It Works

The plugin hooks into Rollup's `renderChunk` phase to prepend the banner content to your bundle:

1. **renderChunk phase**: Prepends the banner content to each output chunk
2. **Source Map adjustment**: Automatically adjusts source maps when prepending banners

## Requirements

- Rollup >= 2.0.0
- Node.js >= 12

## Next Steps

- [Basic Usage](/guide/basic-usage) - Learn the basic usage patterns
- [Advanced Usage](/guide/advanced-usage) - Explore advanced features
- [API Reference](/api/) - Full API documentation
