var _ = require('lodash');

module.exports = function(gulp, plugins, config) {
    var requireDir = require('require-dir');

    var libsBuildPath = __dirname + '/../../app/lib/build/';
    var gulpTaskNames = [];
    _.each(requireDir(libsBuildPath), function(func) {
        gulpTaskNames = gulpTaskNames.concat(func(gulp, plugins, config));
    });
    gulp.task('libs.build', gulpTaskNames);

    var libsPackPath = __dirname + '/../../app/lib/package/';
    var gulpPackTaskNames = [];
    _.each(requireDir(libsPackPath), function(func) {
        gulpPackTaskNames = gulpPackTaskNames.concat(func(gulp, plugins, config));
    });
    gulp.task('libs.pack', gulpPackTaskNames);
};
