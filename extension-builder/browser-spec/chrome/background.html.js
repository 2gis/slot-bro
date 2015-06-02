var _ = require('lodash');

module.exports = function(config) {
    var scripts = [];
    var styles = [];
    var body = "\n";

    var tpl = _.template([
        '<!DOCTYPE html>',
        '<html xmlns="http://www.w3.org/1999/xhtml" lang="en">',
            '<head>',
                '<%= scripts %>',
                '<%= styles %>',
            '</head>',
            '<body>',
                '<%= body %>',
            '</body>',
        '</html>'
    ].join('\n'));


    if (config.watchBuild) {
        _.each(config.mockIncludes, function(path) {
            scripts.push('<script src="' + path + '" type="text/javascript"></script>');
        });

        _.each(config.mockStyleIncludes, function(path) {
            styles.push('<link href="' + path + '" rel="stylesheet" type="text/css">');
        });

        body = '<div class="page-wrapper">' + // todo: template?
            '<div class="left-column">' +
                '<button onclick="openPopup();">' +
                    '<img id="button" src="/icons/button.png" width="19" height="19" alt="submit" />' +
                '</button>' +
                '<button onclick="refreshPopup()">refresh popup</button>' +
                '<br />' +
                '<iframe id="popup"></iframe>' +
            '</div>' +
            '<div class="right-column">' +
                '<form onsubmit="openUrl(); return false;">' +
                '<input type="text" id="url" value="http://nsu.ru">' +
                '<button>open url</button>' +
                '</form>' +
                '<iframe id="page" width="100%" height="900px"></iframe>' +
            '</div>' +
        '</div>\n';
    }

    for (var i = 0; i < config.kangoIncludes.length; i++) {
        scripts.push('<script src="' + config.kangoIncludes[i] + '" type="text/javascript"></script>');
    }



    return tpl({
        scripts: scripts.join('\n'),
        styles: styles.join('\n'),
        body: body
    });
};
