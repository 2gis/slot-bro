BrowserButton.prototype.resizePopup = function(a,b) {
    var p=this._getButton();
    p.popover.width = a;
    p.popover.height = b;
};
extensionInfo.browser_button && (module.exports = new BrowserButton(extensionInfo.browser_button), module.exports.getPublicApi = getPublicApi);
