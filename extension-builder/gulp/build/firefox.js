var _ = require('lodash');

// Firefox ext builder
module.exports = function(gulp, plugins, config) {
    var common = require('./common')(plugins, config);

    gulp.task('build.firefox.makeBackgroundHtml', function(cb) {
        common.writeFile('firefox', 'background', cb);
    });
    gulp.task('build.firefox.makePopupHtml', function(cb) {
        common.writeFile('firefox', 'popup', cb);
    });
    gulp.task('build.firefox.makeExtensionInfoJson', function(cb) {
        common.writeFile('firefox', 'extension_info', cb);
    });
    gulp.task('build.firefox.makeInstallRdf', function(cb) {
        common.writeFile('firefox', 'install', cb);
    });
    gulp.task('build.firefox.makeChromeManifest', function(cb) {
        common.writeFile('firefox', 'chrome', cb);
    });
    gulp.task('build.firefox.copyStatic', function(cb) {
        common.copyStatic(config.firefox.buildDir + '/static/', cb);
    });
    gulp.task('build.firefox.prepareToolbarIcons', function(cb) {
        common.prepareToolbarIconsInPlace(config.firefox.buildDir + '/static/', 'rgb', cb);
    });
    gulp.task('build.firefox.copyJs', function(cb) {
        common.copyJs(config.firefox.buildDir + '/js/', cb);
    });

    gulp.task('build.firefox', function(cb) {
        plugins.runSequence(
            'build.firefox.copyStatic',
            'build.firefox.copyJs',
            'build.firefox.prepareToolbarIcons',
            'build.firefox.makeInstallRdf',
            'build.firefox.makeExtensionInfoJson',
            'build.firefox.makeChromeManifest',
            'build.firefox.makeBackgroundHtml',
            'build.firefox.makePopupHtml',
            cb
        );
    });
};
