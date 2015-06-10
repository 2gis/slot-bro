// Build tasks for different browsers
module.exports = function(gulp, plugins, config) {
    require('./build/chrome.js')(gulp, plugins, config);
    require('./build/safari.js')(gulp, plugins, config);
    require('./build/firefox.js')(gulp, plugins, config);
    gulp.task('build.all', function(cb) {
        plugins.runSequence(
            'build.chrome',
            'build.firefox',
            'build.safari',
            cb
        );
    });
};
