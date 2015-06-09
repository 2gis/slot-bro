chrome.windows = {
    /**
     * Window focus listener
     * https://developer.chrome.com/extensions/windows#event-onFocusChanged
     */
    onFocusChanged: {
        /**
         * Listener for change focus on "new tab loaded"
         * @param {funciton} callback
         */
        addListener: function(callback) {
            __emitter.on('chrome.windows.onFocusChanged', callback);
        }
    },
    /**
     * Returns to callback one current window data
     * https://developer.chrome.com/extensions/windows#method-get
     * @param {number} winId - Not important, but need to send
     * @param {function} callback - result sends in this callback
     */
    get: function(winId, callback) {
        this.getCurrent(callback);
    },
    /**
     * Returns to callback windowData[] of one current window
     * https://developer.chrome.com/extensions/windows#method-getAll
     * @param {function} callback - result sends in this callback
     */
    getAll: function(callback) {
        callback([this.getMyWindow()]);
    },
    /**
     * Returns to callback one current window data
     * https://developer.chrome.com/extensions/windows#method-getCurrent
     * @param {function} callback - result sends in this callback
     */
    getCurrent: function(callback) {
        callback(this.getMyWindow());
    },
    /**
     * Mock helper
     * @returns {Object} - static window data
     */
    getMyWindow: function() {
        return {
            alwaysOnTop: false,
            focused: true,
            height: 1057,
            id: 1092,
            incognito: false,
            left: -123,
            state: "maximized",
            top: -1057,
            type: "normal",
            width: 1920
        };
    },
    /**
     * Not implemented
     * https://developer.chrome.com/extensions/windows#method-create
     */
    create: function() {
        console.log('chrome.windows.create', arguments);
    }
};
