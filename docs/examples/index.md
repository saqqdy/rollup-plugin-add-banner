# Examples

This section contains example projects demonstrating how to use `rollup-plugin-add-banner` with different Rollup versions.

## Online Examples

Try the plugin online with StackBlitz:

| Example | Description | Link |
|---------|-------------|------|
| Rollup v2 | Rollup 2.x with dynamic banner from package.json | [Open in StackBlitz](https://stackblitz.com/github/saqqdy/rollup-plugin-add-banner/tree/master/examples/rollup-v2) |
| Rollup v4 | Rollup 4.x with multi-line license banner | [Open in StackBlitz](https://stackblitz.com/github/saqqdy/rollup-plugin-add-banner/tree/master/examples/rollup-v4) |

## Local Examples

Clone the repository and try the examples locally:

```bash
git clone https://github.com/saqqdy/rollup-plugin-add-banner.git
cd rollup-plugin-add-banner/examples/rollup-v4
pnpm install
pnpm run build
cat dist/index.js
```

## Feature Coverage

| Feature | rollup-v2 | rollup-v4 |
|---------|-----------|-----------|
| Single-line banner | ✓ | ✓ |
| Multi-line banner | ✓ | ✓ |
| Dynamic banner from package.json | ✓ | ✓ |
| Source map support | ✓ | ✓ |
