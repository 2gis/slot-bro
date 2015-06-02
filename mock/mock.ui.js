function openPopup() {
    var popup = document.getElementById('popup');
    popup.src = chrome.browserAction.popupPath;
}
function refreshPopup() {
    var popup = document.getElementById('popup');
    popup.src = popup.src;
}
function openUrl() {
    var url = document.getElementById('url').value;
    if (document.getElementById('page').src){
        chrome.tabs.updateTab({url: url});
    } else {
        chrome.tabs.createTab({url: url});
    }
}