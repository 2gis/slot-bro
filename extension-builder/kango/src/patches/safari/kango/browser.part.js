module.exports._onLocationChange = function(a) {
    var b = this.getKangoTab(a.target);
    this.fireEvent(this.event.TAB_LOCATION_CHANGED, {tabId: b.getId(), url: a.url});
};

module.exports.isNull = function() {
    return !safari.application.activeBrowserWindow;
};

safari.application.addEventListener("beforeNavigate", func.bind(this._onLocationChange, module.exports), !0);
