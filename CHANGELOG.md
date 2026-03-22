# Changelog

All notable changes to this project will be documented in this file.

## [2.0.1] - 2025-03-22

### Bug Fixes

- Fixed author resolution from object format in package.json (previously returned `[object Object]`)

### Documentation

- Updated docs theme color to Blue/Tech modern style
- New banner/flag style logo

### Tests

- Added tests for 100% code coverage (57 test cases)
- Added tests for pattern-based banners
- Added tests for author object format
- Added tests for exclude as string vs array

---

## [2.0.0] - 2025-03-22

### Breaking Changes

- Changed output file paths:
  - ESM: `dist/index.esm.js` → `dist/index.mjs`
  - CJS: `dist/index.js` → `dist/index.cjs`
  - Types: `dist/index.d.ts` → `dist/index.d.mts` / `dist/index.d.cts`
- Changed exports configuration for better ESM/CJS compatibility
- Requires Node.js >= 12 (previously no explicit requirement)

### Features

#### Template Variables

Auto-resolve variables from package.json in banner content:

```js
addBanner({ content: '/*! ${name} v${version} (c) ${author} */' })
```

Supported variables: `${name}`, `${version}`, `${author}`, `${license}`

#### Custom Variables

Define custom template variables via `vars` option:

```js
addBanner({
  content: '/*! ${name} - ${year} */',
  vars: { year: '2024' }
})
```

#### Include/Exclude Patterns

Filter files with glob-like patterns:

```js
addBanner({
  include: ['**/*.js'],
  exclude: ['**/*.min.js']
})
```

Supported patterns:
- Exact match: `src/index.js`
- Extension match: `**/*.js`
- Prefix match: `src/**`
- Directory match: `**/dist/**`
- Wildcard match: `*.min.js`

#### Multiple Banners

Different banners for different file types:

```js
addBanner({
  banners: {
    '.js': '/*! ${name} v${version} */',
    '.css': '/* ${name} v${version} */'
  }
})
```

#### File Support

Read banner from external file:

```js
addBanner({ file: './LICENSE.header' })
```

#### Conditional Banner

Environment-based banner control:

```js
addBanner({
  content: '/*! ${name} */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
```

#### Custom package.json Path

```js
addBanner({ pkgPath: '../package.json' })
```

#### Plugin API

Exposed methods for runtime access:

```js
plugin.api.getBanner()      // Get resolved banner
plugin.api.getBanners()     // Get all banners map
plugin.api.getVars()        // Get template variables
plugin.api.shouldAddBanner() // Check environment condition
```

### Improvements

- Migrated build system from Rollup to [tsdown](https://github.com/rolldown/tsdown)
- Added `sideEffects: false` for better tree-shaking
- Improved TypeScript configuration with strict mode
- Added VitePress documentation site with bilingual support (English & Chinese)
- Full source map support using magic-string

### Dependencies

- `rollup`: ^2.78.1 → ^4.59.1 (peer dependency: `>=2.0.0`)
- `typescript`: ^4.7.4 → ^5.9.3
- `magic-string`: ^0.27.0 → ^0.30.21

### Testing

- Added unit tests with Vitest (51 test cases)
- Added test coverage reporting with v8
- Test coverage for all features:
  - Plugin initialization
  - renderChunk hook behavior
  - Source map generation
  - Template variable resolution
  - Include/exclude patterns
  - Multiple banners
  - File-based banner
  - pkgPath option
  - Environment variable conditions
  - Plugin API
  - Edge cases

### CI/CD

- Added GitHub Actions workflow
- Matrix testing: Node 18/20/22 × Rollup 2/3/4
- Automated npm publish workflow

### Documentation

- Comprehensive README (English & Chinese)
- VitePress documentation site
- Example projects for Rollup v2 and v4
- API documentation with all options

### Removed

- Removed Babel and related plugins
- Removed `@microsoft/api-extractor`
- Removed legacy Rollup plugins (`@rollup/plugin-node-resolve`, `@rollup/plugin-commonjs`, `@rollup/plugin-typescript`)
- Removed Prettier configuration (replaced with ESLint)

---

## [1.1.0] - 2022-08-25

### Changed

- Updated dependency versions
- Optimized build process

## [1.0.0] - 2021-10-22

### Added

- Initial release
- Basic banner support with `content` option
