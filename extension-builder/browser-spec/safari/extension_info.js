var _ = require('lodash');

module.exports = function(config) {
    var common = require('../extension_info')(config);
    return JSON.stringify(_.extend({
        "developer_id": config.safari.developerId,
        "id": config.safari.extensionId,
        "update_url": config.safari.updateUrl
    }, common), null, '\t');
};
