var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var CopyWebPackPlugin = require('copy-webpack-plugin');
var DtsBundlerPlugin = require('dtsbundler-webpack-plugin');

var subModules = fs.readdirSync(path.join(__dirname, "lib")).filter(function (file) {
    return (file.slice(-3) == ".ts");
});
var entry = {};

for (var i = 0; i < subModules.length; i++) {
    var name = subModules[i].split('.')[0];
    entry[String(name)] = [path.join(__dirname, "lib", subModules[i])];
}

entry['awayjs-full'] = ['./index'];

module.exports = {

    entry: entry,
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, "dist"),
        filename: 'lib/[name].js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: "[name]"
    },
    resolve: {
        alias: {
            "awayjs-core": "awayjs-core/dist",
			"awayjs-display": "awayjs-display/dist",
			"awayjs-stagegl": "awayjs-stagegl/dist",
			"awayjs-renderergl": "awayjs-renderergl/dist",
			"awayjs-methodmaterials": "awayjs-methodmaterials/dist",
			"awayjs-player": "awayjs-player/dist",
			"awayjs-parsers": "awayjs-parsers/dist"
        },
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        fallback: [path.join(__dirname, 'node_modules')]
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
        fallback: [path.join(__dirname, 'node_modules')]
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by `awesome-typescript-loader`
            { test: /\.ts(x?)$/, loader: require.resolve('awesome-typescript-loader')},

            // all files with a `.js` or `.jsx` extension will be handled by `source-map-loader`
            { test: /\.js(x?)$/, loader: require.resolve('source-map-loader') }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name:'awayjs-full', filename:'index.js'}),
        new CopyWebPackPlugin([
            { from: "./package.json" },
            { from: "./README.md" }
        ])
    ]
};