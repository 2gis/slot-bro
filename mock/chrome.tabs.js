chrome.tabs = {
    /**
     * https://developer.chrome.com/extensions/tabs#event-onActivated
     */
    onActivated: {
        addListener: function(callback) {
            __emitter.on('chrome.tabs.onActivated', callback);
        }
    },
    /**
     * https://developer.chrome.com/extensions/tabs#event-onUpdated
     */
    onCreated: {
        /**
         * Listener for first time load in page
         * @param {function} callback
         */
        addListener: function(callback) {
            __emitter.on('chrome.tabs.onCreated', callback);
        }
    },
    /**
     * https://developer.chrome.com/extensions/tabs#event-onRemoved
     */
    onRemoved: {
        addListener: function(callback) {
            __emitter.on('chrome.tabs.onRemoved', callback);
        }
    },
    /**
     * https://developer.chrome.com/extensions/tabs#event-onUpdated
     */
    onUpdated: {
        /**
         * Listener for change already created tab url
         * @param {function} callback
         */
        addListener: function(callback) {
            __emitter.on('chrome.tabs.onUpdated', callback);
        }
    },
    /**
     * Get data about current loaded tab(page)
     * https://developer.chrome.com/extensions/tabs#method-query
     * @param {object} query - not important but must be sended
     * @param {function} callback - result sends in this callback
     */
    query: function(query, callback) {
        return callback(this.getMyTabs());
    },
    /**
     * Emit on load new url from input field
     * https://developer.chrome.com/extensions/tabs#method-create
     * @param {object} data - params for new loading page
     * @param {string} data.url - url, require http://
     */
    create: function(data) {
        this.loadPage(data.url, function(tabData) {
            __emitter.emit('chrome.tabs.onCreated', tabData);
            __emitter.emit('chrome.windows.onFocusChanged', chrome.windows.getMyWindow().id);
        });
    },
    /**
     * Emit on update frame to another (or the same) url
     * https://developer.chrome.com/extensions/tabs#method-update
     * @param {number} tabId - not important
     * @param {object} data - params for new loading page
     * @param {object} data.url - url, require http://
     */
    update: function(tabId, data) {
        this.loadPage(data.url, function(tabData) {
            __emitter.emit('chrome.tabs.onUpdated', tabData.id, tabData);
        });
    },
    /**
     * Send message from background to content page
     * https://developer.chrome.com/extensions/tabs#method-sendMessage
     * @param {number} tabId - not important but must be sended
     * @param {object} data - message for sending
     */
    sendMessage: function(tabId, data) {
        try {
            __emitter.emit('chrome.__runtime.onMessage', data, data);
        } catch (e) {
            console.log(e);
        }
    },
    /**
     * Mock helper
     * Initiate load url in 'page' frame
     * @param {string} url - url, require http://
     * @param {function} emitCallback - callback for do stuff on frame finish loading
     */
    loadPage: function(url, emitCallback) {
        var self = this;
        var frame = document.getElementById('page');

        frame.onload = function() {
            self.tabData = {
                active: true,
                windowId: chrome.windows.getMyWindow().id,
                id: 758,
                url: frame.contentWindow.location.href,
                title: frame.contentDocument.head.title
            };

            self.injectMocks(frame);
            self.injectScripts(frame);

            emitCallback(self.tabData);
        };

        frame.src = url; // init loading
    },
    /**
     * Mock helper
     * Inject source code of content scripts. Scripts loads in chrome.extension.js
     * @param {Frame} frame
     */
    injectScripts: function(frame) {
        window.__contentScripts.order.forEach(function bindScript(path) {
            var script = document.createElement('script');
            script.innerHTML = window.__contentScripts[path];
            frame.contentDocument.body.appendChild(script);
        });
    },
    /**
     * Mock helper
     * Inject mock methods to frame page for usage by content scripts
     * @param {Frame} frame
     */
    injectMocks: function(frame) {
        frame.contentWindow.__emitter = window.__emitter;
        frame.contentWindow.chrome.runtime.onMessage = window.__runtime.onMessage;
        frame.contentWindow.chrome.runtime.sendMessage = chrome.runtime.sendMessage;
    },
    /**
     * Mock helper
     * Get current tab(page) data
     * @returns {Object[]} - return array with current loaded page data
     */
    getMyTabs: function() {
        return this.tabData ? [this.tabData] : [];
    },
    /**
     * Not implemented
     * https://developer.chrome.com/extensions/tabs#method-remove
     */
    remove: function() {
        console.log('chrome.tabs.remove', arguments);
    },
    /**
     * Not implemented
     * https://developer.chrome.com/extensions/tabs#method-get
     */
    get: function() {
        console.log('chrome.tabs.get', arguments);
    }
};
