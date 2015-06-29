var webpack = require('webpack');
var _ = require('lodash');

module.exports = function(baseConf) {
    return {
        devtool: '#inline-source-map',
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
                    test: /\.hbs$/,
                    loader: 'handlebars-loader',
                    query: {
                        helperDirs: [
                            baseConf.webpack.base + 'src/helpers/handlebars',
                            baseConf.webpack.base + 'app/src/helpers/handlebars'
                        ]
                    }
                },
                {
                    test: /\.(jpg|png|gif|woff)$/,
                    loader: 'file-loader'
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
                base: __dirname + '/../../src/base',
                app: __dirname + '/../../src/base/application'
            }
        },

        plugins: _.compact([
            new webpack.optimize.CommonsChunkPlugin('commons.chunk.js', ['background', 'content', 'popup']),
            new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.chunk.js'),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        ])
    };
};
