import MagicString from 'magic-string'
import type { Plugin } from 'rollup'

export interface Options {
	content: string
}

/**
 * 一个添加库`banner`的`rollup`插件
 *
 * @param options - 配置参数
 * @returns Plugin - 插件
 */
export default function addBannerPlugin(options: Options): Plugin {
	return {
		name: 'add-banner',
		renderChunk(code, chunk, { sourcemap }) {
			const ms = new MagicString(`${options.content}\n${code}`)
			return {
				code: ms.toString(),
				map: sourcemap ? ms.generateMap({ hires: true }) : null
			}
		}
	}
}
