

var _ = require('lodash');

module.exports = function(config) {
    var tpl = _.template([
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
        '<plist version="1.0">',
            '<dict>',
            '<key>Extension Updates</key>',
            '<array>',
                '<dict>',
                    '<key>CFBundleIdentifier</key>',
                    '<string>com.kangoextensions.dgisforbrowsers</string>',
                    '<key>CFBundleShortVersionString</key>',
                    '<string><%= version %></string>',
                    '<key>CFBundleVersion</key>',
                    '<string><%= version %></string>',
                    '<key>Developer Identifier</key>',
                    '<string><%= developerId %></string>',
                    '<key>URL</key>',
                    '<string><%= updateUrl %></string>',
                '</dict>',
            '</array>',
            '</dict>',
        '</plist>'
    ].join('\n'));

    return tpl({
        developerId: config.safari.developerId,
        updateUrl: config.safari.updateUrl,
        version: config.version
    });
};
