import type { Plugin } from 'rollup';

/**
 * 一个添加库`banner`的`rollup`插件
 *
 * @param options - 配置参数
 * @returns Plugin - 插件
 */
declare function addBannerPlugin(options: Options): Plugin;
export default addBannerPlugin;

export declare interface Options {
    content: string;
}

export { }
