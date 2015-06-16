chrome.extension = {
    /**
     * In dev/test relative and absolute paths are same
     * https://developer.chrome.com/extensions/extension#method-getURL
     * @param {string} url - relative path to resource
     * @returns {string} - absolute path to resource
     */
    getURL: function(url) {
        return url;
    },
    /**
     * For popup page usage
     * https://developer.chrome.com/extensions/extension#method-getBackgroundPage
     * @returns {Window} window object of background page
     */
    getBackgroundPage: function() {
        return window.parent;
    },
    /**
     * Return window objects of content_page and popup
     * https://developer.chrome.com/extensions/extension#method-getViews
     * @param {Object} fetchProperties - options for take needed window
     * @param {string} fetchProperties.type - 'popup' for popup or 'page' for content_page
     * @returns {Window[]} window objects
     */
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

/**
 * Load content scripts sources for inject in content page
 */
(function loadContentScripts() {
    var chromeFilesPath = '/__extbuild/src/chrome/';
    window.__contentScripts = {};
    window.__popupScripts = {};

    getExtensionInfo(function(info) {
        window.__contentScripts.order = info.content_scripts;
        window.__popupScripts.order = info.popup_scripts;

        info.content_scripts.unshift('includes/content.js');

        info.content_scripts.forEach(function(path) {
            getScript(path, function(code) {
                window.__contentScripts[path] = code;
            });
        });

        info.popup_scripts.forEach(function(path) {
            getScript(path, function(code) {
                window.__popupScripts[path] = code;
            });
        });
    });

    loadManifest(function(manifest) {
        var popupFile = manifest.browser_action.default_popup;
        if (popupFile) {
            chrome.browserAction.popupPath = popupFile;
        }
    });

    function getScript(path, callback) {
        ajax(chromeFilesPath + path, callback);
    }

    function getExtensionInfo(callback) {
        ajax(chromeFilesPath + 'extension_info.json', function(responseText){
            callback(JSON.parse(responseText));
        });
    }

    function loadManifest(callback) {
        ajax(chromeFilesPath + 'manifest.json', function(responseText){
            callback(JSON.parse(responseText));
        });
    }

    function ajax(path, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', path, true);

        xhr.onload = function() {
            callback(xhr.responseText);
        };

        xhr.onerror = function() {
            console.error('Error on loading file:', path);
        };

        xhr.send(null);
    }
})();
