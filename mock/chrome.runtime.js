/**
 * Mock for background page
 * https://developer.chrome.com/extensions/runtime#event-onMessage
 */
chrome.runtime.onMessage = {
    /**
     * Listener for messages from content_scripts
     * @param {function} callback
     */
    addListener: function(callback) {
        __emitter.on('chrome.runtime.onMessage', callback);
    }

};
/**
 * Mock for usage in frame by injected content_scripts
 */
window.__runtime = {
    /**
     * Listener for messages from backgroud page
     * https://developer.chrome.com/extensions/runtime#event-onMessage
     * @param {function} callback
     */
    onMessage: {
        addListener: function(callback) {
            __emitter.on('chrome.__runtime.onMessage', callback);
        }
    }
};

/**
 * Emit message from content page to background
 * https://developer.chrome.com/extensions/runtime#method-sendMessage
 * @param {Object} data
 * @param {function} callback
 */
chrome.runtime.sendMessage = function(data, callback) {
    try {
        __emitter.emit('chrome.runtime.onMessage', data, data, callback);
        // Апи хрома разбивает сообщение на два, но с теми же именами свойств.
        // Дублирование работает без всяких проблем.
    } catch (e) {
        console.log(e);
    }
};
