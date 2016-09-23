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

var openOptions = function() {
    chrome.tabs.create({ url: 'chrome://extensions/?options=' + chrome.runtime.id });
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

chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
        chrome.notifications.create('onInstalled', {
            type: 'basic',
            iconUrl: 'img/64.png',
            title: 'Thank you for install Readit!!',
            message: 'Please set default voice in options or click here'
        });
    }
});

chrome.notifications.onClicked.addListener(function(notificationId) {
    if (notificationId == 'onInstalled') {
        chrome.notifications.clear(notificationId, openOptions);
    }
});