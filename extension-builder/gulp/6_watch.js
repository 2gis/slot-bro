var nodemon = require('nodemon');

// start only with --watch
module.exports = function(gulp, plugins, config) {
    var common = require('./build/common')(plugins, config);
    gulp.task('webpack.watch', function(cb) {
        nodemon({
            // watch itself becouse we restart with event from webpack watcher
            script: config.server,
            watch: [config.server],
            execMap: { js: 'node' },
            ignore: ['*']
        });

        config.webpackCompiler.watch({
            aggregateTimeout: 300,
            poll: true
        }, function(err, stats) {
            if (err) throw new plugins.util.PluginError("webpack", err);

            plugins.util.log("[webpack]", stats.toString({}));
            common.copyJs(config.chrome.buildDir + '/js/', nodemon.restart);
        });
    });

    gulp.task('style.copy.static', function() {
        common.copyStatic(config.chrome.buildDir + '/static/', nodemon.restart);
    });

    gulp.task('style.watch', function() {
        gulp.watch(config.less.sources, function() {
            plugins.runSequence('style.compile', 'style.copy.static');
        });
    });
};
