var path = require("path");

module.exports = {
    entry: ['./index.ts'],
    output: {
        filename: './dist/awayjs-full.js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: "awayjs-full"
    },
    //turn on sourcemaps
    devtool: 'source-map',
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        fallback: [path.join(__dirname, 'node_modules')]
    },
    resolveLoader: {
        fallback: [path.join(__dirname, 'node_modules')]
    },
    module: {
        loaders: [
            // all files with a `.ts` or `.tsx` extension will be handled by 'awesome-typescript-loader'
            { test: /\.ts(x?)$/, loader: require.resolve('awesome-typescript-loader') }
        ]
    }
}