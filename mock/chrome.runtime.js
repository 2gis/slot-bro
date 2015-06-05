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

chrome.runtime.sendMessage = function (data) {
    try {
        __emitter.emit('chrome.runtime.onMessage', data, data); // ну, вот так, зато работает
    } catch(e){
        console.log(e);
    }
};
