var _ = require('lodash');
// Packager
module.exports = function(gulp, plugins, config) {
    gulp.task('makePackage.chrome', function (cb) {
        if (!config.chrome.certFile) {
            /*eslint-disable no-undef, no-console */
            console.error('[ERR][chrome] Refused to create chrome package: certificate file is required. See README.md for details.');
            /*eslint-enable no-undef, no-console */
            cb();
            return false;
        }

        var command = 'bash <%= file.path %>' +
            ' --version ' + config.version + '.' + config.buildNumber +
            ' --sourcedir ' + config.chrome.buildDir +
            ' --cert ' + config.chrome.certFile +
            ' --outputbase ' + config.packagesDir + '/' + config.filename;

        // console.log('[chrome] Running command: ' + _.template(command)({file: {path: __dirname + '/../sh/chrome-packager.sh'}}));

        return gulp.src(__dirname + '/../sh/chrome-packager.sh')
            .pipe(plugins.shell([command]));
    });

    gulp.task('makePackage.firefox', function () {
        var command = 'bash <%= file.path %>' +
            ' --version ' + config.version + '.' + config.buildNumber +
            ' --sourcedir ' + config.firefox.buildDir +
            ' --outputbase ' + config.packagesDir + '/' + config.filename;

        // console.log('[firefox] Running command: ' + _.template(command)({file: {path: __dirname + '/../sh/firefox-packager.sh'}}));

        return gulp.src(__dirname + '/../sh/firefox-packager.sh')
            .pipe(plugins.shell([command]));
    });

    gulp.task('makePackage.safari', function (cb) {
        if (!config.safari.certDir) {
            /*eslint-disable no-undef, no-console */
            console.error('[ERR][safari] Refused to create safari package: certificate directory is required. See README.md for details.');
            /*eslint-enable no-undef, no-console */
            cb();
            return false;
        }

        var command = 'bash <%= file.path %>' +
            ' --version ' + config.version + '.' + config.buildNumber +
            ' --sourcedir ' + config.safari.buildDir +
            ' --certdir ' + config.safari.certDir +
            ' --output ' + config.packagesDir +
            ' --filename ' + config.filename;

        // console.log('[safari] Running command: ' + _.template(command)({file: {path: __dirname + '/../sh/safari-packager.sh'}}));

        return gulp.src(__dirname + '/../sh/safari-packager.sh')
            .pipe(plugins.shell([command]));
    });

    gulp.task('makePackage.all', ['makePackage.chrome', 'makePackage.firefox', 'makePackage.safari']);
};
