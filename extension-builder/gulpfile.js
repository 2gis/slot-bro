var gulp = require('gulp');
var _ = require('lodash');
var requireDir = require('require-dir');

var releaseRegex = /--release/;
var releaseFlag = false;

var packRegex = /--pack/;
var packFlag = false;

var watchRegex = /--watch/;
var watchFlag = false;

var buildRegex = /--build=(\d+)/;
var buildNumber = '0';
var matches = null;

for (var i in process.argv) {
    if (process.argv[i].match(releaseRegex)) {
        releaseFlag = true;
        packFlag = true;
    }
    if (process.argv[i].match(packRegex)) {
        packFlag = true;
    }
    if (process.argv[i].match(watchRegex)) {
        watchFlag = true;
    }
    if (matches = process.argv[i].match(buildRegex)) {
        buildNumber = matches[1];
    }
}

/**
 * Config flow: (variables and gulptasks declared in upper files are visible to lower files)
 * - extension-builder/build-config/initial.js
 * - app/config.js
 * - app/config/*.js
 * - extension-builder/build-config/*.js (except initial)
 * - app/lib/*.*
 * - extension-builder/gulp/*.*
 * - extension-builder/browser-spec/*.*
 */
var config = require('../app/config.js')(require(__dirname + '/build-config/initial'), buildNumber, !releaseFlag);
config = require(__dirname + '/build-config/common')(config);
config = require(__dirname + '/build-config/chrome')(config);
config = require(__dirname + '/build-config/firefox')(config);
config = require(__dirname + '/build-config/safari')(config);
config.watchBuild = watchFlag;

var plugins = require(__dirname + '/gulp/utils/plugins.js');
var steps = requireDir(__dirname + '/gulp');
_.each(steps, function(step) {
    step(gulp, plugins, config);
});

gulp.task('extension.build', function(callback) {
    plugins.runSequence.apply(plugins, _.compact([
        'cleanup.outputDir',
        ['kango.extract', 'libs.build'],
        ['webpack.compile', 'style.compile', 'kango.copy'],
        'build.all',
        (watchFlag ? ['webpack.watch', 'style.watch'] : null),
        'libs.pack',
        (packFlag ? ['makePackage.all', 'makeUpdateFile.all'] : null),
        (packFlag ? 'cleanup.buildDir' : null),
        'cleanup.webpackDir',
        callback
    ]));
});
