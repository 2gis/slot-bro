var _ = require('lodash');

module.exports = function(config) {
    return 'content ' + config.firefox.packageId + ' ./';
};
