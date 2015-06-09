chrome.browserAction = {
    /**
     * Mock helper
     * Link on popup.html file
     */
    popupPath: '',
    /**
     * Click on toolbar popup button handler
     * https://developer.chrome.com/extensions/browserAction#event-onClicked
     */
    onClicked: {
        /**
         * Listener for click event
         * @param {function} callback
         */
        addListener: function(callback) {
            __emitter.on('chrome.browserAction.onClicked', callback);
        }
    },
    /**
     * Mock helper
     * Emit click event on toolbar popup button
     */
    clickOnExtensionButton: function() {
        __emitter.emit('chrome.browserAction.onClicked');
    },
    /**
     * Set toolbar popup button icon
     * https://developer.chrome.com/extensions/browserAction#method-setIcon
     * @param {Object} icon - params
     * @param {string} icon.path - path to the icon file
     */
    setIcon: function(icon) {
        document.getElementById('button').src = icon.path;
    },
    /**
     * Not implemented
     * https://developer.chrome.com/extensions/browserAction#method-setTitle
     */
    setTitle: function() {
        console.log('chrome.browserAction.setTitle', arguments);
    },
    /**
     * Set details info about popup
     * https://developer.chrome.com/extensions/browserAction#method-setPopup
     * @param {Object} details - options for popup
     * @param {string} details.popup - path to popup.html file
     */
    setPopup: function(details) {
        this.popupPath = details.popup;
    },
    /**
     * Not implemented
     * https://developer.chrome.com/extensions/browserAction#method-setBadgeText
     */
    setBadgeText: function() {
        console.log('chrome.browserAction.setBadgeText', arguments);
    },
    /**
     * Not implemented
     * https://developer.chrome.com/extensions/browserAction#method-setBadgeBackgroundColor
     */
    setBadgeBackgroundColor: function() {
        console.log('chrome.browserAction.setBadgeBackgroundColor', arguments);
    }
};
