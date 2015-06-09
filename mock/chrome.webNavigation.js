/**
 * Not implemented
 * https://developer.chrome.com/extensions/webNavigation
 */
chrome.webNavigation = {
    onBeforeNavigate: {
        addListener: function(callback) {
            __emitter.on('chrome.webNavigation.onBeforeNavigate', callback);
        }
    },
    onCompleted: {
        addListener: function(callback) {
            __emitter.on('chrome.webNavigation.onCompleted', callback);
        }
    }
};
