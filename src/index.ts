import type { Plugin, RenderChunkHook, SourceMapInput } from 'rollup'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import MagicString from 'magic-string'

export interface Options {
	/**
	 * Banner content to prepend to the output.
	 * Supports template variables: ${name}, ${version}, ${author}, ${license}
	 */
	content?: string
	/**
	 * Path to a file containing the banner content.
	 * If provided, overrides `content` option.
	 */
	file?: string
	/**
	 * Custom template variables.
	 * Merged with package.json info.
	 */
	vars?: Record<string, string>
	/**
	 * Include pattern for files to process.
	 * Supports glob patterns like "*.js" or "src/**".
	 * @default process all files
	 */
	include?: string | string[]
	/**
	 * Exclude pattern for files to skip.
	 * Supports glob patterns.
	 * @default []
	 */
	exclude?: string | string[]
	/**
	 * Multiple banners for different file types.
	 * Key is file extension or pattern, value is banner content.
	 * Example: { '.js': '/* JS Banner *\/', '.css': '/* CSS Banner *\/' }
	 */
	banners?: Record<string, string>
	/**
	 * Environment variable to check for conditional banner.
	 * If set, only add banner when process.env[envVar] matches envValue.
	 */
	envVar?: string
	/**
	 * Expected value for the environment variable.
	 * @default 'true'
	 */
	envValue?: string
	/**
	 * Path to package.json for reading variables.
	 * @default 'package.json' (current directory)
	 */
	pkgPath?: string
}

interface PkgInfo {
	name: string
	version: string
	author: string
	license: string
	[key: string]: string
}

const PACKAGE_VERSION = '2.0.0'

/**
 * Creates a filter function from include/exclude patterns.
 */
function createFilter(
	include: string | string[] | undefined,
	exclude: string | string[] | undefined
): (id: string) => boolean {
	const includePatterns = include ? (Array.isArray(include) ? include : [include]) : null
	const excludePatterns = exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : null

	/**
	 * Check if a pattern matches the given id
	 */
	function matchPattern(pattern: string, id: string): boolean {
		// Exact match
		if (id === pattern) return true
		// Extension match (e.g., **/*.js)
		if (pattern.startsWith('**/*.') && id.endsWith(pattern.slice(4))) return true
		// Prefix match (e.g., src/**)
		if (pattern.endsWith('/**') && id.startsWith(pattern.slice(0, -3))) return true
		// Directory contains match (e.g., **/node_modules/**)
		if (pattern.startsWith('**/') && pattern.endsWith('/**')) {
			const segment = pattern.slice(3, -3)
			return id.includes(`/${segment}/`) || id.startsWith(`${segment}/`)
		}
		// Wildcard match
		if (pattern.includes('*')) {
			return patternToRegex(pattern).test(id)
		}
		// Plain string match
		return id.includes(`/${pattern}/`) || id.includes(pattern)
	}

	return (id: string) => {
		// Check exclude first
		if (excludePatterns) {
			for (const pattern of excludePatterns) {
				if (matchPattern(pattern, id)) return false
			}
		}

		// Check include
		if (includePatterns) {
			for (const pattern of includePatterns) {
				if (matchPattern(pattern, id)) return true
			}
			return false
		}

		return true
	}
}

/**
 * Converts a glob pattern to RegExp.
 */
