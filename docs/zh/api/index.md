# API 参考

本节提供所有插件选项和 API 的详细文档。

## 快速参考

| 选项 | 类型 | 说明 |
|------|------|------|
| `content` | `string` | 支持模板变量的 banner 内容 |
| `file` | `string` | banner 文件路径 |
| `vars` | `object` | 自定义模板变量 |
| `include` | `string \| string[]` | 需要处理的文件 |
| `exclude` | `string \| string[]` | 不需要处理的文件 |
| `banners` | `object` | 不同文件类型的多个 banner |
| `envVar` | `string` | 环境变量名 |
| `envValue` | `string` | 环境变量期望值 |
| `pkgPath` | `string` | 自定义 package.json 路径 |

## 模板变量

可在 `content` 和 `banners` 中使用：

| 变量 | 说明 |
|------|------|
| `${name}` | 包名 |
| `${version}` | 版本号 |
| `${author}` | 作者 |
| `${license}` | 许可证 |

## 章节

- [选项](/zh/api/options) - 详细选项文档
- [插件 API](/zh/api/plugin-api) - 暴露的插件属性和方法
