var options = {
    defaultVoice: 'en-US'
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

var updateOptions = function(changed) {
    if (changed !== undefined) {
        options.defaultVoice = changed.defaultVoice.newValue;
        updateContextMenus();
    } else {
        chrome.storage.sync.get(function(items) {
            options.defaultVoice = items.defaultVoice;
            updateContextMenus();
        });
    }
}

var beautifyText = function(text) {
    var pattern = /(\d+),(\d{3})/;
    while(text.match(pattern))
        text = text.replace(pattern, "$1$2");
    return text;
}

var tts = function(text, voice) {
    voice = voice || options.defaultVoice;
    chrome.tts.speak(beautifyText(text), {
        lang: voice,
        onEvent: function(event) {
            switch(event.type) {
                case 'start': ttsOnStart(); break;
                case 'end': ttsOnStop(); break;
            }
        }
    });
}

var ttsOnStart = function() {
    chrome.browserAction.setIcon({ path: 'img/stop.png' })
}

var ttsOnStop = function() {
    chrome.browserAction.setIcon({ path: 'img/64.png' })
}

var openOptions = function() {
    chrome.tabs.create({ url: 'chrome://extensions/?options=' + chrome.runtime.id });
}

updateOptions();
chrome.storage.onChanged.addListener(updateOptions);

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { action: "browserAction" }, function(response) {
        chrome.tts.isSpeaking(function(isSpeaking) {
            if(isSpeaking) {
                ttsOnStop();
                chrome.tts.stop();
            } else {
                tts(response.selection);
            }
        })
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    tts(info.selectionText);
});

chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
        chrome.storage.sync.get(function(items) {
            if (items.defaultVoice) {
                openOptions();
            }
        });

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
