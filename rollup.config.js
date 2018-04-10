var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
	input: './dist/index.js',
	output: {
		name: 'AwayjsFull',
		sourcemap: true,
		format: 'umd',
		file: './bundle/awayjs-full.umd.js'
	},
	plugins: [
		nodeResolve({
			jsnext: true,
			main: true,
			module: true
		}),
		commonjs({
			include: /node_modules/
		}) ]
};