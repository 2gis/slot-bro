var _ = require('lodash');

module.exports = function(config) {
    var tpl = _.template([
        '<!DOCTYPE html>',
        '<html xmlns="http://www.w3.org/1999/xhtml" lang="en">',
            '<head>',
                '<%= scripts %>',
            '</head>',
            '<body>',
            '</body>',
        '</html>'
    ].join('\n'));

    var scripts = [];
    for (var i = 0; i < config.kangoIncludes.length; i++) {
        scripts.push('<script src="', config.kangoIncludes[i] + '" type="text/javascript"></script>');
    }

    return tpl({
        scripts: scripts.join('\n')
    });
};
