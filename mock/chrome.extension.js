chrome.extension = {
    getURL: function(url) {
        return url;
    },
    getBackgroundPage: function() {
        return window.parent;
    },
    getViews: function(fetchProperties) {
        if (fetchProperties.type == 'popup')
            return [document.getElementById('popup').contentWindow];

        if (fetchProperties.type == 'tab')
            return [document.getElementById('page').contentWindow];

        return [
            document.getElementById('popup').contentWindow,
            document.getElementById('page').contentWindow
        ];
    }
};