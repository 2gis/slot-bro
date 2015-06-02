chrome.runtime.onMessage = {
    addListener: function(callback) {
        emitter.on('chrome.runtime.onMessage', callback);
    }
};
chrome.runtime.sendMessage = function (message) {
    emitter.emit('chrome.runtime.onMessage', {name: 'name', data: {}, origin: "tab", source: null, target: null}, {});
}