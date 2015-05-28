// Build tasks for different browsers
module.exports = function(gulp, plugins, settings) {
    require('./build/chrome.js')(gulp, plugins, settings);
    require('./build/safari.js')(gulp, plugins, settings);
    require('./build/firefox.js')(gulp, plugins, settings);
    gulp.task('build.all', function(cb) {
        plugins.runSequence(
            'build.chrome',
            'build.firefox',
            'build.safari',
            cb
        );
    });
};
