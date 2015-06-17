var _ = require('lodash');

module.exports = function(initialConfig, buildNumber, debugMode) {
    var config = _.extend(initialConfig, {
        entryPoints: {
            'background': __dirname + "/entryPoints/background.js",
            'content': __dirname + "/entryPoints/content.js",
            'popup': __dirname + "/entryPoints/popup.js",
            'vendor': ['jquery', 'lodash']
        },

        browsers: ['chrome', 'firefox', 'safari'],

        locales: {
            'en.json': ['en'],
            'ru.json': ['ru']
        },

        localesDir: __dirname + '/locales/',
        staticDir: __dirname + '/src/static/',

        // packager related
        'version': '1.0',
        'author': 'Developer',
        'title': "Kango",
        'description': 'My browser extension',
        'homepageUrl': 'http://myextension.ru/',
        'popupRes': 'popup.html',
        'backgroundRes': 'background.html',
        'filename': 'myextension',
        'cdnBaseUrl': 'https://myextension.ru/builds/',
        "buildNumber": buildNumber || '0',
        'debugMode': !!debugMode,
        'makeBundleUri': function(baseConf, fileExt, produceOnlyFilename) {
            return (produceOnlyFilename ? '' : baseConf.cdnBaseUrl) + baseConf.filename + '_' + baseConf.version + '.' + baseConf.buildNumber + '.' + fileExt;
        },

        libs: {}
    });

    config.chrome = require('./config/chrome')(config);
    config.firefox = require('./config/firefox')(config);
    config.safari = require('./config/safari')(config);

    return config;
};
