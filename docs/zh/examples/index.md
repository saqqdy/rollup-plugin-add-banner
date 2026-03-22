# 示例

本节包含演示如何在不同 Rollup 版本中使用 `rollup-plugin-add-banner` 的示例项目。

## 在线示例

通过 StackBlitz 在线体验：

| 示例 | 说明 | 链接 |
|------|------|------|
| Rollup v2 | Rollup 2.x 动态 banner（从 package.json 读取） | [在 StackBlitz 中打开](https://stackblitz.com/github/saqqdy/rollup-plugin-add-banner/tree/master/examples/rollup-v2) |
| Rollup v4 | Rollup 4.x 多行许可证 banner | [在 StackBlitz 中打开](https://stackblitz.com/github/saqqdy/rollup-plugin-add-banner/tree/master/examples/rollup-v4) |

## 本地示例

克隆仓库并在本地体验示例：

```bash
git clone https://github.com/saqqdy/rollup-plugin-add-banner.git
cd rollup-plugin-add-banner/examples/rollup-v4
pnpm install
pnpm run build
cat dist/index.js
```

## 功能覆盖

| 功能 | rollup-v2 | rollup-v4 |
|------|-----------|-----------|
| 单行 banner | ✓ | ✓ |
| 多行 banner | ✓ | ✓ |
| 动态 banner（从 package.json） | ✓ | ✓ |
| Source map 支持 | ✓ | ✓ |
