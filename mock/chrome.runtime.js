chrome.runtime.onMessage = { // для бекграунда
    addListener: function(callback) {
        __emitter.on('chrome.runtime.onMessage', callback);
    }

};

window.__runtime = { // для контент скриптов
    onMessage: {
        addListener: function(callback) {
            __emitter.on('chrome.__runtime.onMessage', callback);
        }
    }
};

chrome.runtime.sendMessage = function (data, callback) {
    try {
        __emitter.emit('chrome.runtime.onMessage', data, data, callback);
        // Апи хрома разбивает сообщение на два, но с теми же именами свойств.
        // Дублирование работает без всяких проблем.
    } catch(e){
        console.log(e);
    }
};
