var options = {};

chrome.storage.sync.get(function(items) {
    options = items;
});

responsiveVoice.AddEventListener("OnLoad", function() {
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "speakit"}, function(response) {
            responsiveVoice.speak(response.selection, options.defaultVoice);
        });
    });
});