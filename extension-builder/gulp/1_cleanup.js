// Cleanup tasks
module.exports = function(gulp, plugins, config) {
    gulp.task('cleanup.buildDir', function() {
        return gulp.src(config.tmpBuildDir, {read: false})
            .pipe(plugins.clean());
    });

    gulp.task('cleanup.webpackDir', function() {
        return gulp.src(config.webpack.outputPath, {read: false})
            .pipe(plugins.clean());
    });

    gulp.task('cleanup.outputDir', function() {
        return gulp.src(config.packagesDir, {read: false})
            .pipe(plugins.clean());
    });
};
