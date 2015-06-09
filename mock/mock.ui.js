/**
 * Mock helper
 * Initiate load popup.html in popup frame
 */
function openPopup() {
    var popup = document.getElementById('popup');
    popup.onload = function() {
        chrome.browserAction.clickOnExtensionButton();
    };
    popup.src = chrome.browserAction.popupPath;
}
/**
 * Mock helper
 * Reload popup frame
 */
function refreshPopup() {
    var popup = document.getElementById('popup');
    popup.src = popup.src;
}
/**
 * Mock helper
 * Initiate load url in page frame
 */
function openUrl() {
    var url = document.getElementById('url').value;
    if (document.getElementById('page').src) {
        chrome.tabs.update('tab id', {url: url});
    } else {
        chrome.tabs.create({url: url});
    }
}
