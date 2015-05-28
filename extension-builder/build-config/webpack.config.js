var webpack = require('webpack');

module.exports = function(baseConf) {
    return {
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                    query: {
                        optional: ['runtime'],
                        stage: 0
                    }
                },
                {
                    test: /\.less$/,
                    loader: "style!css!less"
                },
                {
                    test: /\.(jpg|png|gif|woff)$/,
                    loader: "file-loader"
                }
            ]
        },

        entry: baseConf.webpack.entryPoints,
        context: baseConf.webpack.base,

        output: {
            path: baseConf.webpack.outputPath,
            // Make sure to use [name] or [id] in output.filename
            // when using multiple entry points
            filename: '[name].js', // bundle
            chunkFilename: '[id].chunk.js',
            sourceMapFilename: '[file].map'
        },

        resolve: {
            alias: {
                baseModule: __dirname + '/../../src/module.js',
                baseComponent: __dirname + '/../../src/component.js',
                app: __dirname + '/../../src/application.js'
            }
        },

        plugins: [
            new webpack.optimize.CommonsChunkPlugin('commons.chunk.js'),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        ]
    };
};
