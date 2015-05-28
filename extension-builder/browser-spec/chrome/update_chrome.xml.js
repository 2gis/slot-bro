var _ = require('lodash');

module.exports = function(config) {
    var tpl = _.template([
        '<?xml version="1.0" encoding="utf-8"?>',
        '<gupdate protocol="2.0" xmlns="http://www.google.com/update2/response">',
            '<app appid="<%= extensionId %>">',
                '<updatecheck codebase="<%= updateUrl %>" version="<%= version %>"/>',
            '</app>',
        '</gupdate>'
    ].join('\n'));

    return tpl({
        extensionId: config.chrome.extensionId,
        updateUrl: config.chrome.updateUrl,
        version: config.version
    });
};
