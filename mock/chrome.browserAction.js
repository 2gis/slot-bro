chrome.browserAction = {
    popupPath: '',
    onClicked: {
        addListener: function(callback) {
            emitter.on('chrome.browserAction.onClicked', callback);
        }
    },
    clickOnExtensionButton: function() {
         emitter.emit('chrome.browserAction.onClicked');
    },
    setIcon: function(icon) {
        document.getElementById('button').src = icon.path;
    },
    setTitle: function() { console.log('chrome.browserAction.setTitle', arguments); },
    setPopup: function(details) {
        this.popupPath = details.popup;
    },
    setBadgeText: function() { console.log('chrome.browserAction.setBadgeText', arguments); },
    setBadgeBackgroundColor: function() { console.log('chrome.browserAction.setBadgeBackgroundColor', arguments); }
};
