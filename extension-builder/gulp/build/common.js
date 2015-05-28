var _ = require('lodash');

module.exports = function(plugins, config) {
    return {
        writeFile: function(browser, fileIdentifier, cb) {
            plugins.fs.writeFile(
                config[browser].manifestDestinations[fileIdentifier],
                require(config[browser].manifestTemplates[fileIdentifier])(config),
                cb
            );
        },

        copyStatic: function(destination, cb) {
            plugins.fsEx.copy(config.staticDir, destination, cb);
        },

        prepareToolbarIconsInPlace: function(staticPath, selectType, cb) {
            if (!plugins.fs.existsSync(staticPath + '/toolbar_button/')) {
                cb();
                return;
            }

            plugins.fsEx.copySync(staticPath + '/toolbar_button/' + selectType + '/', staticPath + '/toolbar_tmp/');
            plugins.fsEx.removeSync(staticPath + '/toolbar_button/');
            plugins.fs.rename(staticPath + '/toolbar_tmp/', staticPath + '/toolbar_button/', function() {
                cb();
            });
        },

        copyJs: function(destination, cb) {
            var files = plugins.fs.readdirSync(config.webpack.outputPath);
            _.each(files, function(filename) {
                plugins.fsEx.copySync(config.webpack.outputPath + '/' + filename, destination + '/' + filename);
            });
            cb();
        }
    };
};
