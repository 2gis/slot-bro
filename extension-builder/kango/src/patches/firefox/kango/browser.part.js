module.exports._onLocationChange = function (aBrowser, aWebProgress, aRequest, aLocation) {
    var location = aLocation.resolve('');
    if (location) {
        var tab = this.getTab(this.getTabFromWindow(aBrowser.contentWindow));
        this.fireEvent(this.event.TAB_LOCATION_CHANGED, {tabId: tab.getId(), url: location});
    }
};

module.exports._listenLocationChangeEvent = function(a) {
    var self = this;
    var h = {
        onLocationChange: function(aBrowser, aWebProgress, aRequest, aLocation) {self._onLocationChange(aBrowser, aWebProgress, aRequest, aLocation)},
        onProgressChange: function() {},
        onSecurityChange: function() {},
        onStateChange: function() {},
        onStatusChange: function() {},
        onRefreshAttempted: function() {},
        onLinkIconAvailable: function() {}
    };
    a.gBrowser.addTabsProgressListener(h);
    chromeWindows.registerContainerUnloader(function () {
        a.gBrowser.removeTabsProgressListener(h);
    }, a);
};

module.exports.windows.isNull = function(){
    return !chromeWindows.getMostRecentChromeWindow();
};

module.exports.windows.getPopupFrame = function(){
    var extRawData = require("kango/extension_info").getRawData();
    var elId = 'kango-ui-popup-frame_' + utils.utils.getDomainFromId(extRawData.id);
    return chromeWindows.getMostRecentChromeWindow().document.getElementById(elId);
};

module.exports.windows.getMainChromeWindow = function(){
    return chromeWindows.getChromeWindows()[0];
};

array.forEach(chromeWindows.getLoadedChromeWindows(), function(a) {
    this._listenLocationChangeEvent(a)
}, module.exports);

chromeWindows.addEventListener(chromeWindows.event.WINDOW_LOAD, func.bind(function(a) {
    this._listenLocationChangeEvent(a.window)
}, module.exports));
