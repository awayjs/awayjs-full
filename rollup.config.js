var includePaths = require('rollup-plugin-includepaths');

module.exports = {
	entry: './index.js',
	sourceMap: true,
	format: 'umd',
	moduleName: 'AwayjsFull',
	targets: [
		{ dest: './bundle/awayjs-full.umd.js'}
	],
	plugins: [
		includePaths({
			include : {
				"tslib": "./node_modules/tslib/tslib.es6.js",
				"@awayjs/core": "./node_modules/@awayjs/core/dist/index.js",
				"@awayjs/graphics": "./node_modules/@awayjs/graphics/dist/index.js",
				"@awayjs/scene": "./node_modules/@awayjs/scene/dist/index.js",
				"@awayjs/stage": "./node_modules/@awayjs/stage/dist/index.js",
				"@awayjs/renderer": "./node_modules/@awayjs/renderer/dist/index.js",
				"@awayjs/view": "./node_modules/@awayjs/view/dist/index.js",
				"@awayjs/materials": "./node_modules/@awayjs/materials/dist/index.js",
				"@awayjs/player": "./node_modules/@awayjs/player/dist/index.js",
				"@awayjs/parsers": "./node_modules/@awayjs/parsers/dist/index.js"
			}
		}) ]
};