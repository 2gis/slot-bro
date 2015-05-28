module.exports = function(baseConf) {
    var buildDir = baseConf.tmpBuildDir + '/safari/' + baseConf.makeBundleUri(baseConf, 'safariextension', true);
    return {
        developerId: '', // TODO: get this at safari developer page
        extensionId: 'com.kangoextensions.sample',
        updateUrl: baseConf.makeBundleUri(baseConf, 'safariextz'),
        buildDir: buildDir,
        mainIcon: buildDir + '/static/icon/icon100.png',
        certDir: ''
    };
};
