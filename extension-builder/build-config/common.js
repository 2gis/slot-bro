module.exports = function(baseConf) {
    baseConf.kangoIncludes = [
        "kango/loader.js",
        "kango/utils.js",
        "kango/invoke.js",
        "kango/extension_info.js",
        "kango/core.js",
        "kango/console.js",
        "kango/timer.js",
        "kango/lang.js",
        "kango/messaging.js",
        "kango/io.js",
        "kango/xhr.js",
        "kango/storage.js",
        "kango/browser.js",
        "kango/i18n.js",
        "kango/userscript_engine.js",
        "kango/invoke_async.js",
        "kango/message_target.js",
        "kango/backgroundscript_engine.js",
        "kango/storage_sync.js",
        "kango/api.js",

        "kango-ui/browser_button.js",
        "kango-ui/options.js",
        "kango-ui/notifications.js",
        "kango-ui/context_menu.js",

        "kango/initialize.js"
    ];

    baseConf.kangoApi4Popup = [
        "kango-ui/kango_api.js"
    ];

    baseConf.styleIncludes = [
        'static/css/bundle.css'
    ];

    baseConf.mockIncludes = [ // only with dev/test server include. root path
        '/mock/mock.emitter.js',

        '/mock/chrome.browserAction.js',
        '/mock/chrome.cookies.js',
        '/mock/chrome.extension.js',
        '/mock/chrome.runtime.js',
        '/mock/chrome.tabs.js',
        '/mock/chrome.webNavigation.js',
        '/mock/chrome.windows.js',

        '/mock/mock.ui.js' // only for background.html
    ];

    baseConf.mockPopupIncludes = [
        '/mock/chrome.browserAction.js',
        '/mock/chrome.cookies.js',
        '/mock/chrome.extension.js',
        '/mock/chrome.webNavigation.js',
        '/mock/chrome.windows.js'
    ];

    baseConf.mockStyleIncludes = [
        '/mock/mock.ui.css' // only for background.html
    ];

    // webpack related
    baseConf.webpack = {
        entryPoints: baseConf.entryPoints,
        base: __dirname + '/../../',
        outputPath: __dirname + '/../../__extbuild/webpack'
    };

    baseConf.less = {
        sources: [
            __dirname + '/../../app/src/assets/**/*.less',
            __dirname + '/../../app/src/modules/**/*.less'
        ]
    };

    return baseConf;
};
