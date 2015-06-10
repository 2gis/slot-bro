var _ = require('lodash');

module.exports = function(gulp, plugins, config) {
    var common = require('./build/common')(plugins, config);
    gulp.task('makeUpdateFile.chrome', function(cb) {
        if (!config.chrome.certFile) {
            cb();
            return;
        }
        common.writeFile('chrome', 'update_chrome', cb);
    });
    gulp.task('makeUpdateFile.firefox', function(cb) {
        common.writeFile('firefox', 'update_firefox', cb);
    });
    gulp.task('makeUpdateFile.safari', function(cb) {
        if (!config.safari.certDir) {
            cb();
            return;
        }
        common.writeFile('safari', 'update_safari', cb);
    });

    gulp.task('makeUpdateFile.all', ['makeUpdateFile.chrome', 'makeUpdateFile.firefox', 'makeUpdateFile.safari']);
};
