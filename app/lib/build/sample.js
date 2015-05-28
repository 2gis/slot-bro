/*
    Sample lib build script.

    - Current folder contains task scripts to build external libs required for your extension.
    - Task scripts may use all the plugins that are being exported by main task. Plugin list can
    be found at extension-builder/gulp/utils/plugins.js.
    - Also all config variables are accessible according to config flow (see extension-build/gulpfile.js).
    - Libs should not depend on each other, as build order is not guaranteed.
    - This file should return gulp.task dependencies array.
*/

module.exports = function(gulp, plugins, config) {
    gulp.task('sample.build', function(cb) {
        // Do something to build external libs.
        // You can use plugins.exec to run any script, for example. See 'exec' @ npm registry.

        // Then export paths to config, so pack script can read them
        config.externalLibPath = __dirname + '/samplePath/readyLib.js';
        cb();
    });

    return ['sample.build'];
};
