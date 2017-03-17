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

var formatText = function(text) {
    var pattern = /(\d+),(\d{3})/;
    while(text.match(pattern))
        text = text.replace(pattern, "$1$2");
    return text;
}

var ttsSpeak = function(text, voice) {
    text = formatText(text);
    voice = voice || options.defaultVoice;
    chrome.tts.speak(text, {
        lang: voice,
        onEvent: function(event) {
            switch(event.type) {
                case 'start':
                    ttsOnStart();
                    break;
                case 'error':
                    alert(event.errorMessage);
                case 'end':
                    ttsOnStop();
                    break;
            }
        }
    }, function() {
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            ttsOnStop();
        }
    });
}

var ttsOnStart = function() {
    chrome.browserAction.setIcon({ path: 'img/stop.png' })
}

var ttsOnStop = function() {
    chrome.browserAction.setIcon({
        path: {
            "16": "img/16.png",
            "24": "img/24.png",
            "32": "img/32.png",
            "64": "img/64.png"
        }
    });
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
                ttsSpeak(response.selection);
            }
        })
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    ttsSpeak(info.selectionText);
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
