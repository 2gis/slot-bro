var _ = require('lodash');

module.exports = function(gulp, plugins, config) {
    var webpackConfig = require(__dirname + '/../build-config/webpack.config')(config);
    config.webpackCompiler =  plugins.webpack(webpackConfig);

    gulp.task('webpack.compile', function (cb) {
        config.webpackCompiler.run(function(err, stats) {
            if (err) {
                throw new plugins.util.PluginError("webpack", err);
            }
            plugins.util.log("[webpack]", stats.toString({}));
            cb();
        });
    });
};
