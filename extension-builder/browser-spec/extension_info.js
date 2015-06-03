var _ = require('lodash');

module.exports = function(config) {
    return {
        "content_scripts": [
            "js/vendor.chunk.js",
            "js/commons.chunk.js",
            "js/content.js"
        ],
        "background_scripts": [
            "js/vendor.chunk.js",
            "js/commons.chunk.js",
            "js/background.js"
        ],
        "description": config.description,
        "creator": config.author,
        "homepage_url": config.homepageUrl,
        "version": config.version + '.' + config.buildNumber,
        "browser_button": {
            "caption": config.title,
            "icon": "static/toolbar_button/inactive.png",
            "tooltipText": config.title
        },
        "name": config.title,
        "default_locale": "en",
        "update_path_url": config.cdnBaseUrl
    };
};
