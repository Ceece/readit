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

var beautifyText = function(text) {
    var pattern = /(\d+),(\d{3})/;
    while(text.match(pattern))
        text = text.replace(pattern, "$1$2");
    return text;
}

var tts = function(text, voice) {
    voice = voice || options.defaultVoice;
    responsiveVoice.speak(text, voice);
}

responsiveVoice.AddEventListener("OnLoad", function() {

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendMessage(tab.id, {action: "readit"}, function(response) {
            tts(response.selection)
        });
    });

    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        tts(info.selectionText)
    });

    chrome.storage.onChanged.addListener(updateOptions);
    chrome.runtime.onInstalled.addListener(updateOptions);

});