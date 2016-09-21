var options = {
    defaultVoice: 'UK English Female'
};

var updateContextMenus = function() {
    chrome.contextMenus.removeAll(function() {
        chrome.contextMenus.create({
            id: "readit",
            title: `ReadIt!! (${options.defaultVoice})`,
            contexts: ["selection"]
        });
    });
};

var updateOptions = function() {
    chrome.storage.sync.get(options, function(items) {
        options = items;
    });
    updateContextMenus();
}

responsiveVoice.AddEventListener("OnLoad", function() {

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "readit"}, function(response) {
            responsiveVoice.speak(response.selection, options.defaultVoice);
        });
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        responsiveVoice.speak(info.selectionText, options.defaultVoice);
    });

    chrome.storage.onChanged.addListener(updateOptions);

    updateOptions();

});