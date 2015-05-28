initMessaging = (function(oldInitMessaging) {
    oldInitMessaging();
    kango.dispatchMessage = function(a, b) {
        safari.self.tab.dispatchMessage(a, JSON.parse(JSON.stringify(b))); // clone for good!
        return !0
    };
})(initMessaging);
