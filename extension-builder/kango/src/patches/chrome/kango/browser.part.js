module.exports._currentUrlList = {};
module.exports._onTabUpdated = function (tabId, changeInfo, tab) {
    if (changeInfo.url && (!this._currentUrlList[tabId] || this._currentUrlList[tabId] != changeInfo.url)) {
        this._currentUrlList[tabId] = changeInfo.url;
        this.fireEvent(this.event.TAB_LOCATION_CHANGED, {tabId: tabId, url: changeInfo.url});
    }
};
module.exports.windows.isNull = function(){
    return false;
};
chrome.tabs.onUpdated.addListener(func.bind(module.exports._onTabUpdated, module.exports));
