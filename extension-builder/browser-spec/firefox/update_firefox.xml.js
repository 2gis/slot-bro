var _ = require('lodash');

module.exports = function(config) {
    var tpl = _.template([
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<RDF:RDF xmlns:RDF="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:em="http://www.mozilla.org/2004/em-rdf#">',
            '<RDF:Description about="urn:mozilla:extension:<%= extensionId %>">',
                '<em:updates>',
                    '<RDF:Seq>',
                        '<RDF:li>',
                            '<RDF:Description>',
                                '<em:version><%= version %></em:version>',
                                '<em:targetApplication>',
                                    '<RDF:Description>',
                                        '<em:id>{ec8030f7-c20a-464f-9b0e-13a3a9e97384}</em:id>',
                                        '<em:minVersion>8.0</em:minVersion>',
                                        '<em:maxVersion>42.*</em:maxVersion>',
                                        '<em:updateLink><%= updateUrl %></em:updateLink>',
                                    '</RDF:Description>',
                                '</em:targetApplication>',
                            '</RDF:Description>',
                        '</RDF:li>',
                    '</RDF:Seq>',
                '</em:updates>',
                '<em:version><%= version %></em:version>',
                '<em:updateLink><%= updateUrl %></em:updateLink>',
            '</RDF:Description>',
        '</RDF:RDF>'
    ].join('\n'));

    return tpl({
        extensionId: config.firefox.extensionId,
        updateUrl: config.firefox.updateUrl,
        version: config.version
    });
};
