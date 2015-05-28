/*
 Sample lib pack script.

 - Such scripts are needed to copy ready lib files into extension folders.
 - Task scripts may use all the plugins that are being exported by main task. Plugin list can
 be found at extension-builder/gulp/utils/plugins.js.
 - Also all config variables are accessible according to config flow (see extension-build/gulpfile.js).
 - This file should return gulp.task dependencies array.
*/

module.exports = function(gulp, plugins, config) {
    gulp.task('sample.copy', function(cb) {
        /*
        // Example copy to all browsers' folders:

        config.browsers.forEach(function(browser) {
            plugins.fsEx.copySync(config.externalLibPath, config[browser].buildDir + '/js/');
        });

        */
        cb();
    });

    return ['sample.copy'];
};
