var _ = require('lodash');
var http = require('http');
var unzip = require('unzip');
var path = require('path');

module.exports = function(gulp, plugins, config) {
    var exec = require('./utils/exec')(plugins);

    var kangoPath = __dirname + '/../kango';
    var kangoBuildOutput = kangoPath + '/buildtmp/';
    var kangoZipPath = __dirname + '/../kango/kango.zip';

    gulp.task('kango.download', function(cb) {
        plugins.fs.stat(kangoZipPath, function(err) {
            if (err) {
                var file = plugins.fs.createWriteStream(kangoZipPath);
                http.get("http://kangoextensions.com/kango/kango-framework-latest.zip", function(response) {
                    response.pipe(file);
                    response.on('end', cb)
                });
            } else {
                cb();
            }
        });
    });

    gulp.task('kango.extract', ['kango.download'], function(cb) {
        plugins.fs.stat(kangoPath + '/kango`', function(err) {
            if (err) {
                /*eslint-disable new-cap */
                plugins.fs.createReadStream(kangoZipPath).pipe(unzip.Extract({path: kangoPath}));
                /*eslint-enable new-cap */
            }
            cb();
        });
    });

    function makeDir(dirpath) {
        try {
            plugins.fs.mkdirSync(dirpath);
        } catch (err) {
            switch (err.code) {
                case 'ENOENT':
                    throw new Error('Folder ' + dirpath + ' cannot be created?');
                case 'EEXIST': // do nothing
                    break;
                default:
                    throw err;
            }
        }
    }

    gulp.task('kango.buildFolder', function(cb) {
        try {
            makeDir(kangoBuildOutput);
        } catch(err) {}

        exec('gulp --path=' + kangoBuildOutput, {
            cwd: kangoPath
        }, cb);
    });

    gulp.task('kango.copy', ['kango.buildFolder'], function(cb) {
        _.each(config.browsers, function(browser) {
            return plugins.fsEx.copySync(kangoBuildOutput + browser + '/', config[browser].buildDir + '/');
        });
        cb();
    });
};
