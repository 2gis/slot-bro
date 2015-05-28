var _ = require('lodash');

module.exports = function(config) {
    var common = require('../extension_info')(config);
    return JSON.stringify(_.extend({
        "id": config.firefox.extensionId,
        "locales": config.firefox.locales,
        "package_id": config.firefox.packageId,
        "update_url": config.firefox.updateUrl
    }, common), null, '\t');
};
