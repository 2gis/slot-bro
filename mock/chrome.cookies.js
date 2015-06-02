chrome.cookies = {
    getAll: function() { console.log('chrome.cookies.getAll', arguments); },
    get: function() { console.log('chrome.cookies.get', arguments); },
    set: function() { console.log('chrome.cookies.set', arguments); }
};
