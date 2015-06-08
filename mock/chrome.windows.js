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
    create: function() {
        console.log('chrome.windows.create', arguments);
    }
};
