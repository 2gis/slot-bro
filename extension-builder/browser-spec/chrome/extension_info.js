var _ = require('lodash');

module.exports = function(config) {
    var common = require('../extension_info')(config);
    return JSON.stringify(_.extend({
        "id": config.chrome.extensionId,
        "locales": config.chrome.locales
    }, common), null, '\t');
};
