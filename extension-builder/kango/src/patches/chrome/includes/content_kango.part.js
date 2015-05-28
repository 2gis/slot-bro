initMessaging = (function(oldInitMessaging) {
    return function() {
        oldInitMessaging();
        kango.dispatchMessage = function(b, a) {
            try {
                chrome.runtime.sendMessage({name: b, data: a, origin: "tab", source: null, target: null});
            } catch (e) {
                if (!kango._extensionDisconnected) {
                    console.info('Extension was disabled or removed. Re-enable it and refresh the page.');
                    kango._extensionDisconnected = true;
                }
            }
            return true;
        };
    };
})(initMessaging);
