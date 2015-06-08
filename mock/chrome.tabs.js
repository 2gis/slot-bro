chrome.tabs = {
    onActivated: {
        addListener: function(callback) {
            __emitter.on('chrome.tabs.onActivated', callback);
        }
    },
    onCreated: {
        addListener: function(callback) {
            __emitter.on('chrome.tabs.onCreated', callback);
        }
    },
    onRemoved: {
        addListener: function(callback) {
            __emitter.on('chrome.tabs.onRemoved', callback);
        }
    },
    onUpdated: {
        addListener: function(callback) {
            __emitter.on('chrome.tabs.onUpdated', callback);
        }
    },
    changeTab: function() {
        __emitter.emit('chrome.tabs.onUpdated', this.tabData.id, this.tabData);
    },
    updateTab: function(data) {
        this.loadPage(data.url, function(tabData) {
            __emitter.emit('chrome.tabs.onUpdated', tabData.id, tabData);
        });
    },
    createTab: function(data) {
        this.loadPage(data.url, function(tabData) {
            __emitter.emit('chrome.tabs.onCreated', tabData);
            __emitter.emit('chrome.windows.onFocusChanged', chrome.windows.getMyWindow().id);
        });
    },
    loadPage: function(url, emitCallback) {
        var self = this;
        var tab = document.getElementById('page');

        tab.onload = function() {
            self.tabData = {
                active: true,
                windowId: chrome.windows.getMyWindow().id,
                id: 758,
                url: tab.contentWindow.location.href,
                title: tab.contentDocument.head.title
            };

            // inject content scripts
            tab.contentWindow.__emitter = window.__emitter;
            tab.contentWindow.chrome.runtime.onMessage = window.__runtime.onMessage;
            tab.contentWindow.chrome.runtime.sendMessage = chrome.runtime.sendMessage;

            window.__contentScripts.order.forEach(function bindScript(path) {
                var script = document.createElement('script');
                script.innerHTML = window.__contentScripts[path];
                tab.contentDocument.body.appendChild(script);
            });

            emitCallback(self.tabData);
        };

        tab.src = url;
    },
    sendMessage: function(tabId, data, callback) {
        try {
            __emitter.emit('chrome.__runtime.onMessage', data, data, callback);
        } catch (e) {
            console.log(e);
        }
    },
    query: function(query, callback) {
        return callback(this.getMyTabs());
    },
    getMyTabs: function() {
        return this.tabData ? [this.tabData] : [];
    },
    getCurrentTabData: function() {
        return this.tabData;
    },
    create: function(data) {
        this.createTab(data);
    },
    update: function() { console.log('chrome.tabs.update', arguments); },
    remove: function() { console.log('chrome.tabs.remove', arguments); },
    get: function() { console.log('chrome.tabs.get', arguments); }
};
