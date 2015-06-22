var _ = require('lodash');

module.exports = function(config) {
    var scripts = [];
    var styles = [];

    var tpl = _.template([
        '<!DOCTYPE html>',
        '<html xmlns="http://www.w3.org/1999/xhtml" lang="en">',
            '<head>',
                '<%= styles %>',
            '</head>',
            '<body>',
                'hello world from popup',
                '<%= scripts %>',
            '</body>',
        '</html>'
    ].join('\n'));

    _.each(config.kangoApi4Popup, function(path) {
        scripts.push('<script src="' + path + '" type="text/javascript"></script>');
    });

    return tpl({
        scripts: scripts.join('\n'),
        styles: styles.join('\n')
    });
};
