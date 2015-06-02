function openPopup() {
    var popup = document.getElementById('popup');
<<<<<<< HEAD
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
=======
    popup.width = DGExt._popupWidth;
    popup.height = DGExt._popupHeight;
    popup.src = chrome.browserAction.popupPath;
}
function refreshPopup() {
    popup.src = popup.src;
}
function openUrl() {
    console.log('try to open url');
    var url = document.getElementById('url').value;
    if (document.getElementById('page').src){
        console.log('reload page');
        chrome.tabs.updateTab({url: url});
    } else {
        console.log('first load page');
>>>>>>> e24fc16... modify background template, add watcher
        chrome.tabs.createTab({url: url});
    }
}