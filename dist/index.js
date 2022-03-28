'use strict';

var MagicString = require('magic-string');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var MagicString__default = /*#__PURE__*/_interopDefaultLegacy(MagicString);

/**
 * 一个添加库`banner`的`rollup`插件
 *
 * @param options - 配置参数
 * @returns Plugin - 插件
 */

function addBannerPlugin(options) {
  return {
    name: 'add-banner',

    renderChunk(code, chunk, {
      sourcemap
    }) {
      const ms = new MagicString__default["default"](`${options.content}\n${code}`);
      return {
        code: ms.toString(),
        map: sourcemap ? ms.generateMap({
          hires: true
        }) : null
      };
    }

  };
}

module.exports = addBannerPlugin;
