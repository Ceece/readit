var options = {};

var createContextMenus = function() {
    chrome.contextMenus.removeAll(function() {
        chrome.contextMenus.create({
            id: "readit",
            title: `ReadIt!! (${options.defaultVoice})`,
            contexts: ["selection"]
        });
    });
};

var getOptions = function() {
    chrome.storage.sync.get(function(items) {
        options = items;
    });
    createContextMenus();
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

    chrome.storage.onChanged.addListener(getOptions);

    getOptions();

});