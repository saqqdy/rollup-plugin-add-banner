# rollup-plugin-add-banner

一个添加库`banner`的`rollup`插件

[![NPM version][npm-image]][npm-url]
[![Codacy Badge][codacy-image]][codacy-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![gzip][gzip-image]][gzip-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

## 安装

```bash
# 使用npm
$ npm install -D rollup-plugin-add-banner

# 使用yarn
$ yarn add -D rollup-plugin-add-banner
```

## 使用

```js
import banner from 'rollup-plugin-add-banner'

plugins: [
    banner({
        content: ''
    })
]
```

## 问题和支持

Please open an issue [here](https://github.com/saqqdy/rollup-plugin-add-banner/issues).

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/rollup-plugin-add-banner.svg?style=flat-square
[npm-url]: https://npmjs.org/package/rollup-plugin-add-banner
[codacy-image]: https://app.codacy.com/project/badge/Grade/f70d4880e4ad4f40aa970eb9ee9d0696
[codacy-url]: https://www.codacy.com/gh/saqqdy/rollup-plugin-add-banner/dashboard?utm_source=github.com&utm_medium=referral&utm_content=saqqdy/rollup-plugin-add-banner&utm_campaign=Badge_Grade
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/rollup-plugin-add-banner.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/rollup-plugin-add-banner?branch=master
[download-image]: https://img.shields.io/npm/dm/rollup-plugin-add-banner.svg?style=flat-square
[download-url]: https://npmjs.org/package/rollup-plugin-add-banner
[gzip-image]: http://img.badgesize.io/https://unpkg.com/rollup-plugin-add-banner/dist/index.js?compression=gzip&label=gzip%20size:%20JS
[gzip-url]: http://img.badgesize.io/https://unpkg.com/rollup-plugin-add-banner/dist/index.js?compression=gzip&label=gzip%20size:%20JS
[license-image]: https://img.shields.io/badge/License-MIT-yellow.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_rollup-plugin-add-banner
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_rollup-plugin-add-banner
