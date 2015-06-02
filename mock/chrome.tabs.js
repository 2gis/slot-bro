chrome.tabs = {
    onActivated: {
        addListener: function(callback) {
            emitter.on('chrome.tabs.onActivated', callback);
        }
    },
    onCreated: {
        addListener: function(callback) {
            emitter.on('chrome.tabs.onCreated', callback);
        }
    },
    onRemoved: {
        addListener: function(callback) {
            emitter.on('chrome.tabs.onRemoved', callback);
        }
    },
    onUpdated: {
        addListener: function(callback) {
            emitter.on('chrome.tabs.onUpdated', callback);
        }
    },
    changeTab: function() {
        emitter.emit('chrome.tabs.onUpdated', this.tabData.id, this.tabData);
    },
    updateTab: function(data) {
        var self = this;

        this.loadPage(data.url, function() {
            emitter.emit('chrome.tabs.onUpdated', self.tabData.id, data);
        });
    },
    createTab: function(data) {
        var self = this;

        this.loadPage(data.url, function() {
            console.log('self.getCurrentTabData', self.getCurrentTabData())
            emitter.emit('chrome.tabs.onCreated', self.getCurrentTabData());
            emitter.emit('chrome.windows.onFocusChanged', chrome.windows.getMyWindow().id);
        });
    },
    loadPage: function(url, emitCallback) {
        var self = this;
        var tab = document.getElementById('page');

        tab.onload = function() {
            var tabData = self.tabData = {
                active: true,
                windowId: 10,
                id: 100,
                url: tab.contentWindow.location.href,
                title: tab.contentDocument.head.title
            };
            emitCallback();
        }

        tab.src = url;
    },
    sendMessage: function(tabId, message) {},
    query: function(query, callback) {
        return callback(this.getMyTabs());
    },
    getMyTabs: function() {
        return [this.tabData];
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
