var _ = require('lodash');
var fs = require('fs');

module.exports = function(config) {
    var localeTpl = _.template([
        '<em:localized>',
            '<Description>',
                '<em:locale><%= locale %></em:locale>',
                '<em:name><%= name %></em:name>',
                '<em:description><%= description %></em:description>',
            '</Description>',
        '</em:localized>'
    ].join('\n'));

    var tpl = _.template([
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<RDF xmlns="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:em="http://www.mozilla.org/2004/em-rdf#">',
            '<Description about="urn:mozilla:install-manifest">',
                '<em:id><%= extensionId %></em:id>',
                '<em:name><%= title %></em:name>',
                '<em:version><%= version %></em:version>',
                '<em:targetApplication>',
                    '<Description>',
                        '<em:id>{ec8030f7-c20a-464f-9b0e-13a3a9e97384}</em:id>',
                        '<em:minVersion>8.0</em:minVersion>',
                        '<em:maxVersion>42.*</em:maxVersion>',
                    '</Description>',
                '</em:targetApplication>',
                '<em:bootstrap>true</em:bootstrap>',
                '<em:description><%= description %></em:description>',
                '<em:creator><%= author %></em:creator>',
                '<em:homepageURL><%= homepageUrl %></em:homepageURL>',
                '<em:iconURL>chrome://<%= packageId %>/content/static/icon/icon32.png</em:iconURL>',
                '<em:updateURL><%= updateUrl %></em:updateURL>',
                '<%= locales %>',
            '</Description>',
        '</RDF>'
    ].join('\n'));

    var localesString = '';
    _.each(config.locales, function(locales, file) {
        var contents = JSON.parse(fs.readFileSync(config.localesDir + file, {encoding: 'utf8'}));
        _.each(locales, function(locale) {
            localesString += localeTpl({
                locale: locale,
                name: contents.__info_name__ || config.title,
                description: contents.__info_description__ || config.description
            });
        });
    });

    return tpl({
        title: config.title,
        author: config.author,
        description: config.description,
        extensionId: config.firefox.extensionId,
        packageId: config.firefox.packageId,
        updateUrl: config.firefox.updateUrl,
        homepageUrl: config.homepageUrl,
        version: config.version,
        locales: localesString
    });
};
