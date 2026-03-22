import addBanner from 'rollup-plugin-add-banner'

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/index.js',
		format: 'es',
		sourcemap: true
	},
	plugins: [
		// Simple example: using template variables
		addBanner({
			content: '/*! ${name} v${version} (c) ${author} | ${license} license */'
		})
	]
}
