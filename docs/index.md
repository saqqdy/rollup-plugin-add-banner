---
layout: home

hero:
  name: rollup-plugin-add-banner
  text: Add Banner to Your Bundle
  tagline: A Rollup plugin that adds banner comments to the output bundle
  image:
    src: /logo.svg
    alt: rollup-plugin-add-banner
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/saqqdy/rollup-plugin-add-banner

features:
  - icon: 🔧
    title: Simple Integration
    details: Works seamlessly with Rollup 2.x, 3.x, and 4.x with zero configuration
  - icon: 📦
    title: License Ready
    details: Easily add copyright notices and license information to your bundles
  - icon: 🎯
    title: Flexible Content
    details: Support for single-line and multi-line banner content
  - icon: ⚡
    title: TypeScript First
    details: Full TypeScript support with comprehensive type definitions
  - icon: 🗺️
    title: Source Map Support
    details: Automatically adjusts source maps when adding banners
  - icon: 🪶
    title: Lightweight
    details: Minimal footprint with no runtime dependencies
---

## Quick Start

### Install

```bash
# pnpm
pnpm add -D rollup-plugin-add-banner

# npm
npm install -D rollup-plugin-add-banner
```

### Usage

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

## Why rollup-plugin-add-banner?

- **Template Variables**: Auto-resolve `${name}`, `${version}`, `${author}`, `${license}` from package.json
- **Simple API**: Just provide the banner content and you're done
- **Works with All Rollup Versions**: Compatible with Rollup 2.x, 3.x, and 4.x
- **Multiple Banners**: Different banners for different file types
- **Include/Exclude**: Fine-grained control with glob patterns
- **100% Test Coverage**: Thoroughly tested for reliability
