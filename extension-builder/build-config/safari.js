module.exports = function(baseConf) {
    var buildDir = baseConf.safari.buildDir;

    baseConf.safari.manifestTemplates = {
        'update_safari': __dirname + '/../browser-spec/safari/update_safari.plist.js',
        'extension_info': __dirname + '/../browser-spec/safari/extension_info.js',
        'Info': __dirname + '/../browser-spec/safari/Info.plist.js',
        'background': __dirname + '/../browser-spec/safari/background.html.js'
    };

    baseConf.safari.manifestDestinations = {
        'update_safari': baseConf.packagesDir + '/update_safari.plist',
        'extension_info': buildDir + '/extension_info.json',
        'Info': buildDir + '/Info.plist',
        'background': buildDir + '/background.html'
    };

    return baseConf;
};
