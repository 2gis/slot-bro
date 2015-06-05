chrome.windows = {
    onFocusChanged: {
        addListener: function(callback) {
            __emitter.on('chrome.windows.onFocusChanged', callback);
        }
    },
    focusChangeEvent: function() {
        __emitter.emit('chrome.windows.onFocusChanged', this.getMyWindow().id);
    },
    get: function(winId, callback) {
        callback(this.getMyWindow());
    },
    getAll: function(callback) {
        callback([this.getMyWindow()]);
    },
    getCurrent: function(callback) {
        callback(this.getMyWindow());
    },
    getMyWindow: function() {
        return {
            id: 10,
            focused: true,
            windowType: 'normal'
        };
    },
    create: function() { console.log('chrome.windows.create', arguments); }
};
