chrome.extension = {
    getURL: function(url) {
        return url;
    },
    getBackgroundPage: function() {
        return window.parent;
    },
    getViews: function(fetchProperties) {
        if (fetchProperties.type == 'popup') {
            return [document.getElementById('popup').contentWindow];
        }

        if (fetchProperties.type == 'tab') {
            return [document.getElementById('page').contentWindow];
        }

        return [
            document.getElementById('popup').contentWindow,
            document.getElementById('page').contentWindow
        ];
    }
};

(function(){
    var chromeFilesPath = '/__extbuild/src/chrome/';
    window.__contentScripts = {};

    getExtensionInfo(function(info){
        window.__contentScripts.order = info.content_scripts;

        info.content_scripts.unshift('includes/content.js');

        info.content_scripts.forEach(function(path){
            getScript(path, function(code) {
                window.__contentScripts[path] = code;
            })
        });
    });

    function getScript(path, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', chromeFilesPath + path);

        xhr.onload = function() {
            callback(xhr.responseText);
        };

        xhr.send(null);
    }

    function getExtensionInfo(callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', chromeFilesPath + 'extension_info.json');

        xhr.onload = function() {
            callback(JSON.parse(xhr.responseText));
        };

        xhr.send(null);
    }
})();
