var _ = require('lodash');

module.exports = function(config) {
    var conf = {
        "manifest_version": 2,
        "content_scripts": [
            {
                "matches": [
                    "http://*/*",
                    "https://*/*"
                ],
                "all_frames": true,
                "run_at": "document_start",
                "js": ['includes/content.js']
            }
        ],
        "name": "__MSG_info_name__",
        "icons": {
            "128": "static/icon/icon128.png",
            "16": "static/icon/icon16.png",
            "48": "static/icon/icon48.png"
        },
        "browser_action": {
            "default_icon": "static/toolbar_button/inactive.png",
            "default_title": config.title
        },
        "version": config.version + '.' + config.buildNumber,
        "background": {
            "page": config.backgroundRes
        },
        "default_locale": "en",

        "update_url": config.chrome.updateUrl,
        "homepage_url": config.homepageUrl,
        "description": "__MSG_info_description__",
        "content_security_policy": config.chrome.securityPolicy,
        "web_accessible_resources": config.chrome.webAccessibleResources,
        "permissions": config.chrome.permissions
    };

    if (config.popupRes) {
        _.merge(conf, {
            "browser_action": {
                'default_popup': config.popupRes
            }
        });
    }

    return JSON.stringify(conf, null, '\t');
};
