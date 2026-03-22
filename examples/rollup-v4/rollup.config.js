import addBanner from 'rollup-plugin-add-banner'

export default [
	// Example 1: Multi-output with different banners
	{
		input: 'src/index.js',
		output: [
			{ file: 'dist/index.cjs', format: 'cjs', sourcemap: true },
			{ file: 'dist/index.mjs', format: 'es', sourcemap: true }
		],
		plugins: [
			addBanner({
				banners: {
					'.cjs': '/*! ${name} v${version} - CommonJS */',
					'.mjs': '/*! ${name} v${version} - ES Module */'
				}
			})
		]
	},
	// Example 2: Multiple file types (JS + CSS)
	{
		input: 'src/index.js',
		output: [
			{ file: 'dist/bundle.js', format: 'es', sourcemap: true },
			{ file: 'dist/bundle.min.js', format: 'es', sourcemap: true }
		],
		plugins: [
			addBanner({
				content: '/*! ${name} v${version} | ${license} */',
				include: ['**/*.js'],
				exclude: ['**/*.min.js'] // Skip minified files
			})
		]
	}
]
