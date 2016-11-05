var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

var subModules = fs.readdirSync(path.join(__dirname, "lib")).filter(function (file) {
    return (file.slice(-3) == ".ts");
});
var entry = {};

for (var i = 0; i < subModules.length; i++) {
    var name = subModules[i].split('.')[0];
    entry[String(name)] = [path.join(__dirname, "lib", subModules[i])];
}

entry['awayjs-full'] = ['./index'];
entry['awayjs-full/lib/core'] = ['./index'];
entry['@awayjs/core'] = ['@awayjs/core'];
entry['@awayjs/graphics'] = ['@awayjs/graphics'];
entry['@awayjs/materials'] = ['@awayjs/materials'];
entry['@awayjs/parsers'] = ['@awayjs/parsers'];
entry['@awayjs/player'] = ['@awayjs/player'];
entry['@awayjs/renderer'] = ['@awayjs/renderer'];
entry['@awayjs/scene'] = ['@awayjs/scene'];
entry['@awayjs/stage'] = ['@awayjs/stage'];


module.exports = {

    entry: entry,
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, "bundles"),
        filename: 'lib/[name].js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: "[name]"
    },
    resolve: {
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
            { test: /\.ts(x?)$/, loader: require.resolve('awesome-typescript-loader')}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name:'@awayjs/core', filename:'@awayjs/core.js'})
    ]
};