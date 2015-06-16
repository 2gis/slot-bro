module.exports = function(baseConf) {
    var buildDir = baseConf.chrome.buildDir;

    baseConf.chrome.manifestTemplates = {
        'update_chrome': __dirname + '/../browser-spec/chrome/update_chrome.xml.js',
        'extension_info': __dirname + '/../browser-spec/chrome/extension_info.js',
        'manifest': __dirname + '/../browser-spec/chrome/manifest.js',
        'popup': __dirname + '/../browser-spec/chrome/popup.html.js',
        'background': __dirname + '/../browser-spec/chrome/background.html.js'
    };

    baseConf.chrome.manifestDestinations = {
        'update_chrome': baseConf.packagesDir + '/update_chrome.xml',
        'extension_info': buildDir + '/extension_info.json',
        'manifest': buildDir + '/manifest.json',
        'popup': buildDir + '/popup.html',
        'background': buildDir + '/background.html',
        'locales_meta': buildDir + '/_locales/'
    };

    return baseConf;
};