function patternToRegex(pattern: string): RegExp {
	const regex = pattern
		.replace(/\*\*\//g, '<<DOUBLE_STAR_SLASH>>')
		.replace(/\*\*/g, '<<DOUBLE_STAR>>')
		.replace(/\*/g, '[^/]*')
		.replace(/<<DOUBLE_STAR_SLASH>>/g, '(.*\\/)?')
		.replace(/<<DOUBLE_STAR>>/g, '.*')
		.replace(/\?/g, '[^/]')
		.replace(/\./g, '\\.')
		.replace(/\//g, '\\/')
	return new RegExp(`^${regex}$`)
}

/**
 * Reads package.json and returns relevant info.
 */
function readPkgInfo(pkgPath: string): PkgInfo {
	const path = resolve(pkgPath)
	if (!existsSync(path)) {
		return { name: '', version: '', author: '', license: '' }
	}
	try {
		const pkg = JSON.parse(readFileSync(path, 'utf-8'))
		return {
			name: pkg.name || '',
			version: pkg.version || '',
			author: typeof pkg.author === 'string' ? pkg.author : pkg.author?.name || '',
			license: pkg.license || '',
			...pkg
		}
	} catch {
		return { name: '', version: '', author: '', license: '' }
	}
}

/**
 * Resolves template variables in a string.
 */
function resolveTemplateVars(str: string, vars: Record<string, string>): string {
	return str.replace(/\$\{(\w+)\}/g, (_, key) => vars[key] || '')
}

/**
 * Gets banner for a specific file based on banners map.
 */
function getBannerForFile(
	fileName: string,
	banners: Record<string, string> | undefined,
	defaultBanner: string
): string {
	if (!banners) return defaultBanner

	// Check by extension
	for (const [key, banner] of Object.entries(banners)) {
		if (key.startsWith('.') && fileName.endsWith(key)) {
			return banner
		}
		// Check by pattern
		if (!key.startsWith('.') && matchPatternSimple(key, fileName)) {
			return banner
		}
	}

	return defaultBanner
}

/**
 * Simple pattern matching for banners.
 */
function matchPatternSimple(pattern: string, id: string): boolean {
	if (pattern.includes('*')) {
		return patternToRegex(pattern).test(id)
	}
	return id.includes(pattern)
}

/**
 * A Rollup plugin that adds banner to the output bundle.
 *
 * @param options - Plugin configuration options
 * @returns A Rollup plugin instance
 *
 * @example
 * ```js
 * import addBanner from 'rollup-plugin-add-banner'
 *
 * export default {
 *   plugins: [
 *     addBanner({
 *       content: '/*! ${name} v${version} *\/'
 *     })
 *   ]
 * }
 * ```
 */
export default function addBannerPlugin(options: Options = {}): Plugin {
	const filter = createFilter(options.include, options.exclude)
	const pkgInfo = readPkgInfo(options.pkgPath || 'package.json')

	// Check environment condition
	const shouldAddBanner = (): boolean => {
		if (!options.envVar) return true
		const envValue = process.env[options.envVar]
		const expectedValue = options.envValue ?? 'true'
		return envValue === expectedValue
	}

	// Get default banner content
	const getDefaultBanner = (): string => {
		if (options.file) {
			const filePath = resolve(options.file)
			if (existsSync(filePath)) {
				return readFileSync(filePath, 'utf-8').trim()
			}
			console.warn(`[rollup-plugin-add-banner] Banner file not found: ${filePath}`)
			return ''
		}
		return options.content || ''
	}

	// Merge variables: pkgInfo + custom vars
	const vars: Record<string, string> = {
		...pkgInfo,
		...options.vars
	}

	const defaultBanner = getDefaultBanner()
	const resolvedDefaultBanner = resolveTemplateVars(defaultBanner, vars)

	// Resolve banners map
	const resolvedBanners: Record<string, string> | undefined = options.banners
		? Object.fromEntries(
				Object.entries(options.banners).map(([key, banner]) => [key, resolveTemplateVars(banner, vars)])
			)
		: undefined

	const renderChunk: RenderChunkHook = (code, chunk, { sourcemap }) => {
		// Check environment condition
		if (!shouldAddBanner()) return null

		const fileName = chunk.fileName || chunk.facadeModuleId || ''

		// Check filter
		if (fileName && !filter(fileName)) return null

		// Get banner for this file
		const banner = getBannerForFile(fileName, resolvedBanners, resolvedDefaultBanner)
		if (!banner) return null

		const ms = new MagicString(code)
		ms.prepend(`${banner}\n`)

		return {
			code: ms.toString(),
			map: sourcemap ? (ms.generateMap({ hires: true }) as SourceMapInput) : null
		}
	}

	// Plugin API for external access
	const api = {
		getBanner: () => resolvedDefaultBanner,
		getBanners: () => resolvedBanners,
		getVars: () => ({ ...vars }),
		shouldAddBanner
	}

	return {
		name: 'add-banner',
		version: PACKAGE_VERSION,
		renderChunk,
		api
	}
}

// Export types
export interface PluginApi {
	getBanner: () => string
	getBanners: () => Record<string, string> | undefined
	getVars: () => Record<string, string>
	shouldAddBanner: () => boolean
}
