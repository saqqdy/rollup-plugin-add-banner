# 基础用法

## 简单 Banner

添加单行 banner：

```js
addBanner({
  content: '/*! My Library v1.0.0 (c) 2024 Author */'
})
```

**输入：**
```js
export function hello() {
  console.log('Hello World')
}
```

**输出：**
```js
/*! My Library v1.0.0 (c) 2024 Author */
export function hello() {
  console.log('Hello World')
}
```

## 模板变量

使用自动从 package.json 解析的模板变量：

```js
addBanner({
  content: '/*! ${name} v${version} (c) ${author} */'
})
```

可用变量：
- `${name}` - 包名
- `${version}` - 版本号
- `${author}` - 作者
- `${license}` - 许可证

## 自定义变量

添加自己的模板变量：

```js
addBanner({
  content: '/*! ${name} v${version} - ${buildType} */',
  vars: { buildType: 'production' }
})
```

## 多行 Banner

添加多行许可证 banner：

```js
addBanner({
  content: `
/*!
 * My Library v1.0.0
 * (c) 2024 Author Name
 * Released under the MIT License.
 */`
})
```

## 从文件读取 Banner

从单独的文件读取 banner 内容：

```js
addBanner({
  file: './LICENSE.header'
})
```

## 条件 Banner

仅在生产构建时添加 banner：

```js
addBanner({
  content: '/*! ${name} v${version} */',
  envVar: 'NODE_ENV',
  envValue: 'production'
})
```

只有当 `process.env.NODE_ENV === 'production'` 时才会添加 banner。

## Source Map 支持

添加 banner 时插件会自动调整 source map：

```js
export default {
  output: {
    sourcemap: true
  },
  plugins: [
    addBanner({
      content: '/*! My Library v1.0.0 */'
    })
  ]
}
```
