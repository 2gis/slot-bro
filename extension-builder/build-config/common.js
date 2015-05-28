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

    // webpack related
    baseConf.webpack = {
        entryPoints: baseConf.entryPoints,
        base: __dirname + '/../../',
        outputPath: __dirname + '/../../__extbuild/webpack'
    };

    return baseConf;
};
