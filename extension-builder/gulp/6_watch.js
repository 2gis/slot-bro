// start only when --watch
module.exports = function(gulp, plugins, config) {


    gulp.task('webpack.watch', function(cb) {
        config.webpackCompiler.watch({
            aggregateTimeout: 300,
            poll: true
        });
    });
};
