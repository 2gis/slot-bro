var _ = require('lodash');

// Chrome ext builder
module.exports = function(gulp, plugins, config) {
    var common = require('./common')(plugins, config);

    gulp.task('build.chrome.makeLocalesMetadir', function(cb) {
        var localesSrc = config.localesDir;
        var localesDest = config.chrome.manifestDestinations.locales_meta;

        plugins.fs.mkdirSync(localesDest);
        _.each(config.locales, function(val, key) {
            plugins.fs.mkdirSync(localesDest + '/' + key.split('.')[0]);
            var content = plugins.fs.readFileSync(localesSrc + '/' + key, {encoding: 'utf8'});
            if (!content) {
                throw new TypeError('No locale found: ' + key);
            }
            var contentOrig = JSON.parse(content);
            var contentNew = JSON.stringify({
                'info_description': {message: contentOrig.__info_description__ || config.description},
                'info_name': {message: contentOrig.__info_name__ || config.title}
            }, null, '\t');

            plugins.fs.writeFileSync(localesDest + '/' + key.split('.')[0] + '/messages.json', contentNew);
        });
        cb();
    });

    gulp.task('build.chrome.makeBackgroundHtml', function(cb) {
        common.writeFile('chrome', 'background', cb);
    });
    gulp.task('build.chrome.makeExtensionInfoJson', function(cb) {
        common.writeFile('chrome', 'extension_info', cb);
    });
    gulp.task('build.chrome.makeManifestJson', function(cb) {
        common.writeFile('chrome', 'manifest', cb);
    });
    gulp.task('build.chrome.copyStatic', function(cb) {
        common.copyStatic(config.chrome.buildDir + '/static/', cb);
    });
    gulp.task('build.chrome.prepareToolbarIcons', function(cb) {
        common.prepareToolbarIconsInPlace(config.chrome.buildDir + '/static/', 'rgb', cb);
    });
    gulp.task('build.chrome.copyJs', function(cb) {
        common.copyJs(config.chrome.buildDir + '/js/', cb);
    });

    gulp.task('build.chrome', function(cb) {
        plugins.runSequence(
            'build.chrome.copyStatic',
            'build.chrome.copyJs',
            'build.chrome.prepareToolbarIcons',
            'build.chrome.makeManifestJson',
            'build.chrome.makeExtensionInfoJson',
            'build.chrome.makeBackgroundHtml',
            'build.chrome.makeLocalesMetadir',
            cb
        );
    });
};
