module.exports = function(baseConf) {
    return {
        extensionId: "kiehfhiwkkhnjkdjgwiehhtllspdfjhe",
        permissions: [
            "tabs",
            "http://*/*",
            "https://*/*",
            "contextMenus",
            "webNavigation",
            "notifications",
            "cookies",
            "webRequest",
            "geolocation"
        ],
        securityPolicy: makePolicyString({
            'script-src': {
                'options': [
                    'self',
                    'unsafe-inline',
                    'unsafe-eval'
                ],
                'allowedUrls': [
                    "https://maps.googleapis.com",
                    "https://maps.gstatic.com",
                    "https://www.google-analytics.com"
                ]
            },
            'object-src': {
                'options': [
                    'self'
                ]
            }
        }),
        webAccessibleResources: [
            "res/*",
            "templates/empty.html"
        ],
        updateUrl: baseConf.makeBundleUri(baseConf, 'crx'),
        buildDir: baseConf.tmpBuildDir + '/chrome/',
        certFile: ''
    };
};

// helper functions

function quoteArray(arr) {
    for (var i in arr) {
        arr[i] = "'" + arr[i] + "'";
    }
    return arr;
}

function makePolicyString(arr) {
    var output = [];
    for (var i in arr) {
        output.push(i);
        if (arr[i].options) {
            output = output.concat(quoteArray(arr[i].options));
        }
        if (arr[i].allowedUrls) {
            output = output.concat(arr[i].allowedUrls);
        }
        output.push(';');
    }

    return output.join(' ');
}
