module.exports = function(baseConf) {
    return {
        extensionId: "{A42D63DE-5303-451A-B1AA-8A91A19D3128}",
        packageId: 'kango-a42d63de-5303-451a-b1aa-8a91a19d3128',
        updateUrl: baseConf.makeBundleUri(baseConf, 'xpi'),
        buildDir: baseConf.tmpBuildDir + '/firefox/'
    };
};
