---
layout: home

hero:
  name: rollup-plugin-add-banner
  text: 为打包文件添加 Banner
  tagline: 一个 Rollup 插件，用于在输出文件顶部添加 banner 注释
  image:
    src: /logo.svg
    alt: rollup-plugin-add-banner
  actions:
    - theme: brand
      text: 快速上手
      link: /zh/guide/getting-started
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/saqqdy/rollup-plugin-add-banner

features:
  - icon: 🔧
    title: 简单集成
    details: 与 Rollup 2.x、3.x 和 4.x 无缝配合，零配置即可使用
  - icon: 📦
    title: 许可证就绪
    details: 轻松为打包文件添加版权声明和许可证信息
  - icon: 🎯
    title: 灵活内容
    details: 支持单行和多行 banner 内容
  - icon: ⚡
    title: TypeScript 优先
    details: 完整的 TypeScript 支持和类型定义
  - icon: 🗺️
    title: Source Map 支持
    details: 添加 banner 时自动调整 source map
  - icon: 🪶
    title: 轻量级
    details: 无运行时依赖，体积最小
---

## 快速开始

### 安装

```bash
# pnpm
pnpm add -D rollup-plugin-add-banner

# npm
npm install -D rollup-plugin-add-banner
```

### 使用

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
      content: '/*! My Library v1.0.0 (c) 2024 Author Released under MIT License */'
    })
  ]
}
```

## 为什么选择 rollup-plugin-add-banner？

- **简单 API**：只需提供 banner 内容即可
- **全版本兼容**：支持 Rollup 2.x、3.x 和 4.x
- **多行支持**：轻松添加多行许可证头
- **Source Map 支持**：正确调整 source map
- **轻量级**：无运行时依赖，对打包体积影响最小
