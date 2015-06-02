// start only when --watch
module.exports = function(gulp, plugins, config) {


    gulp.task('webpack.watch', function(cb) {
        config.webpackCompiler.watch({
            aggregateTimeout: 300,
            poll: true
        }, function(err, stats){
            if (err) {
                throw new plugins.util.PluginError("webpack", err);
            }
            plugins.util.log("[webpack]", stats.toString({}));
        });

        plugins.exec('node server.js', {}, function(err) {
            if (err) cb(err);
        });
    });
};
