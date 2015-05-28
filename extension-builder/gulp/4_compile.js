var _ = require('lodash');

module.exports = function(gulp, plugins, config) {
    var webpackConfig = require(__dirname + '/../build-config/webpack.config')(config);
    var compiler = plugins.webpack(webpackConfig);

    gulp.task('webpack.compile', function (cb) {
        compiler.run(function(err, stats) {
            if (err) {
                throw new plugins.util.PluginError("webpack", err);
            }
            plugins.util.log("[webpack]", stats.toString({}));
            cb();
        });
    });
};
