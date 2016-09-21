var options = {};

chrome.storage.sync.get(function(items) {
    options = items;
});

responsiveVoice.AddEventListener("OnLoad", function() {

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "readit"}, function(response) {
            responsiveVoice.speak(response.selection, options.defaultVoice);
        });
    });

    chrome.contextMenus.create({
        id: "readit",
        title: "ReadIt!!",
        contexts: ["selection"]
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        responsiveVoice.speak(info.selectionText, options.defaultVoice);
    });

});