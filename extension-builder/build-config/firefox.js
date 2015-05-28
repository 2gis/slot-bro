module.exports = function(baseConf) {
    var buildDir = baseConf.firefox.buildDir;

    baseConf.firefox.manifestTemplates = {
        'update_firefox': __dirname + '/../browser-spec/firefox/update_firefox.xml.js',
        'extension_info': __dirname + '/../browser-spec/firefox/extension_info.js',
        'install': __dirname + '/../browser-spec/firefox/install.rdf.js',
        'chrome': __dirname + '/../browser-spec/firefox/chrome.manifest.js',
        'background': __dirname + '/../browser-spec/firefox/background.html.js'
    };

    baseConf.firefox.manifestDestinations = {
        'update_firefox': baseConf.packagesDir + '/update_firefox.xml',
        'extension_info': buildDir + '/extension_info.json',
        'install': buildDir + '/install.rdf',
        'chrome': buildDir + '/chrome.manifest',
        'background': buildDir + '/background.html'
    };

    return baseConf;
};
