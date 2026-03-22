# Options

## content

- **Type**: `string`
- **Required**: No (if `file` or `banners` is provided)

The banner content to prepend to the output bundle. Supports template variables.

```js
addBanner({
  content: '/*! My Library v1.0.0 (c) 2024 Author */'
})
```

### Template Variables

The `content` option supports template variables that are automatically replaced:

```js
addBanner({
  content: '/*! ${name} v${version} (c) ${author} */'
})
// Output: /*! my-lib v1.0.0 (c) John Doe */
```

| Variable | Description |
|----------|-------------|
| `${name}` | Package name from package.json |
| `${version}` | Package version from package.json |
| `${author}` | Package author from package.json |
| `${license}` | Package license from package.json |

You can also provide custom variables via the `vars` option.

---

## file

- **Type**: `string`
- **Default**: `undefined`

Path to a file containing the banner content. Overrides `content` option.

```js
addBanner({
  file: './LICENSE.header'
})
```

---

## vars

- **Type**: `Record<string, string>`
- **Default**: `{}`

Custom template variables merged with package.json info.

```js
addBanner({
  content: '/*! ${name} ${year} */',
  vars: { year: '2024' }
})
```

---

## include

- **Type**: `string | string[]`
- **Default**: Process all files

Files to include for banner processing. Supports glob patterns.

```js
addBanner({
  content: '/* banner */',
  include: ['**/*.js', '**/*.mjs']
})
```

### Supported Patterns

| Pattern | Example | Matches |
|---------|---------|---------|
| Extension match | `**/*.js` | Any `.js` file |
| Prefix match | `src/**` | Any file under `src/` |
| Directory match | `**/dist/**` | Any file in `dist` |
| Wildcard match | `*.min.js` | `foo.min.js` only |

---

## exclude

- **Type**: `string | string[]`
- **Default**: `[]`

Files to exclude from banner processing.

```js
addBanner({
  content: '/* banner */',
  exclude: ['**/*.min.js', '**/vendor/**']
})
```

---

## banners

- **Type**: `Record<string, string>`
- **Default**: `undefined`

Multiple banners for different file types. Key is file extension or pattern.

```js
addBanner({
  banners: {
    '.js': '/*! ${name} v${version} */',
    '.mjs': '/*! ${name} v${version} - ES Module */',
    '.css': '/* ${name} v${version} */'
  }
})
```

---

## envVar

- **Type**: `string`
- **Default**: `undefined`

Environment variable to check for conditional banner. Only add banner when the variable matches `envValue`.

```js
addBanner({
  content: '/* banner */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
```

---

## envValue

- **Type**: `string`
- **Default**: `'true'`

Expected value for the environment variable.

```js
addBanner({
  content: '/* production banner */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
```

---

## pkgPath

- **Type**: `string`
- **Default**: `'package.json'`

Path to package.json for reading template variables.

```js
addBanner({
  content: '/*! ${name} */',
  pkgPath: '../package.json'
})
```
