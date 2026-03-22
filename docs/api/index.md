# API Reference

This section provides detailed documentation for all plugin options and APIs.

## Quick Reference

| Option | Type | Description |
|--------|------|-------------|
| `content` | `string` | Banner content with template variables |
| `file` | `string` | Path to banner file |
| `vars` | `object` | Custom template variables |
| `include` | `string \| string[]` | Files to include |
| `exclude` | `string \| string[]` | Files to exclude |
| `banners` | `object` | Multiple banners by file type |
| `envVar` | `string` | Environment variable name |
| `envValue` | `string` | Expected env var value |
| `pkgPath` | `string` | Custom package.json path |

## Template Variables

Available in `content` and `banners`:

| Variable | Description |
|----------|-------------|
| `${name}` | Package name |
| `${version}` | Package version |
| `${author}` | Package author |
| `${license}` | Package license |

## Sections

- [Options](/api/options) - Detailed options documentation
- [Plugin API](/api/plugin-api) - Exposed plugin properties and methods
