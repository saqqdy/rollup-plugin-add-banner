import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import addBanner from '../src/index'

describe('add-banner', () => {
	describe('plugin initialization', () => {
		it('should return plugin with correct name', () => {
			const plugin = addBanner({ content: '/* banner */' })
			expect(plugin.name).toBe('add-banner')
		})

		it('should have version', () => {
			const plugin = addBanner({ content: '/* banner */' })
			expect(plugin.version).toBe('2.0.1')
		})

		it('should have renderChunk hook', () => {
			const plugin = addBanner({ content: '/* banner */' })
			expect(plugin.renderChunk).toBeDefined()
			expect(typeof plugin.renderChunk).toBe('function')
		})

		it('should expose api', () => {
			const plugin = addBanner({ content: '/* banner */' })
			expect(plugin.api).toBeDefined()
			expect(typeof plugin.api.getBanner).toBe('function')
			expect(typeof plugin.api.getBanners).toBe('function')
			expect(typeof plugin.api.getVars).toBe('function')
			expect(typeof plugin.api.shouldAddBanner).toBe('function')
		})

		it('should work without options', () => {
			const plugin = addBanner()
			expect(plugin.name).toBe('add-banner')
		})
	})

	describe('renderChunk hook', () => {
		it('should add banner to the output', () => {
			const plugin = addBanner({ content: '/* My Banner */' })
			const code = 'console.log("hello")'

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toBe('/* My Banner */\nconsole.log("hello")')
		})

		it('should add banner even when facadeModuleId is undefined', () => {
			const plugin = addBanner({ content: '/* banner */' })

			const chunk = { facadeModuleId: undefined } as any
			const result = plugin.renderChunk!('console.log("hello")', chunk, { sourcemap: false })

			expect(result!.code).toBe('/* banner */\nconsole.log("hello")')
		})

		it('should handle multi-line banner', () => {
			const banner = `/*!
 * My Library v1.0.0
 * (c) 2024 Author
 * Released under the MIT License.
 */`
			const plugin = addBanner({ content: banner })
			const code = 'console.log("hello")'

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toContain('My Library v1.0.0')
			expect(result!.code).toContain('Released under the MIT License.')
		})

		it('should return null when banner is empty', () => {
			const plugin = addBanner({ content: '' })
			const code = 'console.log("hello")'

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result).toBeNull()
		})

		it('should return null when no banner configured', () => {
			const plugin = addBanner({})
			const code = 'console.log("hello")'

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result).toBeNull()
		})
	})

	describe('sourcemap generation', () => {
		it('should generate sourcemap when enabled', () => {
			const plugin = addBanner({ content: '/* banner */' })
			const code = 'console.log("hello")'

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: true })

			expect(result!.map).not.toBeNull()
			expect(result!.map).toHaveProperty('version')
			expect(result!.map).toHaveProperty('mappings')
		})

		it('should not generate sourcemap when disabled', () => {
			const plugin = addBanner({ content: '/* banner */' })
			const code = 'console.log("hello")'

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.map).toBeNull()
		})
	})

	describe('template variables', () => {
		 
		it('should resolve ${name} from package.json', () => {
			 
			const plugin = addBanner({ content: '/*! ${name} */' })
			const banner = plugin.api.getBanner()
			expect(banner).toContain('rollup-plugin-add-banner')
		})

		 
		it('should resolve ${version} from package.json', () => {
			 
			const plugin = addBanner({ content: '/*! v${version} */' })
			const banner = plugin.api.getBanner()
			expect(banner).toContain('v2.0.1')
		})

		it('should resolve custom vars', () => {
			const plugin = addBanner({
				 
				content: '/*! ${name} ${custom} */',
				vars: { custom: 'custom-value' }
			})
			const banner = plugin.api.getBanner()
			expect(banner).toContain('custom-value')
		})

		it('should handle unknown variables', () => {
			 
			const plugin = addBanner({ content: '/*! ${unknown} */' })
			const banner = plugin.api.getBanner()
			expect(banner).toBe('/*!  */')
		})

		it('should resolve author from string format', () => {
			const tempDir = join(tmpdir(), 'rollup-plugin-add-banner-test')
			mkdirSync(tempDir, { recursive: true })
			const pkgFile = join(tempDir, 'package.json')
			writeFileSync(pkgFile, JSON.stringify({ name: 'test', author: 'Test Author <test@test.com>' }))


			const plugin = addBanner({

				content: '/*! ${author} */',
				pkgPath: pkgFile
			})
			const banner = plugin.api.getBanner()

			expect(banner).toContain('Test Author')

			rmSync(tempDir, { recursive: true, force: true })
		})

		it('should resolve author from object format with name', () => {
			const tempDir = join(tmpdir(), 'rollup-plugin-add-banner-test')
			mkdirSync(tempDir, { recursive: true })
			const pkgFile = join(tempDir, 'package.json')
			writeFileSync(pkgFile, JSON.stringify({ name: 'test', author: { name: 'Object Author', email: 'test@test.com' } }))


			const plugin = addBanner({

				content: '/*! ${author} */',
				pkgPath: pkgFile
			})
			const banner = plugin.api.getBanner()

			expect(banner).toContain('Object Author')

			rmSync(tempDir, { recursive: true, force: true })
		})

		it('should resolve license from package.json', () => {
			 
			const plugin = addBanner({ content: '/*! License: ${license} */' })
			const banner = plugin.api.getBanner()
			expect(banner).toContain('MIT')
		})

		it('should merge package.json vars with custom vars', () => {
			const plugin = addBanner({
				 
				content: '/*! ${name} ${year} */',
				vars: { year: '2024' }
			})
			const vars = plugin.api.getVars()
			expect(vars.name).toBe('rollup-plugin-add-banner')
			expect(vars.year).toBe('2024')
		})
	})

	describe('include/exclude options', () => {
		it('should only process matching files with include', () => {
			const plugin = addBanner({
				content: '/* banner */',
				include: ['**/*.js']
			})
			const code = 'console.log("hello")'

			const jsChunk = { fileName: 'dist/index.js' } as any
			const mjsChunk = { fileName: 'dist/index.mjs' } as any

			const jsResult = plugin.renderChunk!(code, jsChunk, { sourcemap: false })
			const mjsResult = plugin.renderChunk!(code, mjsChunk, { sourcemap: false })

			expect(jsResult!.code).toContain('banner')
			expect(mjsResult).toBeNull()
		})

		it('should exclude files matching exclude pattern', () => {
			const plugin = addBanner({
				content: '/* banner */',
				exclude: ['**/*.min.js']
			})
			const code = 'console.log("hello")'

			const normalChunk = { fileName: 'dist/index.js' } as any
			const minChunk = { fileName: 'dist/index.min.js' } as any

			const normalResult = plugin.renderChunk!(code, normalChunk, { sourcemap: false })
			const minResult = plugin.renderChunk!(code, minChunk, { sourcemap: false })

			expect(normalResult!.code).toContain('banner')
			expect(minResult).toBeNull()
		})

		it('should handle exclude as string', () => {
			const plugin = addBanner({
				content: '/* banner */',
				exclude: '**/*.min.js'
			})
			const code = 'console.log("hello")'

			const normalChunk = { fileName: 'dist/index.js' } as any
			const minChunk = { fileName: 'dist/index.min.js' } as any

			const normalResult = plugin.renderChunk!(code, normalChunk, { sourcemap: false })
			const minResult = plugin.renderChunk!(code, minChunk, { sourcemap: false })

			expect(normalResult!.code).toContain('banner')
			expect(minResult).toBeNull()
		})

		it('should handle string include option', () => {
			const plugin = addBanner({
				content: '/* banner */',
				include: '**/*.js'
			})
			const code = 'console.log("hello")'

			const chunk = { fileName: 'dist/index.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toContain('banner')
		})

		it('should handle prefix match for include', () => {
			const plugin = addBanner({
				content: '/* banner */',
				include: ['src/**']
			})
			const code = 'console.log("hello")'

			const includedChunk = { fileName: 'src/index.js' } as any
			const excludedChunk = { fileName: 'lib/index.js' } as any

			const includedResult = plugin.renderChunk!(code, includedChunk, { sourcemap: false })
			const excludedResult = plugin.renderChunk!(code, excludedChunk, { sourcemap: false })

			expect(includedResult!.code).toContain('banner')
			expect(excludedResult).toBeNull()
		})

		it('should handle directory match pattern', () => {
			const plugin = addBanner({
				content: '/* banner */',
				exclude: ['**/node_modules/**']
			})
			const code = 'console.log("hello")'

			const normalChunk = { fileName: 'dist/index.js' } as any
			const nodeModulesChunk = { fileName: 'node_modules/pkg/index.js' } as any

			const normalResult = plugin.renderChunk!(code, normalChunk, { sourcemap: false })
			const nodeModulesResult = plugin.renderChunk!(code, nodeModulesChunk, { sourcemap: false })

			expect(normalResult!.code).toContain('banner')
			expect(nodeModulesResult).toBeNull()
		})

		it('should handle wildcard pattern', () => {
			const plugin = addBanner({
				content: '/* banner */',
				include: ['*.min.js']
			})
			const code = 'console.log("hello")'

			const minChunk = { fileName: 'index.min.js' } as any
			const normalChunk = { fileName: 'index.js' } as any

			const minResult = plugin.renderChunk!(code, minChunk, { sourcemap: false })
			const normalResult = plugin.renderChunk!(code, normalChunk, { sourcemap: false })

			expect(minResult!.code).toContain('banner')
			expect(normalResult).toBeNull()
		})

		it('should handle both include and exclude', () => {
			const plugin = addBanner({
				content: '/* banner */',
				include: ['**/*.js'],
				exclude: ['**/*.min.js']
			})
			const code = 'console.log("hello")'

			const normalChunk = { fileName: 'dist/index.js' } as any
			const minChunk = { fileName: 'dist/index.min.js' } as any
			const cssChunk = { fileName: 'dist/style.css' } as any

			const normalResult = plugin.renderChunk!(code, normalChunk, { sourcemap: false })
			const minResult = plugin.renderChunk!(code, minChunk, { sourcemap: false })
			const cssResult = plugin.renderChunk!(code, cssChunk, { sourcemap: false })

			expect(normalResult!.code).toContain('banner')
			expect(minResult).toBeNull()
			expect(cssResult).toBeNull()
		})

		it('should handle exclude as array', () => {
			const plugin = addBanner({
				content: '/* banner */',
				exclude: ['**/*.min.js', '**/*.test.js']
			})
			const code = 'console.log("hello")'

			const normalChunk = { fileName: 'dist/index.js' } as any
			const minChunk = { fileName: 'dist/index.min.js' } as any
			const testChunk = { fileName: 'dist/index.test.js' } as any

			const normalResult = plugin.renderChunk!(code, normalChunk, { sourcemap: false })
			const minResult = plugin.renderChunk!(code, minChunk, { sourcemap: false })
			const testResult = plugin.renderChunk!(code, testChunk, { sourcemap: false })

			expect(normalResult!.code).toContain('banner')
			expect(minResult).toBeNull()
			expect(testResult).toBeNull()
		})

		it('should handle exact match pattern', () => {
			const plugin = addBanner({
				content: '/* banner */',
				include: ['dist/index.js']
			})
			const code = 'console.log("hello")'

			const exactChunk = { fileName: 'dist/index.js' } as any
			const otherChunk = { fileName: 'dist/other.js' } as any

			const exactResult = plugin.renderChunk!(code, exactChunk, { sourcemap: false })
			const otherResult = plugin.renderChunk!(code, otherChunk, { sourcemap: false })

			expect(exactResult!.code).toContain('banner')
			expect(otherResult).toBeNull()
		})
	})

	describe('multiple banners', () => {
		it('should use different banners for different file types', () => {
			const plugin = addBanner({
				content: '/* default banner */',
				banners: {
					'.js': '/* JS banner */',
					'.css': '/* CSS banner */'
				}
			})
			const code = 'console.log("hello")'

			const jsChunk = { fileName: 'dist/index.js' } as any
			const cssChunk = { fileName: 'dist/style.css' } as any
			const mjsChunk = { fileName: 'dist/index.mjs' } as any

			const jsResult = plugin.renderChunk!(code, jsChunk, { sourcemap: false })
			const cssResult = plugin.renderChunk!(code, cssChunk, { sourcemap: false })
			const mjsResult = plugin.renderChunk!(code, mjsChunk, { sourcemap: false })

			expect(jsResult!.code).toContain('JS banner')
			expect(cssResult!.code).toContain('CSS banner')
			expect(mjsResult!.code).toContain('default banner')
		})

		it('should resolve template variables in banners', () => {
			const plugin = addBanner({
				banners: {

					'.js': '/*! ${name} ${version} */'
				}
			})

			const banners = plugin.api.getBanners()
			expect(banners!['.js']).toContain('rollup-plugin-add-banner')
		})

		it('should match banners by pattern (not just extension)', () => {
			const plugin = addBanner({
				content: '/* default */',
				banners: {
					'min.js': '/* minified banner */',
					'bundle': '/* bundle banner */'
				}
			})
			const code = 'console.log("hello")'

			const minChunk = { fileName: 'dist/index.min.js' } as any
			const bundleChunk = { fileName: 'dist/bundle.js' } as any
			const otherChunk = { fileName: 'dist/index.js' } as any

			const minResult = plugin.renderChunk!(code, minChunk, { sourcemap: false })
			const bundleResult = plugin.renderChunk!(code, bundleChunk, { sourcemap: false })
			const otherResult = plugin.renderChunk!(code, otherChunk, { sourcemap: false })

			expect(minResult!.code).toContain('minified banner')
			expect(bundleResult!.code).toContain('bundle banner')
			expect(otherResult!.code).toContain('default')
		})

		it('should match banners by wildcard pattern', () => {
			const plugin = addBanner({
				content: '/* default */',
				banners: {
					'*.min.js': '/* minified banner */'
				}
			})
			const code = 'console.log("hello")'

			const minChunk = { fileName: 'index.min.js' } as any
			const normalChunk = { fileName: 'index.js' } as any

			const minResult = plugin.renderChunk!(code, minChunk, { sourcemap: false })
			const normalResult = plugin.renderChunk!(code, normalChunk, { sourcemap: false })

			expect(minResult!.code).toContain('minified banner')
			expect(normalResult!.code).toContain('default')
		})
	})

	describe('file option', () => {
		it('should read banner from file', () => {
			const tempDir = join(tmpdir(), 'rollup-plugin-add-banner-test')
			mkdirSync(tempDir, { recursive: true })
			const bannerFile = join(tempDir, 'banner.txt')
			writeFileSync(bannerFile, '/* Banner from file */')

			const plugin = addBanner({ file: bannerFile })
			const banner = plugin.api.getBanner()

			expect(banner).toBe('/* Banner from file */')

			rmSync(tempDir, { recursive: true, force: true })
		})

		it('should warn when file not found', () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			const plugin = addBanner({ file: '/non/existent/file.txt' })
			const banner = plugin.api.getBanner()

			expect(warnSpy).toHaveBeenCalled()
			expect(banner).toBe('')

			warnSpy.mockRestore()
		})

		it('should override content option', () => {
			const tempDir = join(tmpdir(), 'rollup-plugin-add-banner-test')
			mkdirSync(tempDir, { recursive: true })
			const bannerFile = join(tempDir, 'banner.txt')
			writeFileSync(bannerFile, '/* From File */')

			const plugin = addBanner({
				content: '/* From Content */',
				file: bannerFile
			})
			const banner = plugin.api.getBanner()

			expect(banner).toBe('/* From File */')

			rmSync(tempDir, { recursive: true, force: true })
		})

		it('should resolve template vars from file content', () => {
			const tempDir = join(tmpdir(), 'rollup-plugin-add-banner-test')
			mkdirSync(tempDir, { recursive: true })
			const bannerFile = join(tempDir, 'banner.txt')
			 
			writeFileSync(bannerFile, '/*! ${name} v${version} */')

			const plugin = addBanner({ file: bannerFile })
			const banner = plugin.api.getBanner()

			expect(banner).toContain('rollup-plugin-add-banner')
			expect(banner).toContain('v2.0.1')

			rmSync(tempDir, { recursive: true, force: true })
		})

		it('should trim whitespace from file content', () => {
			const tempDir = join(tmpdir(), 'rollup-plugin-add-banner-test')
			mkdirSync(tempDir, { recursive: true })
			const bannerFile = join(tempDir, 'banner.txt')
			writeFileSync(bannerFile, '  /* banner */  \n')

			const plugin = addBanner({ file: bannerFile })
			const banner = plugin.api.getBanner()

			expect(banner).toBe('/* banner */')

			rmSync(tempDir, { recursive: true, force: true })
		})
	})

	describe('pkgPath option', () => {
		it('should read package.json from custom path', () => {
			const tempDir = join(tmpdir(), 'rollup-plugin-add-banner-test')
			mkdirSync(tempDir, { recursive: true })
			const pkgFile = join(tempDir, 'package.json')
			writeFileSync(pkgFile, JSON.stringify({ name: 'custom-pkg', version: '3.0.0' }))

			 
			const plugin = addBanner({
				content: '/*! ${name} v${version} */',
				pkgPath: pkgFile
			})
			const banner = plugin.api.getBanner()

			expect(banner).toContain('custom-pkg')
			expect(banner).toContain('v3.0.0')

			rmSync(tempDir, { recursive: true, force: true })
		})

		it('should handle missing package.json gracefully', () => {
			const plugin = addBanner({
				 
				content: '/*! ${name} */',
				pkgPath: '/non/existent/package.json'
			})
			const banner = plugin.api.getBanner()

			expect(banner).toBe('/*!  */')
		})

		it('should handle invalid JSON in package.json', () => {
			const tempDir = join(tmpdir(), 'rollup-plugin-add-banner-test')
			mkdirSync(tempDir, { recursive: true })
			const pkgFile = join(tempDir, 'package.json')
			writeFileSync(pkgFile, 'invalid json')

			const plugin = addBanner({

				content: '/*! ${name} */',
				pkgPath: pkgFile
			})
			const banner = plugin.api.getBanner()

			expect(banner).toBe('/*!  */')

			rmSync(tempDir, { recursive: true, force: true })
		})

		it('should handle package.json with missing name', () => {
			const tempDir = join(tmpdir(), 'rollup-plugin-add-banner-test')
			mkdirSync(tempDir, { recursive: true })
			const pkgFile = join(tempDir, 'package.json')
			writeFileSync(pkgFile, JSON.stringify({ version: '1.0.0' }))


			const plugin = addBanner({

				content: '/*! ${name} v${version} */',
				pkgPath: pkgFile
			})
			const banner = plugin.api.getBanner()

			expect(banner).toBe('/*!  v1.0.0 */')

			rmSync(tempDir, { recursive: true, force: true })
		})
	})

	describe('environment variable', () => {
		it('should add banner when env var matches', () => {
			process.env.BANNER_ENABLED = 'true'

			const plugin = addBanner({
				content: '/* banner */',
				envVar: 'BANNER_ENABLED'
			})
			const code = 'console.log("hello")'

			const chunk = { fileName: 'dist/index.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toContain('banner')

			delete process.env.BANNER_ENABLED
		})

		it('should skip banner when env var does not match', () => {
			process.env.BANNER_ENABLED = 'false'

			const plugin = addBanner({
				content: '/* banner */',
				envVar: 'BANNER_ENABLED'
			})
			const code = 'console.log("hello")'

			const chunk = { fileName: 'dist/index.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result).toBeNull()

			delete process.env.BANNER_ENABLED
		})

		it('should use custom env value', () => {
			process.env.NODE_ENV = 'production'

			const plugin = addBanner({
				content: '/* banner */',
				envVar: 'NODE_ENV',
				envValue: 'production'
			})
			const code = 'console.log("hello")'

			const chunk = { fileName: 'dist/index.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toContain('banner')
		})

		it('should skip when env var not set', () => {
			delete process.env.UNDEFINED_VAR

			const plugin = addBanner({
				content: '/* banner */',
				envVar: 'UNDEFINED_VAR'
			})
			const code = 'console.log("hello")'

			const chunk = { fileName: 'dist/index.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result).toBeNull()
		})
	})

	describe('plugin api', () => {
		it('should get banner via api', () => {
			const plugin = addBanner({ content: '/* test banner */' })
			expect(plugin.api.getBanner()).toBe('/* test banner */')
		})

		it('should get banners via api', () => {
			const plugin = addBanner({
				content: '/* default */',
				banners: { '.js': '/* js */' }
			})
			const banners = plugin.api.getBanners()
			expect(banners).toEqual({ '.js': '/* js */' })
		})

		it('should get vars via api', () => {
			const plugin = addBanner({
				content: '/* banner */',
				vars: { custom: 'value' }
			})
			const vars = plugin.api.getVars()
			expect(vars.custom).toBe('value')
		})

		it('should check shouldAddBanner via api', () => {
			const plugin = addBanner({ content: '/* banner */' })
			expect(plugin.api.shouldAddBanner()).toBeTruthy()
		})

		it('should return undefined banners when not configured', () => {
			const plugin = addBanner({ content: '/* banner */' })
			expect(plugin.api.getBanners()).toBeUndefined()
		})
	})

	describe('edge cases', () => {
		it('should handle empty code', () => {
			const plugin = addBanner({ content: '/* banner */' })
			const code = ''

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toBe('/* banner */\n')
		})

		it('should handle code with existing comments', () => {
			const plugin = addBanner({ content: '/* banner */' })
			const code = '/* existing comment */\nconsole.log("hello")'

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toBe('/* banner */\n/* existing comment */\nconsole.log("hello")')
		})

		it('should handle code with shebang', () => {
			const plugin = addBanner({ content: '/* banner */' })
			const code = '#!/usr/bin/env node\nconsole.log("hello")'

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toBe('/* banner */\n#!/usr/bin/env node\nconsole.log("hello")')
		})

		it('should handle special characters in banner', () => {
			const plugin = addBanner({ content: '/*! @license MIT © 2024 */' })
			const code = 'console.log("hello")'

			const chunk = { facadeModuleId: '/path/to/test.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toBe('/*! @license MIT © 2024 */\nconsole.log("hello")')
		})

		it('should handle fileName instead of facadeModuleId', () => {
			const plugin = addBanner({
				content: '/* banner */',
				include: ['dist/**']
			})
			const code = 'console.log("hello")'

			const chunk = { fileName: 'dist/index.js' } as any
			const result = plugin.renderChunk!(code, chunk, { sourcemap: false })

			expect(result!.code).toContain('banner')
		})
	})
})
