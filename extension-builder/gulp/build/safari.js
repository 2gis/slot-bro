var _ = require('lodash');

// Safari ext builder
module.exports = function(gulp, plugins, config) {
    var common = require('./common')(plugins, config);

    gulp.task('build.safari.makeBackgroundHtml', function(cb) {
        common.writeFile('safari', 'background', cb);
    });
    gulp.task('build.safari.makePopupHtml', function(cb) {
        common.writeFile('safari', 'popup', cb);
    });
    gulp.task('build.safari.makeExtensionInfoJson', function(cb) {
        common.writeFile('safari', 'extension_info', cb);
    });
    gulp.task('build.safari.makeInfoPlist', function(cb) {
        common.writeFile('safari', 'Info', cb);
    });
    gulp.task('build.safari.copyStatic', function(cb) {
        common.copyStatic(config.safari.buildDir + '/static/', cb);
    });
    gulp.task('build.safari.prepareToolbarIcons', function(cb) {
        common.prepareToolbarIconsInPlace(config.safari.buildDir + '/static/', 'black', cb);
    });
    gulp.task('build.safari.moveMainIcon', function(cb) {
        plugins.fsEx.move(config.safari.mainIcon, config.safari.buildDir + '/icon.png', cb);
    });
    gulp.task('build.safari.copyJs', function(cb) {
        common.copyJs(config.safari.buildDir + '/js/', cb);
    });

    gulp.task('build.safari', function(cb) {
        plugins.runSequence(
            'build.safari.copyStatic',
            'build.safari.copyJs',
            'build.safari.moveMainIcon',
            'build.safari.prepareToolbarIcons',
            'build.safari.makeInfoPlist',
            'build.safari.makeExtensionInfoJson',
            'build.safari.makeBackgroundHtml',
            'build.safari.makePopupHtml',
            cb
        );
    });
};
