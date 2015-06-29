module.exports = function(gulp, plugins, config) {
    var webpackConfig = require(__dirname + '/../build-config/webpack.config')(config);
    config.webpackCompiler = plugins.webpack(webpackConfig);

    gulp.task('webpack.compile', function(cb) {
        config.webpackCompiler.run(function(err, stats) {
            if (err) {
                throw new plugins.util.PluginError("webpack", err);
            }
            plugins.util.log("[webpack]", stats.toString({}));
            cb();
        });
    });

    gulp.task('style.compile', function() {
        return gulp.src(config.less.sources)
            .pipe(plugins.less())
            .pipe(plugins.concat('bundle.css'))
            .pipe(gulp.dest(config.staticDir + 'css'));
    });
};
